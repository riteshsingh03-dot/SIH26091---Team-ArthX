from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from engines.eligibility.scheme_selection import select_scheme
from engines.eligibility.rules import check_eligibility
from engines.financial.loan import calculate_loan_structure
from engines.financial.repayment import generate_repayment_schedule
from engines.financial.exceptions import InvalidFinancialInput

from engines.llm.extraction import extract_user_intent
from engines.llm.explanation import generate_explanation
from engines.retrieval.search import search_scheme_documents


from engines.financial.loan import calculate_loan_structure

from engines.financial.sensitivity import compare_scenarios, run_sensitivity_analysis

class SensitivityRequest(BaseModel):
    base_inputs: dict
    vary_field: str
    values: list[float]


class ScenarioComparisonRequest(BaseModel):
    base_inputs: dict
    scenarios: dict[str, dict]  # e.g. {"Scenario A": {...}, "Scenario B": {...}}

class ChatRequest(BaseModel):
    message: str

app = FastAPI()

class FeasibilityRequest(BaseModel):
    project_cost: float
    state: str
    business_category: str
    margin_pct: float = 0.10


@app.post("/feasibility")
def get_feasibility(req: FeasibilityRequest):
    scheme = select_scheme(project_cost=req.project_cost, state=req.state)
    if scheme is None:
        raise HTTPException(status_code=404, detail="No matching scheme found for this project cost/state.")

    user_profile = {
        "project_cost": req.project_cost,
        "state": req.state,
        "business_category": req.business_category,
    }
    eligibility = check_eligibility(user_profile, scheme["id"])

    try:
        loan = calculate_loan_structure(req.project_cost, req.margin_pct)
        schedule, installment = generate_repayment_schedule(
            principal=loan["loan_amount"],
            annual_rate_pct=float(scheme["interest_rate"]),
            tenure_months=scheme["tenure_months"],
            moratorium_months=scheme["moratorium_months"],
            frequency=scheme["repayment_frequency"],
        )
    except InvalidFinancialInput as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "scheme": {"name": scheme["name"], "interest_rate": scheme["interest_rate"], "is_illustrative": scheme["is_illustrative"]},
        "eligibility": eligibility,
        "loan": loan,
        "installment": installment,
        "repayment_schedule": schedule,
    }

@app.post("/chat")
def chat(req: ChatRequest):
    extracted = extract_user_intent(req.message)

    # If project_cost wasn't stated but margin_capital was, derive it
    if extracted.get("project_cost") is None and extracted.get("margin_capital") is not None:
        margin_pct = 0.10  # or read from a default/config
        extracted["project_cost"] = extracted["margin_capital"] / margin_pct

    if extracted.get("project_cost") is None:
        raise HTTPException(status_code=400, detail="Could not determine project cost or available capital from your message.")

    scheme = select_scheme(project_cost=extracted["project_cost"], state=extracted.get("state"))
    if scheme is None:
        raise HTTPException(status_code=404, detail="No matching scheme found.")

    user_profile = {
        "project_cost": extracted["project_cost"],
        "state": extracted.get("state"),
        "business_category": extracted.get("business_category"),
    }
    eligibility = check_eligibility(user_profile, scheme["id"])

    loan = calculate_loan_structure(extracted["project_cost"], extracted.get("margin_pct", 0.10))
    schedule, installment = generate_repayment_schedule(
        principal=loan["loan_amount"],
        annual_rate_pct=float(scheme["interest_rate"]),
        tenure_months=scheme["tenure_months"],
        moratorium_months=scheme["moratorium_months"],
        frequency=scheme["repayment_frequency"],
    )

    retrieved = search_scheme_documents(req.message, scheme_id=scheme["id"], top_k=3)

    explanation = generate_explanation(scheme, eligibility, loan, installment, retrieved)

    return {
        "explanation": explanation,
        "scheme": scheme,
        "eligibility": eligibility,
        "loan": loan,
        "installment": installment,
        "retrieved_chunks": retrieved,
    }


@app.post("/scenarios/compare")
def compare_scenarios_endpoint(req: ScenarioComparisonRequest):
    return compare_scenarios(req.base_inputs, req.scenarios)


@app.post("/scenarios/sensitivity")
def sensitivity_endpoint(req: SensitivityRequest):
    return run_sensitivity_analysis(req.base_inputs, req.vary_field, req.values)

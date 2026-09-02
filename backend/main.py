from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json

from engines.eligibility.scheme_selection import select_scheme
from engines.eligibility.rules import check_eligibility
from engines.financial.loan import calculate_loan_structure
from engines.financial.repayment import generate_repayment_schedule
from engines.financial.exceptions import InvalidFinancialInput

from engines.llm.swot import generate_swot
from engines.llm.extraction import extract_user_intent
from engines.llm.explanation import generate_explanation
from engines.retrieval.search import search_scheme_documents


from engines.financial.loan import calculate_loan_structure
from engines.financial.sensitivity import compare_scenarios, run_sensitivity_analysis

from engines.journal.entries import add_journal_entry, get_entries
from engines.journal.query import answer_journal_question

from engines.market.competitor_service import refresh_competitors, get_stored_competitors
from engines.market.competitor_service import refresh_competitors, get_stored_competitors, resolve_location_id


class SensitivityRequest(BaseModel):
    base_inputs: dict
    vary_field: str
    values: list[float]


class ScenarioComparisonRequest(BaseModel):
    base_inputs: dict
    scenarios: dict[str, dict]  # e.g. {"Scenario A": {...}, "Scenario B": {...}}

class ChatRequest(BaseModel):
    message: str
    experience_level: str = "intermediate"
    location_id: int | None = None

class JournalEntryRequest(BaseModel):
    entry_date: str
    sales_revenue: float | None = None
    expenses: float | None = None
    units_sold: float | None = None
    notes: str | None = None

class JournalQuestionRequest(BaseModel):
    question: str

app = FastAPI()

def get_competitor_mapping(location_id: int | None, business_category: str | None) -> dict | None:
    if location_id is None or business_category is None:
        return None
    try:
        rows = get_stored_competitors(location_id, business_category)
        if not rows:
            # nothing cached yet -> fetch live from OSM
            refresh_competitors(location_id, business_category)
            rows = get_stored_competitors(location_id, business_category)
        return {
            "competitor_count": len(rows),
            "nearest": rows[:5],  # top 5 closest, keep payload light
        }
    except (ValueError, RuntimeError):
        # bad location_id or OSM down -- don't break the whole feasibility report over this
        return None

class FeasibilityRequest(BaseModel):
    state: str
    business_category: str
    margin_pct: float = 0.10
    project_cost: float | None = None
    margin_capital: float | None = None
    experience_level: str = "intermediate"
    location_id: int | None = None


@app.post("/feasibility")
def get_feasibility(req: FeasibilityRequest):
    if req.project_cost is None:
        if req.margin_capital is None:
            raise HTTPException(status_code=400, detail="Provide either project_cost or margin_capital.")
        if not (0 < req.margin_pct < 1):
            raise HTTPException(status_code=400, detail="margin_pct must be between 0 and 1 (exclusive) to derive project_cost.")
        req.project_cost = req.margin_capital / req.margin_pct

    scheme = select_scheme(project_cost=req.project_cost, state=req.state)
    if scheme is None:
        raise HTTPException(status_code=404, detail="No matching scheme found for this project cost/state.")

    user_profile = {
        "project_cost": req.project_cost,
        "state": req.state,
        "business_category": req.business_category,
    }
    eligibility = check_eligibility(user_profile, scheme["id"])

    competitor_mapping = get_competitor_mapping(req.location_id, req.business_category)

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
        "competitor_mapping": competitor_mapping, 
    }

@app.post("/chat")
def chat(req: ChatRequest):
    try:
        extracted = extract_user_intent(req.message)
    except (json.JSONDecodeError, KeyError, IndexError) as e:
        raise HTTPException(status_code=502, detail="Could not understand the message right now. Please try rephrasing.")

    resolved_location_id = req.location_id or resolve_location_id(
    village_name=extracted.get("village_name"),
    block=extracted.get("block"),
    district=extracted.get("district"),
)

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

    competitor_mapping = get_competitor_mapping(resolved_location_id, extracted.get("business_category"))
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

    explanation = generate_explanation(
    scheme, eligibility, loan, installment, retrieved,
    experience_level=req.experience_level
)
    swot = generate_swot(
    business_category=extracted.get("business_category"),
    project_cost=extracted["project_cost"],
    loan_amount=loan["loan_amount"],
    location={"village_name": None, "block": None, "district": None, "state": extracted.get("state")},
    experience_level=req.experience_level,
    competitor_mapping=competitor_mapping,
)

    return {
        "explanation": explanation,
        "scheme": scheme,
        "eligibility": eligibility,
        "loan": loan,
        "installment": installment,
        "retrieved_chunks": retrieved,
        "swot": swot,
        "competitor_mapping": competitor_mapping, 
    }


@app.post("/scenarios/compare")
def compare_scenarios_endpoint(req: ScenarioComparisonRequest):
    return compare_scenarios(req.base_inputs, req.scenarios)


@app.post("/scenarios/sensitivity")
def sensitivity_endpoint(req: SensitivityRequest):
    return run_sensitivity_analysis(req.base_inputs, req.vary_field, req.values)

@app.post("/journal/entry")
def create_journal_entry(req: JournalEntryRequest):
    return add_journal_entry(**req.model_dump())

@app.get("/journal/entries")
def list_journal_entries(start_date: str = None, end_date: str = None):
    return get_entries(start_date, end_date)

@app.post("/journal/ask")
def ask_journal(req: JournalQuestionRequest):
    return answer_journal_question(req.question)
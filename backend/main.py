from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from engines.eligibility.scheme_selection import select_scheme
from engines.eligibility.rules import check_eligibility
from engines.financial.loan import calculate_loan_structure
from engines.financial.repayment import generate_repayment_schedule
from engines.financial.exceptions import InvalidFinancialInput

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
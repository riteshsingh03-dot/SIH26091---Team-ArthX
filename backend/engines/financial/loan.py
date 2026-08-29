from engines.financial.exceptions import InvalidFinancialInput

def calculate_loan_structure(project_cost: float, margin_pct: float = 0.10) -> dict:
    if project_cost <= 0:
        raise InvalidFinancialInput("project_cost must be positive")
    if not (0 <= margin_pct < 1):
        raise InvalidFinancialInput("margin_pct must be between 0 and 1")
    margin_amount = round(project_cost * margin_pct, 2)
    loan_amount = round(project_cost - margin_amount, 2)
    return {"project_cost": project_cost, "margin_amount": margin_amount, "loan_amount": loan_amount}

def check_capital_sufficiency(available_capital: float, required_margin: float) -> dict:
    shortfall = max(0, round(required_margin - available_capital, 2))
    return {"sufficient": shortfall == 0, "shortfall": shortfall}
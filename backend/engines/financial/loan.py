from .exceptions import InvalidFinancialInput


def calculate_loan_structure(project_cost: float, margin_pct: float = 0.10) -> dict:
    """
    project_cost: total cost of the proposed project/business
    margin_pct: beneficiary's own contribution as a fraction (e.g. 0.10 = 10%)

    Returns: {project_cost, margin_amount, loan_amount}
    """
    if project_cost <= 0:
        raise InvalidFinancialInput("project_cost must be positive")
    if not (0 <= margin_pct < 1):
        raise InvalidFinancialInput("margin_pct must be between 0 and 1")

    margin_amount = round(project_cost * margin_pct, 2)
    loan_amount = round(project_cost - margin_amount, 2)

    return {
        "project_cost": project_cost,
        "margin_amount": margin_amount,
        "loan_amount": loan_amount,
    }


def check_capital_sufficiency(available_capital: float, required_margin: float) -> dict:
    """
    Checks whether the user's stated available capital covers the required margin.
    Returns: {sufficient: bool, shortfall: float}
    """
    if available_capital < 0 or required_margin < 0:
        raise InvalidFinancialInput("available_capital and required_margin cannot be negative")

    shortfall = max(0, round(required_margin - available_capital, 2))
    return {"sufficient": shortfall == 0, "shortfall": shortfall}
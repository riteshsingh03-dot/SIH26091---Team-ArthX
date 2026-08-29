from engines.financial.exceptions import InvalidFinancialInput

def calculate_monthly_cashflow(opening_cash: float, revenue: float, expenses: float, emi: float = 0, inventory_purchase: float = 0) -> dict:
    closing_cash = round(opening_cash + revenue - expenses - emi - inventory_purchase, 2)
    return {"closing_cash": closing_cash, "deficit": closing_cash < 0}

def project_cashflow_series(opening_cash: float, monthly_revenue: list[float], monthly_expenses: list[float], emi: float = 0, inventory_purchases: list[float] = None) -> list[dict]:
    """Each list is per-month; lists must be equal length. Tracks running cash and flags deficit months."""
    n = len(monthly_revenue)
    inventory_purchases = inventory_purchases or [0] * n
    if not (len(monthly_expenses) == n == len(inventory_purchases)):
        raise InvalidFinancialInput("monthly_revenue, monthly_expenses, inventory_purchases must be same length")
    results = []
    cash = opening_cash
    for i in range(n):
        result = calculate_monthly_cashflow(cash, monthly_revenue[i], monthly_expenses[i], emi, inventory_purchases[i])
        result["month"] = i + 1
        cash = result["closing_cash"]
        results.append(result)
    return results
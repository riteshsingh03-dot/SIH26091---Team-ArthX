import random
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

def simulate_survival(initial_cash: float, base_monthly_revenue: float, base_monthly_expenses: float,
                       emi: float = 0, months: int = 12, iterations: int = 1000,
                       revenue_volatility: float = 0.25, expense_volatility: float = 0.10) -> dict:
    """
    Runs `iterations` randomized monthly cashflow trials over `months` months.
    Each month's revenue/expenses are jittered by +/- volatility to simulate
    seasonal/market demand swings. A trial 'survives' if cash never goes negative.
    """
    if initial_cash < 0:
        raise InvalidFinancialInput("initial_cash cannot be negative")
    if iterations <= 0 or months <= 0:
        raise InvalidFinancialInput("iterations and months must be positive")

    survived_count = 0

    for _ in range(iterations):
        cash = initial_cash
        survived = True
        for _ in range(months):
            revenue = base_monthly_revenue * random.uniform(1 - revenue_volatility, 1 + revenue_volatility)
            expenses = base_monthly_expenses * random.uniform(1 - expense_volatility, 1 + expense_volatility)
            cash = cash + revenue - expenses - emi
            if cash < 0:
                survived = False
                break
        if survived:
            survived_count += 1

    survival_probability_pct = round((survived_count / iterations) * 100, 1)

    if survival_probability_pct > 80:
        risk_level = "Low"
    elif survival_probability_pct > 50:
        risk_level = "Moderate"
    else:
        risk_level = "High"

    return {
        "survival_probability_pct": survival_probability_pct,
        "risk_level": risk_level,
        "simulated_iterations": iterations,
    }
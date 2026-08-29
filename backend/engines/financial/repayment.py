from engines.financial.exceptions import InvalidFinancialInput

def calculate_emi(principal: float, annual_rate_pct: float, tenure_months: int) -> float:
    if principal <= 0 or tenure_months <= 0:
        raise InvalidFinancialInput("principal and tenure_months must be positive")
    if annual_rate_pct < 0:
        raise InvalidFinancialInput("annual_rate_pct cannot be negative")
    r = annual_rate_pct / 12 / 100
    if r == 0:
        return round(principal / tenure_months, 2)
    emi = principal * r * (1 + r)**tenure_months / ((1 + r)**tenure_months - 1)
    return round(emi, 2)

def generate_repayment_schedule(principal: float, annual_rate_pct: float, tenure_months: int, moratorium_months: int = 0) -> list[dict]:
    """
    Returns list of dicts: {month, opening_balance, interest, principal_paid, emi, closing_balance}
    During moratorium: interest accrues and capitalizes into principal, no EMI paid.
    After moratorium: standard EMI on the (possibly increased) principal, over remaining tenure.
    """
    schedule = []
    balance = principal
    r = annual_rate_pct / 12 / 100

    for month in range(1, moratorium_months + 1):
        interest = round(balance * r, 2)
        balance = round(balance + interest, 2)  # capitalized
        schedule.append({"month": month, "opening_balance": balance - interest, "interest": interest,
                          "principal_paid": 0, "emi": 0, "closing_balance": balance})

    remaining_months = tenure_months - moratorium_months
    if remaining_months <= 0:
        raise InvalidFinancialInput("moratorium_months must be less than tenure_months")
    emi = calculate_emi(balance, annual_rate_pct, remaining_months)

    for i in range(remaining_months):
        month = moratorium_months + i + 1
        interest = round(balance * r, 2)
        principal_paid = round(emi - interest, 2)
        balance = round(balance - principal_paid, 2)
        schedule.append({"month": month, "opening_balance": balance + principal_paid, "interest": interest,
                          "principal_paid": principal_paid, "emi": emi, "closing_balance": max(balance, 0)})
    return schedule
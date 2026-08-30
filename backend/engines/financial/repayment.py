from engines.financial.exceptions import InvalidFinancialInput

PERIODS_PER_YEAR = {"monthly": 12, "quarterly": 4}

def generate_repayment_schedule(
    principal: float,
    annual_rate_pct: float,
    tenure_months: int,
    moratorium_months: int = 0,
    frequency: str = "monthly",
    capitalize_moratorium_interest: bool = True
) -> tuple[list[dict], float]:
    """
    frequency: 'monthly' or 'quarterly'
    Returns (schedule, installment_amount)
    """
    if frequency not in PERIODS_PER_YEAR:
        raise InvalidFinancialInput("frequency must be 'monthly' or 'quarterly'")
    if principal <= 0 or tenure_months <= 0:
        raise InvalidFinancialInput("principal and tenure_months must be positive")
    if annual_rate_pct < 0:
        raise InvalidFinancialInput("annual_rate_pct cannot be negative")

    periods_per_year = PERIODS_PER_YEAR[frequency]
    months_per_period = 12 // periods_per_year          # 1 for monthly, 3 for quarterly
    if moratorium_months % months_per_period != 0 or tenure_months % months_per_period != 0:
        raise InvalidFinancialInput(
            f"moratorium_months and tenure_months must be multiples of {months_per_period} for {frequency} frequency"
        )
    period_rate = (annual_rate_pct / 100) / periods_per_year

    total_periods = tenure_months // months_per_period
    moratorium_periods = moratorium_months // months_per_period
    repayment_periods = total_periods - moratorium_periods

    if repayment_periods <= 0:
        raise InvalidFinancialInput("moratorium period must be shorter than total tenure")

    schedule = []
    balance = principal
    label = "Month" if frequency == "monthly" else "Quarter"

    # Moratorium: interest accrues, optionally capitalized, no repayment
    for p in range(1, moratorium_periods + 1):
        interest = round(balance * period_rate, 2)
        opening = balance
        if capitalize_moratorium_interest:
            balance = round(balance + interest, 2)
        schedule.append({
            "period": f"Moratorium {label} {p}",
            "opening_balance": opening,
            "interest": interest,
            "principal_paid": 0,
            "installment": 0,
            "closing_balance": balance
        })

    # Repayment: standard amortizing installment
    if period_rate == 0:
        installment = round(balance / repayment_periods, 2)
    else:
        installment = round(
            balance * period_rate * (1 + period_rate) ** repayment_periods /
            ((1 + period_rate) ** repayment_periods - 1), 2
        )

    for p in range(1, repayment_periods + 1):
        interest = round(balance * period_rate, 2)
        principal_paid = round(installment - interest, 2)
        opening = balance
        balance = round(balance - principal_paid, 2)
        schedule.append({
            "period": f"Repay {label} {p}",
            "opening_balance": opening,
            "interest": interest,
            "principal_paid": principal_paid,
            "installment": installment,
            "closing_balance": max(balance, 0)
        })

    return schedule, installment
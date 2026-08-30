# tests/test_repayment.py

import pytest
from engines.financial.repayment import generate_repayment_schedule
from engines.financial.exceptions import InvalidFinancialInput


def test_schedule_quarterly_matches_teammate_reference():
    """Cross-check against the teammate's original notebook output:
    ₹9,00,000 @ 8% p.a., 84 months tenure, 6-month moratorium, quarterly.
    Expected: 26 periods total (2 moratorium + 24 repay... but original had 26 repay rows,
    so 2 moratorium + 26 repay = 28 total — verify count and installment amount below).
    """
    schedule, installment = generate_repayment_schedule(
        principal=900000,
        annual_rate_pct=8.0,
        tenure_months=84,
        moratorium_months=6,
        frequency="quarterly"
    )
    # 84 months / 3 = 28 quarters total, 6 months / 3 = 2 moratorium quarters, 26 repay quarters
    assert len(schedule) == 28
    moratorium_rows = [r for r in schedule if "Moratorium" in r["period"]]
    repay_rows = [r for r in schedule if "Repay" in r["period"]]
    assert len(moratorium_rows) == 2
    assert len(repay_rows) == 26
    # Installment should match the reference value closely (₹46,536.37)
    assert abs(installment - 46536.37) < 1.0


def test_schedule_moratorium_capitalizes_interest():
    schedule, _ = generate_repayment_schedule(
        principal=900000, annual_rate_pct=8.0, tenure_months=84,
        moratorium_months=6, frequency="quarterly", capitalize_moratorium_interest=True
    )
    q1 = schedule[0]
    q2 = schedule[1]
    assert q1["closing_balance"] == 918000.0  # 900000 + 18000 interest
    assert q2["opening_balance"] == 918000.0   # capitalized into next period's opening


def test_schedule_moratorium_no_capitalization():
    schedule, _ = generate_repayment_schedule(
        principal=100000, annual_rate_pct=12.0, tenure_months=24,
        moratorium_months=3, frequency="monthly", capitalize_moratorium_interest=False
    )
    q1 = schedule[0]
    assert q1["closing_balance"] == 100000.0  # balance unchanged, interest not capitalized


def test_schedule_monthly_basic():
    schedule, installment = generate_repayment_schedule(
        principal=120000, annual_rate_pct=0, tenure_months=12, frequency="monthly"
    )
    assert len(schedule) == 12
    assert installment == 10000.0  # zero rate: flat division


def test_schedule_final_balance_reaches_zero():
    schedule, _ = generate_repayment_schedule(
        principal=900000, annual_rate_pct=8.0, tenure_months=84,
        moratorium_months=6, frequency="quarterly"
    )
    last_row = schedule[-1]
    assert abs(last_row["closing_balance"]) < 1.0  # should fully amortize to ~0


def test_schedule_invalid_frequency():
    with pytest.raises(InvalidFinancialInput):
        generate_repayment_schedule(100000, 8, 12, frequency="weekly")


def test_schedule_negative_principal_invalid():
    with pytest.raises(InvalidFinancialInput):
        generate_repayment_schedule(-1000, 8, 12, frequency="monthly")


def test_schedule_negative_rate_invalid():
    with pytest.raises(InvalidFinancialInput):
        generate_repayment_schedule(100000, -5, 12, frequency="monthly")


def test_schedule_uneven_moratorium_quarterly_invalid():
    with pytest.raises(InvalidFinancialInput):
        generate_repayment_schedule(100000, 8, 12, moratorium_months=4, frequency="quarterly")


def test_schedule_uneven_tenure_quarterly_invalid():
    with pytest.raises(InvalidFinancialInput):
        generate_repayment_schedule(100000, 8, 13, frequency="quarterly")


def test_schedule_moratorium_equals_tenure_invalid():
    with pytest.raises(InvalidFinancialInput):
        generate_repayment_schedule(100000, 8, 12, moratorium_months=12, frequency="monthly")
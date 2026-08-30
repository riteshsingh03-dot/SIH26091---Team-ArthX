# tests/test_cashflow.py

import pytest
from engines.financial.cashflow import calculate_monthly_cashflow, project_cashflow_series
from engines.financial.exceptions import InvalidFinancialInput


def test_monthly_cashflow_positive():
    result = calculate_monthly_cashflow(opening_cash=50000, revenue=30000, expenses=20000)
    assert result["closing_cash"] == 60000.0
    assert result["deficit"] is False


def test_monthly_cashflow_deficit():
    result = calculate_monthly_cashflow(opening_cash=10000, revenue=5000, expenses=20000)
    assert result["closing_cash"] == -5000.0
    assert result["deficit"] is True


def test_monthly_cashflow_with_emi_and_inventory():
    result = calculate_monthly_cashflow(
        opening_cash=100000, revenue=50000, expenses=20000, emi=15000, inventory_purchase=10000
    )
    assert result["closing_cash"] == 105000.0


def test_cashflow_series_running_balance():
    series = project_cashflow_series(
        opening_cash=50000,
        monthly_revenue=[30000, 30000, 30000],
        monthly_expenses=[20000, 20000, 20000]
    )
    assert len(series) == 3
    assert series[0]["closing_cash"] == 60000.0
    assert series[1]["closing_cash"] == 70000.0  # carries forward
    assert series[2]["closing_cash"] == 80000.0


def test_cashflow_series_catches_deficit_month():
    series = project_cashflow_series(
        opening_cash=20000,
        monthly_revenue=[10000, 10000, 10000],
        monthly_expenses=[5000, 40000, 5000],  # big spike in month 2
        inventory_purchases=[0, 0, 0]
    )
    assert series[1]["deficit"] is True
    assert series[0]["deficit"] is False


def test_cashflow_series_mismatched_lengths_invalid():
    with pytest.raises(InvalidFinancialInput):
        project_cashflow_series(
            opening_cash=10000,
            monthly_revenue=[1000, 2000],
            monthly_expenses=[500]  # mismatched length
        )
# tests/test_profitability.py

import pytest
from engines.financial.profitability import (
    calculate_breakeven_units, calculate_gross_profit, calculate_net_profit
)
from engines.financial.exceptions import InvalidFinancialInput


def test_breakeven_normal():
    units = calculate_breakeven_units(fixed_costs=50000, price_per_unit=100, variable_cost_per_unit=60)
    assert units == 1250.0  # 50000 / (100-60)


def test_breakeven_zero_contribution_invalid():
    with pytest.raises(InvalidFinancialInput):
        calculate_breakeven_units(fixed_costs=50000, price_per_unit=50, variable_cost_per_unit=50)


def test_breakeven_negative_contribution_invalid():
    with pytest.raises(InvalidFinancialInput):
        calculate_breakeven_units(fixed_costs=50000, price_per_unit=40, variable_cost_per_unit=60)


def test_gross_profit():
    assert calculate_gross_profit(revenue=200000, cogs=120000) == 80000.0


def test_net_profit_with_emi():
    result = calculate_net_profit(gross_profit=80000, operating_expenses=20000, emi=15000)
    assert result == 45000.0


def test_net_profit_no_emi_default():
    result = calculate_net_profit(gross_profit=80000, operating_expenses=20000)
    assert result == 60000.0
# tests/test_scenarios.py

import pytest
from engines.financial.scenarios import run_scenario, compare_scenarios


BASE_INPUTS = {
    "project_cost": 1000000,
    "margin_pct": 0.10,
    "annual_rate_pct": 8.0,
    "tenure_months": 84,
    "fixed_costs": 50000,
    "price_per_unit": 100,
    "variable_cost_per_unit": 60,
}


def test_run_scenario_no_override():
    result = run_scenario(BASE_INPUTS)
    assert result["loan"]["loan_amount"] == 900000.0
    assert result["breakeven_units"] == 1250.0


def test_run_scenario_with_override():
    result = run_scenario(BASE_INPUTS, overrides={"price_per_unit": 120})
    assert result["breakeven_units"] == pytest.approx(833.33, rel=0.01)


def test_compare_scenarios():
    result = compare_scenarios(
        BASE_INPUTS,
        scenario_a={"price_per_unit": 100},
        scenario_b={"price_per_unit": 120}
    )
    assert result["scenario_a"]["breakeven_units"] > result["scenario_b"]["breakeven_units"]
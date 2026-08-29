from engines.financial.loan import calculate_loan_structure
from engines.financial.repayment import calculate_emi
from engines.financial.profitability import calculate_breakeven_units


def run_scenario(base_inputs: dict, overrides: dict = None) -> dict:
    inputs = {**base_inputs, **(overrides or {})}
    loan = calculate_loan_structure(inputs["project_cost"], inputs.get("margin_pct", 0.10))
    emi = calculate_emi(loan["loan_amount"], inputs["annual_rate_pct"], inputs["tenure_months"])
    breakeven = calculate_breakeven_units(inputs["fixed_costs"], inputs["price_per_unit"], inputs["variable_cost_per_unit"])
    return {"loan": loan, "emi": emi, "breakeven_units": breakeven}

def compare_scenarios(base_inputs: dict, scenario_a: dict, scenario_b: dict) -> dict:
    return {"scenario_a": run_scenario(base_inputs, scenario_a), "scenario_b": run_scenario(base_inputs, scenario_b)}
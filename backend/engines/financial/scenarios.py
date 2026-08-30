from engines.financial.loan import calculate_loan_structure
from engines.financial.repayment import generate_repayment_schedule
from engines.financial.profitability import calculate_breakeven_units


def run_scenario(base_inputs: dict, overrides: dict = None) -> dict:
    inputs = {**base_inputs, **(overrides or {})}

    loan = calculate_loan_structure(inputs["project_cost"], inputs.get("margin_pct", 0.10))

    _, installment = generate_repayment_schedule(
        principal=loan["loan_amount"],
        annual_rate_pct=inputs["annual_rate_pct"],
        tenure_months=inputs["tenure_months"],
        moratorium_months=inputs.get("moratorium_months", 0),
        frequency=inputs.get("frequency", "monthly"),
    )

    breakeven = calculate_breakeven_units(
        inputs["fixed_costs"], inputs["price_per_unit"], inputs["variable_cost_per_unit"]
    )

    return {"loan": loan, "installment": installment, "breakeven_units": breakeven}


def compare_scenarios(base_inputs: dict, scenario_a: dict, scenario_b: dict) -> dict:
    return {
        "scenario_a": run_scenario(base_inputs, scenario_a),
        "scenario_b": run_scenario(base_inputs, scenario_b),
    }
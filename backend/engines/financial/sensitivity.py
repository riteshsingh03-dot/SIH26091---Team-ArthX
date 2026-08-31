from engines.financial.loan import calculate_loan_structure
from engines.financial.repayment import generate_repayment_schedule
from engines.financial.profitability import calculate_breakeven_units, calculate_gross_profit, calculate_net_profit
from engines.financial.exceptions import InvalidFinancialInput


def run_full_scenario(inputs: dict) -> dict:
    """
    Runs one complete scenario: loan + repayment + breakeven + profit,
    given a full set of inputs. This is the 'single point' calculation
    that both comparison and sensitivity analysis are built on top of.
    """
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

    revenue = inputs.get("expected_units_sold", breakeven) * inputs["price_per_unit"]
    cogs = inputs.get("expected_units_sold", breakeven) * inputs["variable_cost_per_unit"]
    gross_profit = calculate_gross_profit(revenue, cogs)
    net_profit = calculate_net_profit(gross_profit, inputs.get("operating_expenses", 0), installment)

    return {
        "loan": loan,
        "installment": installment,
        "breakeven_units": breakeven,
        "gross_profit": gross_profit,
        "net_profit": net_profit,
    }


def compare_scenarios(base_inputs: dict, scenario_overrides: dict[str, dict]) -> dict:
    """
    scenario_overrides: e.g. {"Scenario A": {"price_per_unit": 100}, "Scenario B": {"price_per_unit": 120}}
    Runs run_full_scenario once per named scenario, with overrides merged onto base_inputs.
    """
    results = {}
    for name, overrides in scenario_overrides.items():
        merged = {**base_inputs, **overrides}
        try:
            results[name] = run_full_scenario(merged)
        except InvalidFinancialInput as e:
            results[name] = {"error": str(e)}
    return results


def run_sensitivity_analysis(base_inputs: dict, vary_field: str, values: list) -> list[dict]:
    """
    Varies ONE field across a list of values, running the full scenario
    at each point. Returns a list of {value, result} pairs — the raw
    data for a sensitivity curve/chart.

    Example: vary_field="price_per_unit", values=[80, 90, 100, 110, 120]
    """
    curve = []
    for v in values:
        trial_inputs = {**base_inputs, vary_field: v}
        try:
            result = run_full_scenario(trial_inputs)
            curve.append({vary_field: v, "result": result})
        except InvalidFinancialInput as e:
            curve.append({vary_field: v, "error": str(e)})
    return curve
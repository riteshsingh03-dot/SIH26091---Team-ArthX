from engines.financial.exceptions import InvalidFinancialInput

def calculate_breakeven_units(fixed_costs: float, price_per_unit: float, variable_cost_per_unit: float) -> float:
    contribution = price_per_unit - variable_cost_per_unit
    if contribution <= 0:
        raise InvalidFinancialInput("price_per_unit must exceed variable_cost_per_unit")
    if fixed_costs < 0:
        raise InvalidFinancialInput("fixed_costs cannot be negative")
    return round(fixed_costs / contribution, 2)

def calculate_gross_profit(revenue: float, cogs: float) -> float:
    return round(revenue - cogs, 2)

def calculate_net_profit(gross_profit: float, operating_expenses: float, emi: float = 0) -> float:
    return round(gross_profit - operating_expenses - emi, 2)
from sqlalchemy import text
from db.connection import engine


OPERATORS = {
    "=": lambda a, b: a == b,
    "!=": lambda a, b: a != b,
    "<=": lambda a, b: float(a) <= float(b),
    ">=": lambda a, b: float(a) >= float(b),
    "<": lambda a, b: float(a) < float(b),
    ">": lambda a, b: float(a) > float(b),
}


def get_rules_for_scheme(scheme_id: int) -> list[dict]:
    query = text("SELECT * FROM eligibility_rules WHERE scheme_id = :scheme_id")
    with engine.connect() as conn:
        rows = conn.execute(query, {"scheme_id": scheme_id}).mappings().all()
    return [dict(r) for r in rows]


def check_eligibility(user_profile: dict, scheme_id: int) -> dict:
    """
    user_profile: e.g. {"project_cost": 900000, "state": "Uttar Pradesh", "business_category": "dairy"}
    Returns: {eligible: bool, failed_rules: [...], missing_fields: [...]}
    """
    rules = get_rules_for_scheme(scheme_id)
    failed_rules = []
    missing_fields = []

    for rule in rules:
        field = rule["field"]
        operator = rule["operator"]
        expected_value = rule["value"]

        if field not in user_profile:
            missing_fields.append(field)
            continue

        actual_value = user_profile[field]
        compare_fn = OPERATORS.get(operator)
        if compare_fn is None:
            raise ValueError(f"Unknown operator '{operator}' in eligibility_rules")

        if not compare_fn(actual_value, expected_value):
            failed_rules.append({"field": field, "operator": operator, "expected": expected_value, "actual": actual_value})

    return {
        "eligible": len(failed_rules) == 0 and len(missing_fields) == 0,
        "failed_rules": failed_rules,
        "missing_fields": missing_fields,
    }
from sqlalchemy import text
from db.connection import engine

# Assuming scheme_id=1 already exists in `schemes`
seed_rules = [
    {"scheme_id": 1, "field": "state", "operator": "=", "value": "Uttar Pradesh"},
    {"scheme_id": 1, "field": "project_cost", "operator": "<=", "value": "140000"},
]

with engine.connect() as conn:
    for rule in seed_rules:
        conn.execute(text("""
            INSERT INTO eligibility_rules (scheme_id, field, operator, value)
            VALUES (:scheme_id, :field, :operator, :value)
        """), rule)
    conn.commit()
print("Seeded eligibility rules.")
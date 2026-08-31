from sqlalchemy import text
from db.connection import engine

with engine.connect() as conn:
    conn.execute(text("""
        INSERT INTO schemes (name, state, project_cost_min, project_cost_max, loan_share, max_loan,
                              interest_rate, tenure_months, moratorium_months, repayment_frequency, is_illustrative)
        VALUES ('Micro Finance Scheme', NULL, 0, 140000, 0.90, 125000, 6.5, 36, 3, 'quarterly', TRUE)
    """))
    conn.commit()
print("Seeded one scheme.")
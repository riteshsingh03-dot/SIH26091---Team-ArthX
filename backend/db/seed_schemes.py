from sqlalchemy import text
from db.connection import engine

SCHEMES_SQL = text("""
    INSERT INTO schemes (name, state, project_cost_min, project_cost_max, loan_share, max_loan,
                          interest_rate, tenure_months, moratorium_months, repayment_frequency, is_illustrative)
    VALUES
        -- Logic A: project_cost <= 1.40 lakh
        ('Micro Finance Scheme', NULL, 0, 140000, 0.90, 125000, 6.5, 36, 3, 'quarterly', TRUE),
        -- Logic B: 1.40 lakh < project_cost <= 50.00 lakh
        ('Term Loan Scheme', NULL, 140000, 5000000, 0.90, 4500000, 8.0, 84, 6, 'quarterly', TRUE)
""")

with engine.connect() as conn:
    conn.execute(SCHEMES_SQL)
    conn.commit()
print("Seeded schemes: Micro Finance Scheme, Term Loan Scheme.")
print("Seeded one scheme.")
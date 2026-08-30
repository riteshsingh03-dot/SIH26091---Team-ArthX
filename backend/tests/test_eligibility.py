# tests/test_eligibility.py
import pytest
from sqlalchemy import text
from db.connection import engine
from engines.eligibility.rules import check_eligibility


@pytest.fixture
def sample_scheme_and_rules():
    with engine.connect() as conn:
        result = conn.execute(text("""
            INSERT INTO schemes (name, project_cost_min, project_cost_max, loan_share, max_loan, interest_rate, tenure_months)
            VALUES ('Test Scheme', 0, 140000, 0.9, 125000, 6.5, 36)
            RETURNING id
        """))
        scheme_id = result.scalar()
        conn.execute(text("""
            INSERT INTO eligibility_rules (scheme_id, field, operator, value)
            VALUES (:sid, 'state', '=', 'Uttar Pradesh'), (:sid, 'project_cost', '<=', '140000')
        """), {"sid": scheme_id})
        conn.commit()

    yield scheme_id

    with engine.connect() as conn:
        conn.execute(text("DELETE FROM eligibility_rules WHERE scheme_id = :sid"), {"sid": scheme_id})
        conn.execute(text("DELETE FROM schemes WHERE id = :sid"), {"sid": scheme_id})
        conn.commit()


def test_eligible_user(sample_scheme_and_rules):
    profile = {"state": "Uttar Pradesh", "project_cost": 100000}
    result = check_eligibility(profile, sample_scheme_and_rules)
    assert result["eligible"] is True


def test_ineligible_wrong_state(sample_scheme_and_rules):
    profile = {"state": "Bihar", "project_cost": 100000}
    result = check_eligibility(profile, sample_scheme_and_rules)
    assert result["eligible"] is False
    assert any(r["field"] == "state" for r in result["failed_rules"])


def test_missing_field(sample_scheme_and_rules):
    profile = {"state": "Uttar Pradesh"}  # project_cost missing
    result = check_eligibility(profile, sample_scheme_and_rules)
    assert result["eligible"] is False
    assert "project_cost" in result["missing_fields"]
from sqlalchemy import text
from db.connection import engine


def select_scheme(project_cost: float, state: str = None) -> dict | None:
    """
    Finds the best-matching scheme for a given project cost.
    state=None matches central schemes (state IS NULL) OR state-specific ones matching the user's state.
    Returns the scheme as a dict, or None if nothing matches.
    """
    query = text("""
        SELECT * FROM schemes
        WHERE :cost > project_cost_min AND :cost <= project_cost_max
        AND (state IS NULL OR state = :state)
        ORDER BY state NULLS LAST
        LIMIT 1
    """)
    with engine.connect() as conn:
        result = conn.execute(query, {"cost": project_cost, "state": state}).mappings().first()
    return dict(result) if result else None
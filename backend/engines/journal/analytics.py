from sqlalchemy import text
from db.connection import engine


def get_extreme(field: str, mode: str = "max", start_date: str = None, end_date: str = None) -> dict | None:
    """field: 'sales_revenue' | 'expenses' | 'units_sold'. mode: 'max' | 'min'."""
    if field not in ("sales_revenue", "expenses", "units_sold"):
        raise ValueError("Invalid field")
    order = "DESC" if mode == "max" else "ASC"

    sql = f"""
        SELECT entry_date, {field} FROM journal_entries
        WHERE {field} IS NOT NULL
    """
    params = {}
    if start_date:
        sql += " AND entry_date >= :start_date"
        params["start_date"] = start_date
    if end_date:
        sql += " AND entry_date <= :end_date"
        params["end_date"] = end_date
    sql += f" ORDER BY {field} {order} LIMIT 1"

    with engine.connect() as conn:
        row = conn.execute(text(sql), params).mappings().first()
    return dict(row) if row else None


def get_monthly_totals(field: str) -> list[dict]:
    if field not in ("sales_revenue", "expenses", "units_sold"):
        raise ValueError("Invalid field")
    sql = text(f"""
        SELECT date_trunc('month', entry_date) AS month, SUM({field}) AS total
        FROM journal_entries
        WHERE {field} IS NOT NULL
        GROUP BY month
        ORDER BY month
    """)
    with engine.connect() as conn:
        rows = conn.execute(sql).mappings().all()
    return [{"month": r["month"].strftime("%Y-%m"), "total": float(r["total"])} for r in rows]


def get_summary_stats(start_date: str = None, end_date: str = None) -> dict:
    sql = """
        SELECT
            COUNT(*) AS entry_count,
            SUM(sales_revenue) AS total_sales,
            SUM(expenses) AS total_expenses,
            AVG(sales_revenue) AS avg_sales,
            AVG(expenses) AS avg_expenses
        FROM journal_entries WHERE 1=1
    """
    params = {}
    if start_date:
        sql += " AND entry_date >= :start_date"
        params["start_date"] = start_date
    if end_date:
        sql += " AND entry_date <= :end_date"
        params["end_date"] = end_date

    with engine.connect() as conn:
        row = conn.execute(text(sql), params).mappings().first()
    return dict(row)
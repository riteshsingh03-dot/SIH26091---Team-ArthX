from sqlalchemy import text
from db.connection import engine


def add_journal_entry(entry_date: str, sales_revenue: float = None,
                       expenses: float = None, units_sold: float = None,
                       notes: str = None) -> dict:
    query = text("""
        INSERT INTO journal_entries (entry_date, sales_revenue, expenses, units_sold, notes)
        VALUES (:entry_date, :sales_revenue, :expenses, :units_sold, :notes)
        RETURNING id, entry_date, sales_revenue, expenses, units_sold, notes
    """)
    with engine.connect() as conn:
        row = conn.execute(query, {
            "entry_date": entry_date,
            "sales_revenue": sales_revenue,
            "expenses": expenses,
            "units_sold": units_sold,
            "notes": notes,
        }).mappings().first()
        conn.commit()
    return dict(row)


def get_entries(start_date: str = None, end_date: str = None) -> list[dict]:
    sql = "SELECT * FROM journal_entries WHERE 1=1"
    params = {}
    if start_date:
        sql += " AND entry_date >= :start_date"
        params["start_date"] = start_date
    if end_date:
        sql += " AND entry_date <= :end_date"
        params["end_date"] = end_date
    sql += " ORDER BY entry_date"

    with engine.connect() as conn:
        rows = conn.execute(text(sql), params).mappings().all()
    return [dict(r) for r in rows]
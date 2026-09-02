from db.connection import engine
from sqlalchemy import text

with engine.connect() as conn:
    rows = conn.execute(text(
        "SELECT id, village_name, block, district, latitude, longitude FROM locations"
    )).mappings().all()

    if not rows:
        print("No rows in locations table -- you need to run seed_locations.py first.")
    else:
        for r in rows:
            print(dict(r))
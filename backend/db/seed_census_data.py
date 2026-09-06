import pandas as pd
from sqlalchemy import text
from db.connection import engine

CENSUS_CSV_URL = "https://raw.githubusercontent.com/nishusharma1608/India-Census-2011-Analysis/master/india-districts-census-2011.csv"


def seed_census_data():
    df = pd.read_csv(CENSUS_CSV_URL)
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    required = {"state_name", "district_name", "population"}
    missing = required - set(df.columns)
    if missing:
        raise RuntimeError(f"Census CSV is missing expected columns: {missing}")

    has_households = "households" in df.columns

    with engine.connect() as conn:
        for _, row in df.iterrows():
            conn.execute(text("""
                INSERT INTO census_district_population (state_name, district_name, population, households, source)
                VALUES (:state_name, :district_name, :population, :households, 'census_2011')
                ON CONFLICT (state_name, district_name)
                DO UPDATE SET population = :population, households = :households
            """), {
                "state_name": str(row["state_name"]).strip(),
                "district_name": str(row["district_name"]).strip(),
                "population": int(row["population"]) if pd.notna(row["population"]) else None,
                "households": int(row["households"]) if has_households and pd.notna(row.get("households")) else None,
            })
        conn.commit()

    print(f"Seeded {len(df)} district census rows.")


if __name__ == "__main__":
    seed_census_data()
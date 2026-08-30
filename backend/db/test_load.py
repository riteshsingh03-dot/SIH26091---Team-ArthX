import pandas as pd
from db.connection import engine

test_villages = pd.DataFrame([
    {"village_name": "Testpur", "district": "Balrampur", "state": "Uttar Pradesh", "latitude": 27.43, "longitude": 82.18},
    {"village_name": "Sampleganj", "district": "Balrampur", "state": "Uttar Pradesh", "latitude": 27.45, "longitude": 82.20},
    {"village_name": "Mockvillage", "district": "Balrampur", "state": "Uttar Pradesh", "latitude": 27.40, "longitude": 82.15},
])

test_villages.to_sql("locations", engine, if_exists="append", index=False)
print(f"Inserted {len(test_villages)} test villages.")
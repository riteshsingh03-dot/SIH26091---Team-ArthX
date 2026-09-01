import requests
import pandas as pd
from sqlalchemy import text
from db.connection import engine

# --- MVP SCOPE: districts to seed, all within Uttar Pradesh ---
PLACES_TO_SEED = [
    "Balrampur, Uttar Pradesh, India",
    "Gonda, Uttar Pradesh, India",
    "Shravasti, Uttar Pradesh, India",
]
RADIUS_METERS = 10000  # 10 km, per PS spec


def geocode_place(place: str) -> dict:
    """Looks up a place name and returns its coordinates, district, and state."""
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": place, "format": "json", "limit": 1}
    headers = {"User-Agent": "SIH-Population-Project/1.0"}

    response = requests.get(url, params=params, headers=headers)
    data = response.json()

    if not data:
        raise ValueError(f"Nominatim found no match for '{place}'")

    latitude = float(data[0]["lat"])
    longitude = float(data[0]["lon"])

    name_parts = [p.strip() for p in data[0]["display_name"].split(",")]
    district = name_parts[0]
    state = name_parts[-2] if len(name_parts) >= 2 else None

    return {"latitude": latitude, "longitude": longitude, "district": district, "state": state}


def fetch_villages(latitude: float, longitude: float, radius: int) -> list[dict]:
    """Queries Overpass for villages within `radius` meters of the given point."""
    query = f"""
    [out:json][timeout:60];
    node
      ["place"="village"]
      (around:{radius},{latitude},{longitude});
    out;
    """
    url = "https://overpass-api.de/api/interpreter"
    response = requests.post(url, data=query, headers={"User-Agent": "SIH-Population-Project/1.0"})
    data = response.json()

    if "elements" not in data:
        raise ValueError(f"Overpass query failed: {data}")

    return data["elements"]


def get_existing_osm_ids() -> set[str]:
    with engine.connect() as conn:
        rows = conn.execute(text("SELECT osm_node_id FROM locations WHERE osm_node_id IS NOT NULL")).fetchall()
    return {str(r[0]) for r in rows}


def seed_locations_for_place(place: str, radius: int, existing_ids: set[str]) -> int:
    """Geocodes `place`, fetches nearby villages, inserts new ones. Returns count inserted."""
    geo = geocode_place(place)
    elements = fetch_villages(geo["latitude"], geo["longitude"], radius)

    rows = []
    skipped_no_name = 0
    skipped_duplicate = 0

    for element in elements:
        tags = element.get("tags", {})
        name = tags.get("name")
        osm_id = str(element.get("id"))

        if not name:
            skipped_no_name += 1
            continue
        if osm_id in existing_ids:
            skipped_duplicate += 1
            continue

        rows.append({
            "village_name": name,
            "block": None,
            "district": geo["district"],
            "state": geo["state"],
            "latitude": element.get("lat"),
            "longitude": element.get("lon"),
            "population": tags.get("population"),
            "osm_node_id": osm_id,
        })
        existing_ids.add(osm_id)  # prevent duplicates within this same run too

    if rows:
        df = pd.DataFrame(rows)
        df.to_sql("locations", engine, if_exists="append", index=False)

    print(f"  '{place}': inserted {len(rows)}, skipped {skipped_no_name} unnamed, "
          f"{skipped_duplicate} already in DB.")
    return len(rows)


if __name__ == "__main__":
    existing_ids = get_existing_osm_ids()
    total_inserted = 0

    for place in PLACES_TO_SEED:
        try:
            total_inserted += seed_locations_for_place(place, RADIUS_METERS, existing_ids)
        except ValueError as e:
            print(f"  Skipping '{place}': {e}")

    print(f"Done. {total_inserted} new villages inserted across {len(PLACES_TO_SEED)} districts.")
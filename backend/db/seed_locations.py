import time
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
REQUEST_DELAY_SECONDS = 1  # Nominatim usage policy: max 1 request/sec


def geocode_place(place: str) -> dict:
    """Looks up a place name and returns its coordinates, district, and state."""
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": place, "format": "json", "limit": 1}
    headers = {"User-Agent": "SIH-Population-Project/1.0"}

    response = requests.get(url, params=params, headers=headers)

    if response.status_code != 200:
        raise ValueError(
            f"Nominatim returned status {response.status_code} for '{place}': {response.text[:200]}"
        )

    try:
        data = response.json()
    except ValueError as e:
        raise ValueError(
            f"Nominatim returned non-JSON response for '{place}' "
            f"(likely rate-limited): {response.text[:200]}"
        ) from e

    if not data:
        raise ValueError(f"Nominatim found no match for '{place}'")

    latitude = float(data[0]["lat"])
    longitude = float(data[0]["lon"])

    name_parts = [p.strip() for p in data[0]["display_name"].split(",")]
    district = name_parts[0]
    state = name_parts[-2] if len(name_parts) >= 2 else None

    return {"latitude": latitude, "longitude": longitude, "district": district, "state": state}


def fetch_villages(latitude: float, longitude: float, radius: int, max_retries: int = 3) -> list[dict]:
    """Queries Overpass for villages within `radius` meters of the given point.
    Retries with backoff on timeout (504) since the public Overpass server is often overloaded."""
    query = f"""
    [out:json][timeout:60];
    node
      ["place"="village"]
      (around:{radius},{latitude},{longitude});
    out;
    """
    url = "https://overpass-api.de/api/interpreter"

    for attempt in range(1, max_retries + 1):
        response = requests.post(url, data=query, headers={"User-Agent": "SIH-Population-Project/1.0"})

        if response.status_code in (429, 504):
            wait = 5 * attempt  # 5s, 10s, 15s
            print(f"    Overpass returned {response.status_code}, retrying in {wait}s... (attempt {attempt}/{max_retries})")
            time.sleep(wait)
            continue

        if response.status_code != 200:
            raise ValueError(
                f"Overpass returned status {response.status_code}: {response.text[:200]}"
            )

        try:
            data = response.json()
        except ValueError as e:
            raise ValueError(
                f"Overpass returned non-JSON response (likely rate-limited or timed out): "
                f"{response.text[:200]}"
            ) from e

        if "elements" not in data:
            raise ValueError(f"Overpass query failed: {data}")

        return data["elements"]

    raise ValueError(f"Overpass still timing out after {max_retries} attempts — server likely overloaded.")

def get_existing_osm_ids() -> set[str]:
    with engine.connect() as conn:
        rows = conn.execute(text("SELECT osm_node_id FROM locations WHERE osm_node_id IS NOT NULL")).fetchall()
    return {str(r[0]) for r in rows}


def seed_locations_for_place(place: str, radius: int, existing_ids: set[str]) -> int:
    """Geocodes `place`, fetches nearby villages, inserts new ones. Returns count inserted."""
    geo = geocode_place(place)
    time.sleep(REQUEST_DELAY_SECONDS)  # be polite before the follow-up Overpass call too

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
        time.sleep(REQUEST_DELAY_SECONDS)  # rate-limit courtesy between places too

    print(f"Done. {total_inserted} new villages inserted across {len(PLACES_TO_SEED)} districts.")
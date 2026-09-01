BUSINESS_CATEGORY_NOTES = {
    "dairy": {
        "seasonal_notes": "Demand and milk yield typically dip during peak monsoon months; festival seasons (e.g. Diwali) see spikes in demand for milk-based sweets.",
        "supply_chain_risks": "Dependent on consistent fodder availability and cold-chain/refrigeration access; a single unreliable supplier for cattle feed can disrupt output.",
    },
    "retail": {
        "seasonal_notes": "Demand spikes around major festivals and harvest season (higher rural cash liquidity); lean periods typically follow.",
        "supply_chain_risks": "Dependent on wholesale distributors in nearby towns; stock delays are common during monsoon due to road access issues.",
    },
    "textiles": {
        "seasonal_notes": "Strong seasonal spikes around wedding season and major festivals; demand is comparatively flat in off-season months.",
        "supply_chain_risks": "Often dependent on a small number of yarn/raw material suppliers, creating single-point-of-failure risk.",
    },
    "food_processing": {
        "seasonal_notes": "Raw material availability is tied to local harvest cycles; processing volume is highly seasonal for many crops.",
        "supply_chain_risks": "Perishability of raw inputs means storage/cold-chain gaps translate directly into wastage.",
    },
    "handicrafts": {
        "seasonal_notes": "Demand is heavily concentrated around tourist seasons and festival/gifting periods.",
        "supply_chain_risks": "Reliant on availability of specific raw materials (e.g. certain wood, textiles, dyes) often sourced from a single region.",
    },
}

DEFAULT_NOTES = {
    "seasonal_notes": "No category-specific seasonal data available; general rural demand patterns apply.",
    "supply_chain_risks": "No category-specific supply chain data available.",
}

def get_category_notes(business_category: str) -> dict:
    key = (business_category or "").strip().lower().replace(" ", "_")
    return BUSINESS_CATEGORY_NOTES.get(key, DEFAULT_NOTES)
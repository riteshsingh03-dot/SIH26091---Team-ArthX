import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

EXTRACTION_PROMPT = """
Extract structured information from the user's message about starting a business.
Return ONLY valid JSON, no other text, matching exactly this shape:

{{
  "project_cost": <number or null>,
  "state": <string or null>,
  "business_category": <string or null>,
  "margin_capital": <number or null>
}}

If a field isn't mentioned, use null. Do not guess or invent values.
Amounts in "lakh" mean multiply by 100000 (e.g. "1 lakh" = 100000).

User message: "{message}"
"""


def extract_user_intent(message: str) -> dict:
    prompt = EXTRACTION_PROMPT.format(message=message)
    response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents=prompt,
    config=types.GenerateContentConfig(response_mime_type="application/json"),
)
    return json.loads(response.text)
import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from engines.journal.analytics import get_extreme, get_monthly_totals, get_summary_stats

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

INTENT_PROMPT = """
Classify the user's question about their business journal into ONE of these intents
and extract any parameters. Return ONLY valid JSON matching this shape:

{{
  "intent": "max" | "min" | "monthly_totals" | "summary",
  "field": "sales_revenue" | "expenses" | "units_sold" | null,
  "start_date": "YYYY-MM-DD" or null,
  "end_date": "YYYY-MM-DD" or null
}}

"max"/"min" need a field. "monthly_totals" needs a field. "summary" needs no field.
If the user says "sales" assume field="sales_revenue". If they say "profit" or "spending",
assume field="expenses" unless context says otherwise.
Do not guess dates the user didn't imply.

User question: "{question}"
"""


def classify_question(question: str) -> dict:
    prompt = INTENT_PROMPT.format(question=question)
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )
    return json.loads(response.text)


def answer_journal_question(question: str) -> dict:
    parsed = classify_question(question)
    intent = parsed.get("intent")
    field = parsed.get("field")
    start_date = parsed.get("start_date")
    end_date = parsed.get("end_date")

    if intent in ("max", "min"):
        if not field:
            return {"error": "Could not determine which field (sales, expenses, units) you're asking about."}
        result = get_extreme(field, mode=intent, start_date=start_date, end_date=end_date)
        return {"intent": intent, "field": field, "result": result}

    elif intent == "monthly_totals":
        if not field:
            return {"error": "Could not determine which field you're asking about."}
        result = get_monthly_totals(field)
        return {"intent": intent, "field": field, "result": result}

    elif intent == "summary":
        result = get_summary_stats(start_date=start_date, end_date=end_date)
        return {"intent": intent, "result": result}

    return {"error": f"Unrecognized intent: {intent}"}
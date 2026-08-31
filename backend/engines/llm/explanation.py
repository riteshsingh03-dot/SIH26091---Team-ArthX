# engines/llm/explanation.py
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

EXPLANATION_PROMPT = """
You are explaining a business loan feasibility result to a first-time entrepreneur.
Use ONLY the facts given below. Do NOT invent numbers, scheme names, or rules
not present in this data. If something is marked "illustrative", mention that
it is an example figure, not a confirmed official number.

SCHEME:
{scheme}

ELIGIBILITY:
{eligibility}

LOAN STRUCTURE:
{loan}

MONTHLY/QUARTERLY INSTALLMENT:
{installment}

RETRIEVED SCHEME DOCUMENT EXCERPTS (use these for document/procedure questions):
{retrieved_chunks}

Write a clear, friendly, plain-language explanation (not more than 200 words)
covering: whether they're eligible, what the loan structure looks like,
and what documents/procedure the retrieved excerpts mention.
"""


def generate_explanation(scheme, eligibility, loan, installment, retrieved_chunks) -> str:
    chunks_text = "\n---\n".join(c["chunk_text"] for c in retrieved_chunks) if retrieved_chunks else "None retrieved."

    prompt = EXPLANATION_PROMPT.format(
        scheme=scheme,
        eligibility=eligibility,
        loan=loan,
        installment=installment,
        retrieved_chunks=chunks_text,
    )

    response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents=prompt,
)
    return response.text
from engines.retrieval.ingest import ingest_scheme_document

sample_text = """
The Micro Finance Scheme provides financial support to first-time entrepreneurs
in rural and semi-urban areas with a project cost of up to ₹1,40,000.

Eligible applicants must be residents of the state where they are applying,
and must not have previously availed of a similar central government loan scheme.

The scheme covers up to 90% of the total project cost as a loan, with the
remaining 10% expected as margin money contributed by the applicant.

Applicants must submit proof of residence, a business plan, and an identity
document to their nearest implementing agency or bank branch.

The loan carries an interest rate of 6.5% per annum, repayable over 3 years,
with an initial moratorium period of 3 months during which no repayment is required.
"""

from sqlalchemy import text
from db.connection import engine

with engine.connect() as conn:
    result = conn.execute(text("SELECT id FROM schemes WHERE name = 'Micro Finance Scheme'")).scalar()
    ingest_scheme_document(scheme_id=result, document_text=sample_text, source="illustrative_example")
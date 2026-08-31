import json
from sqlalchemy import text
from db.connection import engine
from engines.retrieval.chunking import chunk_text
from engines.retrieval.embeddings import embed_text


def ingest_scheme_document(scheme_id: int, document_text: str, source: str = None):
    chunks = chunk_text(document_text)

    with engine.connect() as conn:
        for chunk in chunks:
            vector = embed_text(chunk)
            conn.execute(text("""
                INSERT INTO scheme_documents (scheme_id, chunk_text, embedding, source)
                VALUES (:scheme_id, :chunk_text, :embedding, :source)
            """), {
                "scheme_id": scheme_id,
                "chunk_text": chunk,
                "embedding": json.dumps(vector),
                "source": source,
            })
        conn.commit()

    print(f"Ingested {len(chunks)} chunks for scheme_id={scheme_id}")
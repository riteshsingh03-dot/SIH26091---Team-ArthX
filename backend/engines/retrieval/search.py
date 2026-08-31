# engines/retrieval/search.py
import json
import numpy as np
from sqlalchemy import text
from db.connection import engine
from engines.retrieval.embeddings import embed_text


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    a = np.array(vec_a)
    b = np.array(vec_b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def search_scheme_documents(query: str, scheme_id: int = None, top_k: int = 3) -> list[dict]:
    """
    Embeds the query, compares it against stored chunk embeddings,
    returns the top_k most similar chunks.
    If scheme_id is given, only searches within that scheme's chunks.
    """
    query_vector = embed_text(query)

    sql = "SELECT id, scheme_id, chunk_text, embedding, source FROM scheme_documents"
    params = {}
    if scheme_id is not None:
        sql += " WHERE scheme_id = :scheme_id"
        params["scheme_id"] = scheme_id

    with engine.connect() as conn:
        rows = conn.execute(text(sql), params).mappings().all()

        scored = []
    for row in rows:
        chunk_vector = row["embedding"]  # already deserialized by the driver
        similarity = cosine_similarity(query_vector, chunk_vector)
        scored.append({
            "chunk_text": row["chunk_text"],
            "source": row["source"],
            "scheme_id": row["scheme_id"],
            "similarity": similarity,
        })

    scored.sort(key=lambda x: x["similarity"], reverse=True)
    return scored[:top_k]
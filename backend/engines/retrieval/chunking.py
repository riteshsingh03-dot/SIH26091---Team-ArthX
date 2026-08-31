def chunk_text(text: str, max_chunk_chars: int = 500) -> list[str]:
    """
    Splits text into chunks by paragraph, merging short paragraphs
    together until roughly max_chunk_chars is reached.
    """
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks = []
    current = ""

    for para in paragraphs:
        if len(current) + len(para) <= max_chunk_chars:
            current += (" " if current else "") + para
        else:
            if current:
                chunks.append(current)
            current = para

    if current:
        chunks.append(current)

    return chunks
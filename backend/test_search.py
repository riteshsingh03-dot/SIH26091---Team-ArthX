from engines.retrieval.search import search_scheme_documents

results = search_scheme_documents("What documents do I need to apply for a small loan?")
for r in results:
    print(f"[{r['similarity']:.3f}] {r['chunk_text'][:100]}...")
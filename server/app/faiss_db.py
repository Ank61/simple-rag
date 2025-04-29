import faiss
import numpy as np
from app.embed_text import model

index = None
stored_chunks = []

def init_faiss():
    global index
    dim = 384  # Dimension of 'all-MiniLM-L6-v2'
    index = faiss.IndexFlatL2(dim)

def add_to_faiss(embeddings, chunks):
    global index, stored_chunks
    vectors = np.array(embeddings).astype('float32')
    index.add(vectors)
    stored_chunks.extend(chunks)

# def search_faiss(query, top_k=5):
#     #Works only if the query is "similar" (in embedding space) to the stored document chunks.
#     # Questions like "Summarize the PDF" does not match any criteria in the vector space
#     global index, stored_chunks
#     query_vec = model.encode([query]).astype('float32')
#     D, I = index.search(query_vec, top_k)
#     results = [stored_chunks[i] for i in I[0]]
#     return results


# def search_faiss(query, top_k=5):
#     """
#     Smarter version:
#     - For 'summarize' type queries: return full document.
#     - For 'extract' type queries (e.g., name, skills): return full document.
#     - For normal queries: do vector search.
#     """
#     global index, stored_chunks
    
#     query_lower = query.lower()
    
#     if any(keyword in query_lower for keyword in ["summarize", "overview", "extract", "name", "skills", "address"]):
#         return [" ".join(stored_chunks)]
#     print("*********",stored_chunks)
#     query_vec = model.encode([query]).astype('float32')
#     D, I = index.search(query_vec, top_k)
#     print("_____",I)
#     results = [stored_chunks[i] for i in I[0]]
#     return results


def search_faiss(query, top_k=5, similarity_threshold=0.3):
    """
    Enhanced search:
    - Detect summary/extraction type queries.
    - For normal queries, run vector search with fallback on low similarity.
    """
    global index, stored_chunks
    
    query_lower = query.lower()
    summary_keywords = ["summarize", "summary", "overview"]
    extract_keywords = ["extract", "name", "skills", "address", "phone", "email"]

    if any(k in query_lower for k in summary_keywords + extract_keywords):
        return [" ".join(stored_chunks)]

    query_vec = model.encode([query]).astype('float32')
    D, I = index.search(query_vec, top_k)

    results = []
    for idx, dist in zip(I[0], D[0]):
        if dist >= similarity_threshold:
            results.append(stored_chunks[idx])

    if not results:
        results = ["Sorry, I couldn’t find relevant info in the document."]

    return results

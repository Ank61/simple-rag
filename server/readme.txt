# RAG (Retrieval-Augmented Generation) Backend

A powerful system that enables intelligent document querying through vector-based semantic search and language model generation.

## Quick Start

### Development Environment
```bash
docker run --name dev-container -v $(pwd):/app -p 8000:8000 simple-rag
```

## Project Overview

This project implements a RAG (Retrieval-Augmented Generation) backend that follows this workflow:
1. Upload PDF
2. Extract Text
3. Create Embeddings
4. Store in Vector DB
5. Ask Question
6. Find Best Context
7. Generate Answer

## Components

| Component | Purpose |
|-----------|---------|
| **FastAPI** | Backend web server for APIs |
| **PyMuPDF/pdfplumber** | Read and extract text from PDFs |
| **Sentence Chunking** | Breaks text into smaller manageable pieces |
| **SentenceTransformers** | Create embeddings (vector representations) of text locally |
| **FAISS** | Fast local vector database to store and search embeddings |
| **Cosine Similarity** | Find the most relevant chunks during question answering |

## API Endpoints

- `/upload_pdf/` - Upload and process PDF documents
- `/ask_question/` - Query the system with natural language questions

## Core Concepts

### 1. Vector Embeddings
Text chunks (approximately 500 characters each) are embedded as vectors using transformer models. These vectors capture semantic meaning in a high-dimensional space.

### 2. Vector Storage
Vectors are stored in FAISS (Facebook AI Similarity Search), a high-performance vector database optimized for similarity search and clustering.

### 3. Retrieval Augmented Generation (RAG)

RAG combines retrieval (searching for information) with generation (creating natural language output) using AI models.

#### RAG Flow:
```
[User Query]
      ↓
[Embed Query]
      ↓
[Vector Database Search]
      ↓
[Retrieve Relevant Context]
      ↓
[Pass Context + Query]
      ↓
[LLM Generates Answer]
      ↓
[Final Response]
```

When a user sends a question:
1. The question is converted into a vector
2. FAISS searches for the most similar text chunks using cosine similarity
3. The retrieved context is combined with the original question
4. The language model generates an answer based on the retrieved context

**Key Benefit**: "RAG: If the AI doesn't know something by itself, it first searches for correct information from a database, then writes an answer based on that."

## RAG Types
- **Classic RAG**: Basic implementation with single query and retrieval
- **Advanced RAG**: Enhanced with techniques like re-ranking and query expansion
- **Multi-Document RAG**: Handles and integrates information from multiple documents
- **Multi-Agent RAG**: Uses multiple agents for complex retrieval and reasoning

## Vector-Based Semantic Search

Unlike keyword search, vector-based semantic search allows searching by meaning, not just exact words.

### Process:
1. **Text Embedding**: 
   - Sentences are transformed into numeric vectors using models like:
     - sentence-transformers (MiniLM, BERT)
     - OpenAI embeddings (API-based)
     - Hugging Face transformer models (local)

2. **Indexing**:
   - Documents are split into chunks
   - Each chunk is embedded into a vector
   - All vectors are stored in a vector index (FAISS, ChromaDB, Weaviate, Qdrant)

3. **Searching**:
   - Query is converted to a vector
   - System finds nearest vectors using similarity metrics (cosine, dot product)
   - Returns semantically similar chunks to the query


Stage 2 

User uploads PDF
     ↓
Text extracted
     ↓
Semantic chunking via spaCy
     ↓
Chunks vectorized & stored
     ↓
User asks question
     ↓
→ "Summarize" or "Extract"?
   - YES: Full doc to QA + NER
   - NO: Vector Search → Top Chunks → QA
     ↓
Answer returned

Stage 2 is a full RAG process.

Optional optimizations are as followed 
      Chunk metadata storage	Store page numbers, sections, or headings for context-rich answers.
      Better chunking (semantic or sliding)	Instead of naive splitting, use sentence-aware or overlap chunking.
      Ranking retrieved chunks	Use a re-ranker model (e.g., bge-reranker) to prioritize the best chunks.
      Prompt optimization	Use structured prompt templates or tools like LangChain's PromptTemplate.
      Feedback loop / scoring	Add logging of responses, feedback rating, or automatic evaluation.
      Multi-modal (if needed)	Support images or tables from PDFs using OCR or layout parsers.


Step 3 : 

      Optimization 1 :
            Why improve chunking ?
                  - Naive chunking (e.g., splitting by fixed number of characters or words) often:
                  - Splits sentences mid-way.
                  - Breaks important concepts across chunks.
                  - Causes retrieval to miss semantic connections
            Better Chunking :
                  - Sliding Window Chunking (Overlap-based)
                  - Sentence-Aware Chunking (using nltk or spaCy)
                  - Semantic Chunking ( using spaCy or transformers ):
                        - Split based on semantic units like topics or meaning shifts (harder, more accurate).
            Which one should you use ?
                  Use Case	Recommended Chunking
                  PDF documents	Sentence-aware
                  Technical/structured text	Semantic chunking (spaCy)
                  Casual text or chat logs	Sliding window
                  General-purpose	Sentence-aware + Overlap
RAG (Retrieval-Augmented Generation) backend.

    Upload PDF → Extract Text → Create Embeddings → Store in Vector DB → Ask Question → Find Best Context → Generate Answer.

Component
    FastAPI	Backend web server for APIs
    PyMuPDF or pdfplumber	Read and extract text from PDFs
    Sentence Chunking	Breaks big text into smaller manageable pieces
    SentenceTransformers (Local)	Create embeddings (vector representations) of text
    FAISS (Facebook AI Similarity Search)	Fast local vector database to store and search embeddings
    Cosine Similarity	Find the most relevant chunks during question answering
    Backend APIs	/upload_pdf/ for upload, /ask_question/ for asking

Main Concepts:

    1. Vector Embeddings 
            After creatig text chunks the text in approx 500 charachter are embedded as vectors.

    2. Storing vectors
            Vectors are stored in vector database like FAISS FB AI similarity search. 

    3. Retrieval Augemented Generation
            When a user sends a question it again converts them into vectors and again is plotted on DB for similarity search.
            FAISS search for RELEVANT CHUNKS. Use FAISS to find top N chunks most similar to the question vector using cosine similarity.
            RAG is a technique where you combine retrieval (searching for information) with generation (creating natural language output) using AI models.
            In simple words:
                "If the AI doesn’t know something by itself, it first searches for correct information from a database, then writes an answer based on that."
                    ✅ Retrieve → Augment → Generate

                RAG FLOW: (Search (to get context) --> Augment (Enrich) using LLM --> Generate Human like text) 
                    1. User asks a Question
                        e.g., "What is the refund policy in this document?"

                    2. Retrieve Information (Search Phase)
                        Instead of making up an answer (hallucinating), the system searches a knowledge base (like PDFs, Databases, Wikis, Websites, etc.).
                        It finds relevant context (documents, paragraphs, text snippets) using Vector Search (FAISS, Chroma, Pinecone, etc.).
                        ✅ Find the best matching "knowledge" related to the question.

                    3. Augment the LLM Input (Enrich Phase)
                        Take the original question + the retrieved context.
                        Feed both together into the language model (like GPT, LLaMA, etc.).
                        ✅ Now the model has actual data to answer from — more accurate.


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



Type :
    - Classic RAG
    -  Advanced RAG
    -  Multi-Document RAG
    -  Multi-Agent RAG


- What is Vector-Based Semantic Search?
    Vector-based semantic search is a technique where text is converted into vectors (numeric representations), and searches are done using vector similarity, not keywords.

    It allows you to search by meaning, not just by exact words.

    Text Embedding:

        Sentences like "What is the name of the person?" are turned into vectors like [0.2, 0.65, -0.1, ...] using models like:

        sentence-transformers (MiniLM, BERT, etc.)

        OpenAI embeddings (if API is used)

        Hugging Face transformer models (locally)

    Indexing (e.g., FAISS):

        Your document is split into chunks.

        Each chunk is embedded into a vector.

        All vectors are stored in a vector index like FAISS, ChromaDB, Weaviate, or Qdrant.

    Searching:

        Your query is also converted to a vector.

        The system finds nearest vectors (cosine similarity, dot product, etc.)

        Returns the chunks most semantically similar to your query.
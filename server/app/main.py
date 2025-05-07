from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from app import pdf_reader, chunk_text, embed_text, faiss_db, llm_answer

app = FastAPI()

# Enable CORS for all origins (development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize FAISS
faiss_db.init_faiss()


@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    pdf_text = pdf_reader.extract_text_from_pdf(file.file)
    # Naive Splitting
    # chunks = chunk_text.split_text(pdf_text)
    # Sentence context
    chunks = chunk_text.sentence_chunk(pdf_text)
    print("chunks", chunks)
    embeddings = embed_text.get_embeddings(chunks)
    faiss_db.add_to_faiss(embeddings, chunks)
    return {"message": "PDF uploaded and processed successfully."}


# @app.post("/ask_question/")
# async def ask_question(question: str = Form(...)):
#     relevant_chunks = faiss_db.search_faiss(question)
#     answer = llm_answer.generate_answer(relevant_chunks, question)
#     return {"answer": answer}


# Staging- 2 Combined Models
@app.post("/ask")
async def ask_question(question: str = Form(...)):
    print("Received question:", question)
    # Fetch relevant hunks based on vector search.
    relevant_chunks = faiss_db.search_faiss(question)
    if not relevant_chunks or len(" ".join(relevant_chunks).strip()) < 20:
        relevant_chunks = [" ".join(faiss_db.stored_chunks)]

    selected_model = llm_answer.choose_model_based_on_question(question)
    print("Selected model:", selected_model)

    try:
        answer = llm_answer.generate_answer_combined(
            relevant_chunks, question, model=selected_model
        )
        return {"answer": answer}
    except Exception as e:
        print("Error while generating answer:", e)
        return {"error": str(e)}

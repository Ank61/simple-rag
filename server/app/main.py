from fastapi import FastAPI, UploadFile, File, Form
from app import pdf_reader, chunk_text, embed_text, faiss_db, llm_answer # type: ignore

app = FastAPI()

# Initialize FAISS
faiss_db.init_faiss()

@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    pdf_text = pdf_reader.extract_text_from_pdf(file.file)
    chunks = chunk_text.split_text(pdf_text)
    embeddings = embed_text.get_embeddings(chunks)
    faiss_db.add_to_faiss(embeddings, chunks)
    return {"message": "PDF uploaded and processed successfully."}

@app.post("/ask_question/")
async def ask_question(question: str = Form(...)):
    relevant_chunks = faiss_db.search_faiss(question)
    answer = llm_answer.generate_answer(relevant_chunks, question)
    return {"answer": answer}

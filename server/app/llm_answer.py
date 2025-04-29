from transformers import pipeline

# Load lightweight QA model
qa_pipeline = pipeline("text2text-generation", model="google/flan-t5-base")

def generate_answer(context_chunks, question):
    context = "\n".join(context_chunks)
    prompt = f"Given the following context: {context}\nAnswer the question: {question}"
    print("Preapring answer")
    response = qa_pipeline(prompt, max_length=512)[0]['generated_text']
    print("answer generated" , response)
    return response

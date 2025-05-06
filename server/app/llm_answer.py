from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
import os
import requests

# Load lightweight QA model
qa_pipeline = pipeline("text2text-generation", model="google/flan-t5-base")
OLLAMA_API = os.getenv("OLLAMA_API", "http://ollama:11434")

# # Load Mistral
# mistral_model_id = "mistralai/Mistral-7B-Instruct-v0.1"
# mistral_tokenizer = AutoTokenizer.from_pretrained(mistral_model_id)
# mistral_model = AutoModelForCausalLM.from_pretrained(
#     mistral_model_id,
#     device_map="auto",
#     torch_dtype=torch.float16
# )


def generate_answer(context_chunks, question):
    context = "\n".join(context_chunks)
    prompt = f"Given the following context: {context}\nAnswer the question: {question}"
    print("Preapring answer")
    response = qa_pipeline(prompt, max_length=512)[0]["generated_text"]
    print("answer generated", response)
    return response


# Stage -2 Combined Models
def generate_with_flan(context, question):
    prompt = f"Given the following context: {context}\nAnswer the question: {question}"
    return qa_pipeline(prompt, max_length=512)[0]["generated_text"]


def generate_with_mistral(context, question):
    print("************* Full context", context)
    prompt = f"Given the following context:\n{context}\nAnswer the question: {question}"

    try:
        response = requests.post(
            f"http://127.0.0.1:11434/api/generate",
            json={
                "model": "mistral",
                "prompt": prompt,
                "stream": False,
                # "num_predict": 256,
            },
            # timeout=30,
        )
        response.raise_for_status()
        return response.json()["response"].strip()
    except requests.exceptions.RequestException as e:
        print(f"[Ollama Mistral Error] {e}")
        return "Error while generating response with Mistral."


def generate_answer_combined(context_chunks, question, model=None):
    if model is None:
        model = choose_model_based_on_question(question)

    context = "\n".join(context_chunks)

    if model == "mistral":
        return generate_with_mistral(context, question)
    else:
        return generate_with_flan(context, question)


def choose_model_based_on_question(question: str) -> str:
    q = question.lower()
    if any(word in q for word in ["summarize", "overview", "short", "brief"]):
        return "flan"
    if any(
        word in q
        for word in [
            "extract",
            "list",
            "analyze",
            "compare",
            "step",
            "explain",
            "why",
            "how",
            "who",
        ]
    ):
        return "mistral"
    return "flan"

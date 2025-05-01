from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
import requests
# Load lightweight QA model
qa_pipeline = pipeline("text2text-generation", model="google/flan-t5-base")

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
    response = qa_pipeline(prompt, max_length=512)[0]['generated_text']
    print("answer generated" , response)
    return response

#Stage -2 Combined Models
def generate_with_flan(context, question):
    prompt = f"Given the following context: {context}\nAnswer the question: {question}"
    return qa_pipeline(prompt, max_length=512)[0]['generated_text']

def generate_with_mistral(context, question):
    # prompt = f"[INST] Given the following context:\n{context}\nAnswer the question: {question} [/INST]"
    # inputs = mistral_tokenizer(prompt, return_tensors="pt").to(mistral_model.device)
    # outputs = mistral_model.generate(**inputs, max_new_tokens=512)
    # return mistral_tokenizer.decode(outputs[0], skip_special_tokens=True)
    print("************* context",context)
    prompt = f"Given the following context:\n{context}\nAnswer the question: {question}"
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "mistral", "prompt": prompt, "stream": False}
    )
    return response.json()["response"].strip()


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
    if any(word in q for word in ["extract", "list", "analyze", "compare", "step", "explain", "why", "how", "who"]):
        return "mistral"
    return "flan"


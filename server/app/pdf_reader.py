import pdfplumber

def extract_text_from_pdf(file_obj) -> str:
    text = ""
    with pdfplumber.open(file_obj) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

import spacy

nlp = spacy.load("en_core_web_lg")


# Naive Spliting  : Lossing Context between choosen words and sentence
def split_text(text, chunk_size=500):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i : i + chunk_size])
        chunks.append(chunk)
    print("Chunk", chunks)
    return chunks


# helps preserve context and meaning across splits, which leads to better retrieval and LLM results
def sentence_chunk(text, chunk_size=5):
    """
    Splits the input text into sentence-based chunks using spaCy.
    Groups every `chunk_size` number of sentences together into a chunk.
    """
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]

    chunks = []
    for i in range(0, len(sentences), chunk_size):
        chunk = " ".join(sentences[i : i + chunk_size])
        chunks.append(chunk)

    return chunks

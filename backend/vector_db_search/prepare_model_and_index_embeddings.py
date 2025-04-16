# This script generates the model and indexes using the corpus data. It needs to run periodically.

import faiss, fasttext
import numpy as np
corpus = "apps_for_vectordb.txt"
model   = fasttext.train_unsupervised(corpus, model='skipgram')
model.save_model('model_apps_for_vectordb.bin')
#-- Uncurated part
corpus_uncurated = "apps_uncurated_for_vectordb.txt"
model_uncurated   = fasttext.train_unsupervised(corpus_uncurated, model='skipgram')
model_uncurated.save_model('model_apps_uncurated_for_vectordb.bin')


def create_embeddings(data):
    #model = fasttext.load_model('cc.en.300.bin')  # Adjust path as needed
    #df['embedding'] = df['text'].apply(lambda x: model.get_word_vector(x))
    #model = fasttext.train_unsupervised(data)
    embeddings = [model.get_sentence_vector(text) for text in data]
    return embeddings

# Build FAISS index and add embeddings
def build_faiss_index(embeddings):
    dim = embeddings[0].shape[0]
    #print("dimensions are: ", dim)
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings))
    return index
# build the model and index for curated data first
fh = open(corpus, 'r')
sentences   = fh.read().split('\n')
#print("Curated sentences read and count =", len(sentences))
embeddings  = create_embeddings(sentences)
#print("embeddings created for sentences")
index       = build_faiss_index(embeddings)
#print("index was successfully created and len of embeddings=", len(embeddings))
faiss.write_index(index, "apps_index.bin")
#print("index saved successfully")
fh.close()
# build the model and index for uncurated data next
fh2 = open(corpus_uncurated, 'r')
sentences   = fh2.read().split('\n')
#print("Uncurated sentences read and count =", len(sentences))
embeddings  = create_embeddings(sentences)
#print("embeddings created for sentences")
index       = build_faiss_index(embeddings)
#print("index was successfully created and len of embeddings=", len(embeddings))
faiss.write_index(index, "apps_uncurated_index.bin")
#print("uncurated index saved successfully")
fh2.close()
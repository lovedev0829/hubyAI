import sys
from flask import Flask, request, json, jsonify
import numpy as np
import faiss
import fasttext
import logging
import json
from functools import lru_cache

logLevel = "INFO"
logFile = "huby_vector_db.log"
# curated data; model - commented in the new approach
#--- model   = fasttext.load_model('model_apps_for_vectordb.bin')
#--- index   = faiss.read_index('apps_index.bin')
# uncurated data -- commented in the new approach
#-- model_uncurated   = fasttext.load_model('model_apps_uncurated_for_vectordb.bin')
#-- index_uncurated   = faiss.read_index('apps_uncurated_index.bin')


# Implement lazy loading using a singleton pattern
class ModelManager:
    _instance   = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        """Initialize models and indices only once"""
        self.model = fasttext.load_model('model_apps_for_vectordb.bin')
        self.index = faiss.read_index('apps_index.bin')
        self.model_uncurated = fasttext.load_model('model_apps_uncurated_for_vectordb.bin')
        self.index_uncurated = faiss.read_index('apps_uncurated_index.bin')
        
        # Load app IDs
        with open("app_ids.txt", 'r') as fh:
            self.arr_app_ids = self._deserialize(fh.read())
            
        with open("app_uncurated_ids.txt", 'r') as fh:
            self.arr_app_uncurated_ids = self._deserialize(fh.read())
    
    @staticmethod
    def _deserialize(serialized_str):
        result = []
        pos = 0
        while pos < len(serialized_str):
            len_pos = serialized_str.find('~', pos)
            if len_pos == -1:
                break
            length = int(serialized_str[pos:len_pos])
            pos = len_pos + 1
            word = serialized_str[pos:pos + length]
            result.append(word)
            pos += length
        return result

    @lru_cache(maxsize=1024)
    def get_sentence_vector(self, text, uncurated=False):
        """Cache sentence vectors to avoid recomputing"""
        model = self.model_uncurated if uncurated else self.model
        return model.get_sentence_vector(text) 

    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance


app = Flask(__name__)
app.logger.setLevel(logLevel)
handler = logging.FileHandler(logFile)
handler.setFormatter(logging.Formatter('%(asctime)s.%(msecs)03d  %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S'))
app.logger.addHandler(handler)

model_manager = ModelManager()

app.logger.info("Running clean code since 01/01/25")
@app.route("/api/search", methods=["GET"])
def search_vector_db():
    app.logger.info("In search_vector_db()")
    search_text     = request.args.get("search_text", "")
    result_count    = int(request.args.get("result_count", 0))
    if search_text  == "":
        return jsonify({"error": "search_text is a required and non-blank field in the payload for endpoint /api/search/uncurated."}),400
    app.logger.info("search text is: " + search_text)
    if result_count <= 0: 
        result_count = 3
    app.logger.info(f"result_count is:  {result_count}")
    #--- New code

    emb = model_manager.get_sentence_vector(search_text).reshape(1, -1)
    dist, indices = model_manager.index.search(emb, result_count)
    #print("dist:", dist)
    #print("indices:", indices)
    result = []
    for i, idx in enumerate(indices[0]):
        #print("type of i:", type(i)); print("type of idx:", type(idx))
        app.logger.info("i is {} and idx is {} and indices from search are {}".format(i, idx,  indices))
        result.append({"order": i, "position": idx, "distance": float(dist[0][i]), "application_id": model_manager.arr_app_ids[idx - 1]})
    #print("result", result)
    result_json = json.dumps(result, default=lambda obj: int(obj) if isinstance(obj, np.int64) else obj)
    return jsonify({"result": result_json}), 200

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"status": "ok"}),200

@app.route("/api/search/uncurated", methods=["GET"])
def search_vector_db_uncurated():
    app.logger.info("In search_vector_db_uncurated()")
    search_text     = request.args.get("search_text", "")
    result_count    = int(request.args.get("result_count", 0))
    if search_text  == "":
        return jsonify({"error": "search_text is a required and non-blank field in the payload for endpoint /api/search/uncurated."}),400
    app.logger.info("search text is: " + search_text)
    if result_count <= 0: 
        result_count = 3
    app.logger.info(f"result_count is:  {result_count}")
   
    emb = model_manager.get_sentence_vector(search_text,uncurated=True).reshape(1, -1)
    dist, indices = model_manager.index_uncurated.search(emb, result_count)
    #print("dist:", dist)
    #print("indices:", indices)
    result = []
    for i, idx in enumerate(indices[0]):
        #print("type of i:", type(i)); print("type of idx:", type(idx))
        app.logger.info("i is {} and idx is {} and indices from search are {}".format(i, idx, indices))
        result.append({"order": i, "position": idx, "distance": float(dist[0][i]), "application_id": model_manager.arr_app_uncurated_ids[idx - 1]})
    #print("result", result)
    result_json = json.dumps(result, default=lambda obj: int(obj) if isinstance(obj, np.int64) else obj)
    return jsonify({"result": result_json}), 200
    # apps_uncurated_index.bin

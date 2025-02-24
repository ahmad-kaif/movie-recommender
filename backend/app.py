from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle as pkl
import pandas as pd
import os

app = Flask(__name__, static_folder='frontend/build', static_url_path='/')
CORS(app)  # Enable CORS

# Load model
movies_dict = pkl.load(open('./model/movie_recommender_dict.pkl', 'rb'))
movies = pd.DataFrame(movies_dict)
similarity = pkl.load(open('./model/similarity.pkl', 'rb'))

def recommend(movie):
    movie_index = movies[movies['title'] == movie].index[0]
    distances = similarity[movie_index]
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
    recommended_movies = [movies.iloc[i[0]].title for i in movies_list]
    return recommended_movies

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.json
    movie_name = data.get("movie")

    if not movie_name:
        return jsonify({"error": "No movie name provided"}), 400

    recommended = recommend(movie_name)
    return jsonify({"recommended_movies": recommended})

# Serve React Frontend
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Serve all frontend static files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

PORT = int(os.getenv("PORT", 5000))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT)

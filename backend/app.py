from flask import Flask, request, jsonify
import pickle
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})  # Allows all origins (for development)

# Load the movies data (as a DataFrame)
movies_dict = pickle.load(open("model/movie_recommender_dict.pkl", "rb"))
movies = pd.DataFrame(movies_dict)

# Load the similarity model
similarity = pickle.load(open("model/similarity.pkl", "rb"))

# Recommendation function
def recommend(movie):
    if movie not in movies['title'].values:
        return []

    movie_index = movies[movies['title'] == movie].index[0]
    distances = similarity[movie_index]
    movie_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

    recommended_movies = []
    for i in movie_list:
        recommended_movies.append({
            "title": movies.iloc[i[0]].title,
            "movie_id": int(movies.iloc[i[0]].movie_id)  # Ensure movie_id is returned
        })
    
    return recommended_movies

# API route to get movie recommendations
@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.json
    movie_name = data.get("movie")

    if not movie_name:
        return jsonify({"error": "No movie name provided"}), 400

    recommended_movies = recommend(movie_name)
    return jsonify({"recommended_movies": recommended_movies})

# API route to fetch movies for autocomplete
@app.route('/movies', methods=['GET'])
def get_movies():
    query = request.args.get("q", "").lower()
    if not query:
        return jsonify([])  # Return empty list if no query provided

    filtered_movies = movies[movies['title'].str.lower().str.contains(query, na=False)]
    return jsonify(filtered_movies[['title', 'movie_id']].to_dict(orient="records"))

# API route to fetch movie details (title + poster)
import requests

# OMDB_API_KEY = "2d1a1c39"  # 

def fetch_poster(movie_id):
    """Fetches the poster URL from OMDb API using IMDb ID."""
    url = f"http://www.omdbapi.com/?i=tt{movie_id}&apikey={OMDB_API_KEY}"
    response = requests.get(url).json()
    return response.get("Poster", "https://via.placeholder.com/300x450?text=No+Image")

@app.route('/movie_info/<int:movie_id>', methods=['GET'])
def get_movie_info(movie_id):
    movie_row = movies[movies["movie_id"] == movie_id]

    if movie_row.empty:
        return jsonify({"error": "Movie not found"}), 404

    # Fetch poster from OMDb API
    poster_url = fetch_poster(movie_id)

    movie_data = {
        "title": movie_row["title"].values[0],
        "poster_url": poster_url
    }
    
    return jsonify(movie_data)


if __name__ == '__main__':
    app.run(debug=True)
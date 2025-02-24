from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle as pkl
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model and similarity matrix
movies_dict = pkl.load(open('./model/movie_recommender_dict.pkl', 'rb'))
movies = pd.DataFrame(movies_dict)
similarity = pkl.load(open('./model/similarity.pkl', 'rb'))

def recommend(movie):
    movie_index = movies[movies['title'] == movie].index[0]
    distances = similarity[movie_index]
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

    recommended_movies = [movies.iloc[i[0]].title for i in movies_list]  # Return list of strings
    return recommended_movies

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.json
    movie_name = data.get("movie")

    if not movie_name:
        return jsonify({"error": "No movie name provided"}), 400

    recommended = recommend(movie_name)  # Should return a list of strings

    return jsonify({"recommended_movies": recommended})  # Ensure list of strings

if __name__ == '__main__':
    app.run(debug=True)

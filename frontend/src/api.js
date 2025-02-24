import axios from "axios";

const API_URL = "http://127.0.0.1:5000"; // Flask backend URL

export const getRecommendations = async (movieName) => {
  try {
    const response = await axios.post(`${API_URL}/recommend`, { movie: movieName });
    return response.data.recommended_movies;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

export const fetchMovies = async (movie) => {
  try {
    const response = await fetch(`${API_URL}/movies?q=${movie}`);
    const data = await response.json();
    return data; // Returning movie suggestions
  } catch (error) {
    console.error("Error fetching movie suggestions:", error);
    return [];
  }
};

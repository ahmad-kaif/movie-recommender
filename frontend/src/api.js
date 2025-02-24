import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000"; 

export const getRecommendations = async (movie) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recommend`, {
      movie: movie, // Send movie in request body
    });
    return response.data.recommended_movies;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};


// export const fetchMovies = async (movie) => {
//   try {
//     const response = await fetch(`${API_URL}/movies?q=${movie}`);
//     const data = await response.json();
//     return data; // Returning movie suggestions
//   } catch (error) {
//     console.error("Error fetching movie suggestions:", error);
//     return [];
//   }
// };

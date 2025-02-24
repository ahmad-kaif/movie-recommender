import { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:5000"; // Adjust if using a different host

function App() {
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [movieSuggestions, setMovieSuggestions] = useState([]);
  // const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);

  // Fetch movie recommendations
  const handleSearch = async () => {
    if (!movie.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie }),
      });

      const data = await response.json();
      if (data.recommended_movies) {
        setRecommendations(data.recommended_movies);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  // Fetch autocomplete movie suggestions
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setMovie(value);

    if (value.trim()) {
      try {
        const response = await fetch(`${API_BASE_URL}/movies?q=${value}`);
        const data = await response.json();
        setMovieSuggestions(data);
      } catch (error) {
        console.error("Error fetching movie suggestions:", error);
      }
    } else {
      setMovieSuggestions([]);
    }
  };

  // Fetch movie details (title + poster)
  // const fetchMovieDetails = async (movieId) => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/movie_info/${movieId}`);
  //     const data = await response.json();
  //     setSelectedMovieDetails(data);
  //   } catch (error) {
  //     console.error("Error fetching movie details:", error);
  //   }
  // };

  // Handle selecting a movie from suggestions
  const handleSelectMovie = (selectedMovie) => {
    setMovie(selectedMovie.title);
    setMovieSuggestions([]);
    // fetchMovieDetails(selectedMovie.movie_id); // Fetch additional movie details
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-5">
      <h1 className="text-4xl font-bold mb-6">🎬 Movie Recommender</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <input
          type="text"
          placeholder="Enter a movie name"
          value={movie}
          onChange={handleInputChange}
          className="w-full p-3 rounded-md text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Movie Suggestions Dropdown */}
        {movieSuggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-gray-700 rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
            {movieSuggestions.map((suggestion) => (
              <li
                key={suggestion.movie_id}
                className="p-3 cursor-pointer hover:bg-gray-600"
                onClick={() => handleSelectMovie(suggestion)}
              >
                🎥 {suggestion.title}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleSearch}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition-all"
        >
          Get Recommendations
        </button>
      </div>

      {/* Display selected movie details */}
      {/* {selectedMovieDetails && (
        <div className="mt-6 bg-gray-800 p-5 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedMovieDetails.title}
          </h2>
          <img
            src={selectedMovieDetails.poster_url}
            alt={selectedMovieDetails.title}
            className="w-full rounded-md"
          />
        </div>
      )} */}

      {/* Display movie recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-6 bg-gray-800 p-5 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Recommended Movies:</h2>
          <ul className="list-none flex flex-col gap-2">
            {recommendations.map((rec) => (
              <li
                key={rec.movie_id}
                className="text-lg bg-gray-700 p-3 rounded-md mb-2 cursor-pointer hover:bg-gray-600 flex items-center gap-4"
                onClick={() => fetchMovieDetails(rec.movie_id)} // Fetch details when clicked
              >
               
                <span>🎥 {rec.title}</span>
              </li>
              
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

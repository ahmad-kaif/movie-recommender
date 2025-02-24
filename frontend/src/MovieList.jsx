import { useState } from "react";
import { getRecommendations } from "./api";

const MovieList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const handleRecommend = async () => {
    if (!searchTerm.trim()) return;
    const result = await getRecommendations(searchTerm);
    setRecommendations(result);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-400 shadow-md">
        🎬 Movie Recommender
      </h1>

      {/* Search Input */}
      <div className="w-72">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter a Movie Name..."
          className="w-full px-4 py-2 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
        />
      </div>

      {/* Recommend Button */}
      <button
        onClick={handleRecommend}
        className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      >
        Recommend
      </button>

      {/* Recommendations Grid */}
      {recommendations.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-center mb-4 text-blue-300">
            Recommended Movies:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((movie, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg text-center transition transform hover:scale-105"
              >
                <h3 className="text-lg font-semibold text-white">{movie}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;

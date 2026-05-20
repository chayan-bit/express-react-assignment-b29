import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Star, Users, Flame, PlayCircle } from "lucide-react";

const Community = () => {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("top");

  useEffect(() => {
    const fetchCommunityPuzzles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5005/api/puzzles/community?sort=${sortBy}`,
        );
        setPuzzles(res.data);
      } catch (err) {
        console.error("Failed to fetch community puzzles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunityPuzzles();
  }, [sortBy]);

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-100 mb-2">
            Community Vault
          </h1>
          <p className="text-slate-400 text-lg">
            The most cynical takes by our players.
          </p>
        </div>

        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 mt-4 md:mt-0">
          <button
            onClick={() => setSortBy("top")}
            className={`flex items-center px-4 py-2 rounded-md transition-all ${sortBy === "top" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Star className="w-4 h-4 mr-2" /> Top Rated
          </button>
          <button
            onClick={() => setSortBy("popular")}
            className={`flex items-center px-4 py-2 rounded-md transition-all ${sortBy === "popular" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Flame className="w-4 h-4 mr-2" /> Most Played
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 animate-pulse mt-20">
          Loading the vault...
        </div>
      ) : puzzles.length === 0 ? (
        <div className="text-center text-slate-500 mt-20 border border-dashed border-slate-700 p-12 rounded-2xl bg-slate-800/30">
          No community puzzles yet. Be the first to create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {puzzles.map((puzzle) => (
            <div
              key={puzzle._id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 transition-colors flex flex-col group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-slate-900 text-xs font-bold rounded-full uppercase text-slate-300 border border-slate-700">
                  {puzzle.difficulty}
                </span>
                <div className="flex items-center bg-amber-500/10 text-amber-400 px-2 py-1 rounded-md border border-amber-500/20 text-sm font-semibold">
                  <Star className="w-4 h-4 mr-1 fill-amber-400" />
                  {puzzle.avgRating > 0 ? puzzle.avgRating : "New"}
                </div>
              </div>

              <p className="text-slate-200 font-medium leading-relaxed mb-6 flex-grow line-clamp-4">
                "{puzzle.description}"
              </p>

              <div className="flex justify-between items-end mt-auto pt-4 border-t border-slate-700/50">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Author</p>
                  <p className="text-sm font-semibold text-indigo-400">
                    @{puzzle.author?.username || "Unknown"}
                  </p>
                </div>
                <div className="flex items-center text-xs text-slate-500">
                  <Users className="w-3 h-3 mr-1" />
                  {puzzle.ratingCount}
                </div>
              </div>

              {/* Hover Overlay - Routes to GameBoard passing the puzzle in state */}
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Link
                  to="/"
                  state={{ customPuzzle: puzzle }}
                  className="flex items-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-full transition-transform transform translate-y-4 group-hover:translate-y-0"
                >
                  <PlayCircle className="w-5 h-5 mr-2" /> Play This
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;

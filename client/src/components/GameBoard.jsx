import { useState, useEffect, useContext, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Lightbulb, Star } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const GameBoard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [puzzle, setPuzzle] = useState(null);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const resetGameStates = useCallback(() => {
    setGuess("");
    setFeedback("");
    setAttempts(0);
    setShowHint(false);
    setIsSolved(false);
  }, []);

  const fetchPuzzle = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5005/api/puzzles/random");
      setPuzzle(res.data);
      resetGameStates();
    } catch (err) {
      console.error("Failed to fetch puzzle", err);
    } finally {
      setLoading(false);
    }
  }, [resetGameStates]);

  useEffect(() => {
    if (location.state?.customPuzzle) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPuzzle(location.state.customPuzzle);
      resetGameStates();
      setLoading(false);
      window.history.replaceState({}, document.title);
    } else {
      fetchPuzzle();
    }
  }, [location.state, fetchPuzzle, resetGameStates]);

  const handleGuess = async (e) => {
    e.preventDefault();
    if (!guess.trim() || isSolved) return;

    try {
      const payload = { id: puzzle._id, guess };
      if (user) payload.userId = user.id;

      const res = await axios.post(
        "http://localhost:5005/api/puzzles/guess",
        payload,
      );

      if (res.data.correct) {
        setFeedback("Correct! You cynic, you.");
        setIsSolved(true);

        if (!puzzle.author) {
          setTimeout(fetchPuzzle, 2000);
        }
      } else {
        setAttempts((prev) => prev + 1);
        setFeedback("Nope. Try again.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitRating = async (score) => {
    if (!user) return alert("Log in to rate puzzles!");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        `http://localhost:5005/api/puzzles/${puzzle._id}/rate`,
        { score },
        config,
      );
      setFeedback(`Thanks for rating it ${score} stars! Loading next...`);
      setTimeout(fetchPuzzle, 1500);
    } catch (err) {
      console.error("Failed to submit rating", err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-32 text-slate-400 animate-pulse text-lg">
        Loading the cynicism...
      </div>
    );
  if (!puzzle)
    return (
      <div className="text-center mt-32 text-rose-400">
        Failed to load puzzles. Is the server running?
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-slate-800/50 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-3 items-center">
          <span
            className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-widest ${
              puzzle.difficulty === "Easy"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : puzzle.difficulty === "Medium"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            }`}
          >
            {puzzle.difficulty}
          </span>
          {puzzle.author && (
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-full font-semibold">
              By @{puzzle.author.username || "Community"}
            </span>
          )}
        </div>

        {!user && (
          <span className="text-xs text-slate-400 italic">
            Log in to save your progress
          </span>
        )}
      </div>

      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center leading-relaxed text-slate-100">
        "{puzzle.description}"
      </h2>

      {!isSolved ? (
        <form onSubmit={handleGuess} className="relative mb-8">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Guess the movie title..."
            className="w-full bg-slate-900/80 border border-slate-600 rounded-xl py-4 pl-6 pr-32 text-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500 shadow-inner"
            autoComplete="off"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-lg font-semibold transition-colors shadow-md"
          >
            Guess
          </button>
        </form>
      ) : (
        puzzle.author && (
          <div className="mt-8 p-6 bg-slate-900/50 rounded-xl border border-indigo-500/30 text-center mb-8 animate-[fadeIn_0.5s_ease-out]">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">
              Rate this community puzzle!
            </h3>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => submitRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${star <= hoveredStar ? "text-amber-400 fill-amber-400" : "text-slate-600"}`}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={fetchPuzzle}
              className="mt-6 text-sm text-slate-400 hover:text-white underline"
            >
              Skip rating & play next
            </button>
          </div>
        )
      )}

      <div className="h-8 text-center font-medium mb-6 text-lg">
        {feedback && (
          <span
            className={
              feedback.includes("Nope") ? "text-rose-400" : "text-emerald-400"
            }
          >
            {feedback}
          </span>
        )}
      </div>

      <div className="flex justify-center min-h-[60px]">
        {attempts >= 3 && !showHint && !isSolved && (
          <button
            onClick={() => setShowHint(true)}
            className="flex items-center text-amber-400 hover:text-amber-300 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-amber-400/10"
          >
            <Lightbulb className="w-5 h-5 mr-2" /> I give up, show hint
          </button>
        )}
        {showHint && !isSolved && (
          <div className="bg-amber-900/20 text-amber-200 p-4 rounded-xl border border-amber-500/20 w-full text-center text-lg">
            <span className="font-semibold mr-2 opacity-70">Hint:</span>
            {puzzle.hint}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;

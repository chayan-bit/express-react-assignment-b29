import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PenTool } from "lucide-react";

const CreatePuzzle = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hint: "",
    difficulty: "Medium",
  });

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl text-slate-400">
        Please log in to create puzzles.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post("http://localhost:5005/api/puzzles", formData, config);
      navigate("/community");
    } catch (err) {
      console.error("Failed to create puzzle", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
      <div className="flex items-center space-x-3 mb-8">
        <PenTool className="w-8 h-8 text-indigo-400" />
        <h2 className="text-3xl font-bold text-slate-100">
          Draft a Cynical Puzzle
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Movie Title (The Answer)
          </label>
          <input
            type="text"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., The Wizard of Oz"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Cynical Description
          </label>
          <textarea
            required
            rows="3"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="e.g., Two women fight to the death over a pair of shoes..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Helpful Hint
          </label>
          <input
            type="text"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
            value={formData.hint}
            onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Difficulty
          </label>
          <select
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-slate-100"
            value={formData.difficulty}
            onChange={(e) =>
              setFormData({ ...formData, difficulty: e.target.value })
            }
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg mt-4 transition-all"
        >
          Publish to Community
        </button>
      </form>
    </div>
  );
};

export default CreatePuzzle;

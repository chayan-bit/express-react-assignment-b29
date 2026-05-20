import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { UserPlus } from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5005/api/auth/register", {
        username,
        password,
      });
      login({
        token: res.data.token,
        username: res.data.username,
        id: res.data.userId,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
      <div className="flex justify-center mb-6">
        <div className="bg-emerald-500/20 p-4 rounded-full border border-emerald-500/30">
          <UserPlus className="w-8 h-8 text-emerald-400" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-center mb-8">Join the Cynics</h2>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-3 rounded-lg text-center mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Choose a Username
          </label>
          <input
            type="text"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Password
          </label>
          <input
            type="password"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
        >
          Create Account
        </button>
      </form>

      <p className="text-center mt-6 text-slate-400 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;

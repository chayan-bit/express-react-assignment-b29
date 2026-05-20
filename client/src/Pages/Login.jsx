import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { LogIn } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5005/api/auth/login", {
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
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
      <div className="flex justify-center mb-6">
        <div className="bg-indigo-500/20 p-4 rounded-full border border-indigo-500/30">
          <LogIn className="w-8 h-8 text-indigo-400" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-3 rounded-lg text-center mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Username
          </label>
          <input
            type="text"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
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
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
        >
          Sign In
        </button>
      </form>

      <p className="text-center mt-6 text-slate-400 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-indigo-400 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;

import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Film,
  Trophy,
  LogIn,
  LogOut,
  UserPlus,
  PenTool,
  Globe,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Film className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tight md:block hidden">
            Cynical Cinema
          </span>
        </Link>

        <div className="flex items-center space-x-4 md:space-x-6">
          <Link
            to="/community"
            className="flex items-center text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            <Globe className="w-4 h-4 mr-1.5" />
            Community
          </Link>

          <Link
            to="/leaderboard"
            className="flex items-center text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            <Trophy className="w-4 h-4 mr-1.5" />
            Leaders
          </Link>

          {user ? (
            <div className="flex items-center space-x-4 ml-2 pl-4 border-l border-slate-700">
              <Link
                to="/create"
                className="flex items-center text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium"
              >
                <PenTool className="w-4 h-4 mr-1.5" />
                Create
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-rose-400 hover:text-rose-300 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 ml-2 pl-4 border-l border-slate-700">
              <Link
                to="/login"
                className="flex items-center text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
              >
                <UserPlus className="w-4 h-4 md:mr-1.5" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

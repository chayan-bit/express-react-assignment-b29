import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GameBoard from "./components/GameBoard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Leaderboard from "./pages/Leaderboard";
import CreatePuzzle from "./pages/CreatePuzzle";
import Community from "./pages/Community";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<GameBoard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/create" element={<CreatePuzzle />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

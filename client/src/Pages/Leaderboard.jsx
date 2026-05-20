import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal } from 'lucide-react';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const res = await axios.get('http://localhost:5005/api/leaderboard');
                setLeaders(res.data);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaders();
    }, []);

    if (loading) return <div className="text-center mt-32 text-slate-400 animate-pulse">Loading rankings...</div>;

    return (
        <div className="max-w-3xl mx-auto mt-12">
            <div className="flex items-center justify-center space-x-3 mb-10">
                <Trophy className="w-10 h-10 text-amber-400" />
                <h1 className="text-4xl font-bold text-slate-100">Top Cynics</h1>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-700">
                            <th className="p-5 font-semibold text-slate-400 w-24 text-center">Rank</th>
                            <th className="p-5 font-semibold text-slate-400">Username</th>
                            <th className="p-5 font-semibold text-slate-400 text-right">Puzzles Solved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-slate-500">No data available yet.</td>
                            </tr>
                        ) : (
                            leaders.map((user, index) => (
                                <tr key={user.username} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                    <td className="p-5 text-center">
                                        {index === 0 ? <Medal className="w-6 h-6 mx-auto text-yellow-400" /> :
                                         index === 1 ? <Medal className="w-6 h-6 mx-auto text-slate-300" /> :
                                         index === 2 ? <Medal className="w-6 h-6 mx-auto text-amber-600" /> :
                                         <span className="text-slate-400 font-medium">#{index + 1}</span>}
                                    </td>
                                    <td className="p-5 font-medium text-slate-200">{user.username}</td>
                                    <td className="p-5 text-right font-bold text-indigo-400">{user.score}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;

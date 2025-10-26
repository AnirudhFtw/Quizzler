import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Trophy, Medal, Award } from "lucide-react";
import { resultsApi } from "@/lib/api-client";
import { toast } from "sonner";
import type { GlobalLeaderboardEntry } from "@/lib/api-types";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<GlobalLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const result = await resultsApi.getGlobalLeaderboard(50);
        if ('leaderboard' in result && Array.isArray(result.leaderboard)) {
          setLeaderboardData(result.leaderboard as GlobalLeaderboardEntry[]);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        toast.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Global Leaderboard</h1>
          <p className="text-slate-400">Top performers in trivia quizzes worldwide</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Global Trivia Leaderboard</h2>
          </div>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-700">
                      <tr className="text-left">
                        <th className="px-6 py-4 font-medium text-slate-400">Rank</th>
                        <th className="px-6 py-4 font-medium text-slate-400">User</th>
                        <th className="px-6 py-4 font-medium text-slate-400">Avg Rating</th>
                        <th className="px-6 py-4 font-medium text-slate-400">Quizzes Completed</th>
                        <th className="px-6 py-4 font-medium text-slate-400">Best Quiz</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((user, index) => (
                        <tr key={user.user_id} className="border-b border-slate-700 hover:bg-slate-700/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getRankIcon(index + 1)}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-white">{user.user_name}</td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="bg-green-600 text-white">
                              {Math.round(user.average_rating)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-slate-400">{user.quiz_count}</td>
                          <td className="px-6 py-4 text-slate-300 text-sm">
                            {user.best_quiz || 'N/A'}
                            {user.best_score > 0 && (
                              <span className="text-green-400 ml-2">({user.best_score})</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {leaderboardData.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-slate-400">No leaderboard data available yet.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Global Leaderboard</h1>
          <p className="text-sm sm:text-base text-gray-800 font-semibold">Top performers in trivia quizzes worldwide</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center">Global Trivia Leaderboard</h2>
          </div>
          
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-emerald"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead className="border-b border-gray-200">
                      <tr className="text-left">
                        <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-gray-800 text-sm sm:text-base">Rank</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-gray-800 text-sm sm:text-base">User</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-gray-800 text-sm sm:text-base">Avg Rating</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-gray-800 text-sm sm:text-base hidden sm:table-cell">Quizzes</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-gray-800 text-sm sm:text-base hidden md:table-cell">Best Quiz</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((user, index) => (
                        <tr key={user.user_id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2">
                              {getRankIcon(index + 1)}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="font-bold text-gray-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                              {user.user_name}
                            </div>
                            <div className="text-xs text-gray-600 sm:hidden">
                              {user.quiz_count} quizzes
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <Badge variant="secondary" className="bg-theme-emerald text-white font-bold text-xs sm:text-sm">
                              {Math.round(user.average_rating)}
                            </Badge>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-800 font-semibold text-sm sm:text-base hidden sm:table-cell">
                            {user.quiz_count}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-800 font-semibold text-xs sm:text-sm hidden md:table-cell">
                            <div className="truncate max-w-[150px]">
                              {user.best_quiz || 'N/A'}
                              {user.best_score > 0 && (
                                <span className="text-theme-emerald font-bold ml-2">({user.best_score})</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {leaderboardData.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-800 font-semibold">No leaderboard data available yet.</p>
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
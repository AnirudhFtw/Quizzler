import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award } from "lucide-react";

const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: "Sophia Barnett", score: 95, quizzes: 16, icon: Trophy },
    { rank: 2, name: "Ethan Carter", score: 93, quizzes: 12, icon: Medal },
    { rank: 3, name: "Olivia Davis", score: 92, quizzes: 14, icon: Award },
    { rank: 4, name: "Liam Foster", score: 90, quizzes: 18, icon: null },
    { rank: 5, name: "Ava Green", score: 88, quizzes: 11, icon: null },
    { rank: 6, name: "Noah Harris", score: 85, quizzes: 15, icon: null },
    { rank: 7, name: "Isabella Jones", score: 82, quizzes: 13, icon: null },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">See how you stack up against other quizzlers</p>
        </div>

        <Tabs defaultValue="global" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="national">National</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
          </TabsList>

          <TabsContent value="global">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="px-6 py-4 font-medium text-muted-foreground">Rank</th>
                        <th className="px-6 py-4 font-medium text-muted-foreground">Name</th>
                        <th className="px-6 py-4 font-medium text-muted-foreground">Score</th>
                        <th className="px-6 py-4 font-medium text-muted-foreground">Quizzes Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((user) => (
                        <tr key={user.rank} className="border-b hover:bg-muted/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getRankIcon(user.rank)}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="bg-soft-green text-white">
                              {user.score}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{user.quizzes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="national">
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">National leaderboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional">
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Regional leaderboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Leaderboard;
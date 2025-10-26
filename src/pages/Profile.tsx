import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { resultsApi, userApi } from "@/lib/api-client";
import { toast } from "sonner";
import type { UserStats, UserProfile } from "@/lib/api-types";
import { 
  Trophy,
  Target,
  Star,
  BookOpen,
  Users,
  Clock
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userStats, userProfile] = await Promise.all([
          resultsApi.getUserStats(),
          userApi.getProfile()
        ]);
        setStats(userStats);
        setProfile(userProfile);
        setNewName(userProfile.user.name);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setUpdating(true);
    try {
      await userApi.updateProfile({ name: newName.trim() });
      toast.success("Profile updated successfully!");
      
      // Refresh profile data
      const updatedProfile = await userApi.getProfile();
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };
  //       .from('profiles')
  //       .select('*')
  //       .eq('id', session.user.id)
  //       .single();
  //     
  //     const { data: attempts } = await supabase
  //       .from('quiz_attempts')
  //       .select('*, quizzes(title)')
  //       .eq('user_id', session.user.id)
  //       .order('completed_at', { ascending: false })
  //       .limit(10);
  //     
  //     setProfile(profileData);
  //     setRecentAttempts(attempts);
  //     setLoading(false);
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-xl bg-slate-700 text-white">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{user?.name || 'User'}</h1>
            <p className="text-slate-400 mb-1">{user?.email}</p>
            <p className="text-slate-500 text-sm">
              Joined {user?.created_at ? new Date(user.created_at).getFullYear() : 'Recently'}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {stats.total_quizzes_attempted}
                </div>
                <p className="text-slate-400 text-sm">Total Quizzes</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {Math.round(stats.trivia_stats.average_score)}
                </div>
                <p className="text-slate-400 text-sm">Avg Score</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {stats.trivia_stats.best_score}
                </div>
                <p className="text-slate-400 text-sm">Best Score</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {stats.trivia_stats.topics_attempted.length}
                </div>
                <p className="text-slate-400 text-sm">Topics Tried</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="max-w-6xl">
                    <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-slate-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-slate-700">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-slate-700">
              Activity
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-slate-700">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Quiz Statistics */}
              {stats && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Trivia Stats */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Trivia Performance</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Quizzes Attempted</span>
                            <span className="text-white">{stats.trivia_stats.quizzes_attempted}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Score</span>
                            <span className="text-white">{stats.trivia_stats.total_score}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Average Score</span>
                            <Badge className="bg-green-600 text-white">
                              {Math.round(stats.trivia_stats.average_score)}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Best Score</span>
                            <Badge className="bg-yellow-600 text-white">
                              {stats.trivia_stats.best_score}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Private Quiz Stats */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Private Quizzes</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Quizzes Attempted</span>
                            <span className="text-white">{stats.private_stats.quizzes_attempted}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Score</span>
                            <span className="text-white">{stats.private_stats.total_score}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Average Score</span>
                            <Badge className="bg-blue-600 text-white">
                              {Math.round(stats.private_stats.average_score)}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Best Score</span>
                            <Badge className="bg-purple-600 text-white">
                              {stats.private_stats.best_score}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Topics Attempted */}
                  {stats.trivia_stats.topics_attempted.length > 0 && (
                    <Card className="bg-slate-800 border-slate-700">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Topics Explored</h3>
                        <div className="flex flex-wrap gap-2">
                          {stats.trivia_stats.topics_attempted.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-green-400 border-green-400">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {!stats && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <p className="text-slate-400">No quiz data available yet. Start taking quizzes to see your stats!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* First Quiz Master */}
              <Card className={`bg-slate-800 border-slate-700 ${stats && stats.trivia_stats.quizzes_attempted > 0 ? 'ring-2 ring-yellow-500' : ''}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${stats && stats.trivia_stats.quizzes_attempted > 0 ? 'bg-yellow-500' : 'bg-slate-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">First Quiz Master</h3>
                  <p className="text-slate-400 text-sm">Complete your first quiz</p>
                  {stats && stats.trivia_stats.quizzes_attempted > 0 && (
                    <Badge className="bg-yellow-500 text-white mt-2">Unlocked!</Badge>
                  )}
                </CardContent>
              </Card>

              {/* Perfect Score */}
              <Card className={`bg-slate-800 border-slate-700 ${stats && stats.trivia_stats.best_score === 100 ? 'ring-2 ring-purple-500' : ''}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${stats && stats.trivia_stats.best_score === 100 ? 'bg-purple-500' : 'bg-slate-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Perfect Score</h3>
                  <p className="text-slate-400 text-sm">Score 100% on any quiz</p>
                  {stats && stats.trivia_stats.best_score === 100 && (
                    <Badge className="bg-purple-500 text-white mt-2">Unlocked!</Badge>
                  )}
                </CardContent>
              </Card>

              {/* Quiz Enthusiast */}
              <Card className={`bg-slate-800 border-slate-700 ${stats && (stats.trivia_stats.quizzes_attempted + stats.private_stats.quizzes_attempted) >= 10 ? 'ring-2 ring-green-500' : ''}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${stats && (stats.trivia_stats.quizzes_attempted + stats.private_stats.quizzes_attempted) >= 10 ? 'bg-green-500' : 'bg-slate-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Quiz Enthusiast</h3>
                  <p className="text-slate-400 text-sm">Complete 10 quizzes</p>
                  {stats && (
                    <div className="text-xs text-slate-400 mt-2">
                      {stats.trivia_stats.quizzes_attempted + stats.private_stats.quizzes_attempted}/10
                    </div>
                  )}
                  {stats && (stats.trivia_stats.quizzes_attempted + stats.private_stats.quizzes_attempted) >= 10 && (
                    <Badge className="bg-green-500 text-white mt-2">Unlocked!</Badge>
                  )}
                </CardContent>
              </Card>

              {/* Knowledge Seeker */}
              <Card className={`bg-slate-800 border-slate-700 ${stats && stats.trivia_stats.topics_attempted.length >= 5 ? 'ring-2 ring-indigo-500' : ''}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${stats && stats.trivia_stats.topics_attempted.length >= 5 ? 'bg-indigo-500' : 'bg-slate-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Knowledge Seeker</h3>
                  <p className="text-slate-400 text-sm">Try 5 different quiz topics</p>
                  {stats && (
                    <div className="text-xs text-slate-400 mt-2">
                      {stats.trivia_stats.topics_attempted.length}/5 topics
                    </div>
                  )}
                  {stats && stats.trivia_stats.topics_attempted.length >= 5 && (
                    <Badge className="bg-indigo-500 text-white mt-2">Unlocked!</Badge>
                  )}
                </CardContent>
              </Card>

              {/* High Achiever */}
              <Card className={`bg-slate-800 border-slate-700 ${stats && stats.trivia_stats.average_score >= 80 ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${stats && stats.trivia_stats.average_score >= 80 ? 'bg-blue-500' : 'bg-slate-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">High Achiever</h3>
                  <p className="text-slate-400 text-sm">Maintain 80%+ average score</p>
                  {stats && (
                    <div className="text-xs text-slate-400 mt-2">
                      {Math.round(stats.trivia_stats.average_score)}% average
                    </div>
                  )}
                  {stats && stats.trivia_stats.average_score >= 80 && (
                    <Badge className="bg-blue-500 text-white mt-2">Unlocked!</Badge>
                  )}
                </CardContent>
              </Card>

              {/* Consistent Player */}
              <Card className={`bg-slate-800 border-slate-700 ${stats && stats.trivia_stats.quizzes_attempted >= 5 ? 'ring-2 ring-red-500' : ''}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${stats && stats.trivia_stats.quizzes_attempted >= 5 ? 'bg-red-500' : 'bg-slate-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Consistent Player</h3>
                  <p className="text-slate-400 text-sm">Complete 5 trivia quizzes</p>
                  {stats && (
                    <div className="text-xs text-slate-400 mt-2">
                      {stats.trivia_stats.quizzes_attempted}/5 trivia quizzes
                    </div>
                  )}
                  {stats && stats.trivia_stats.quizzes_attempted >= 5 && (
                    <Badge className="bg-red-500 text-white mt-2">Unlocked!</Badge>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Quiz Activity</h3>
                {profile && profile.quiz_history && profile.quiz_history.length > 0 ? (
                  <div className="space-y-4">
                    {profile.quiz_history.slice(0, 10).map((quiz, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{quiz.quiz_title}</h4>
                          <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                            <span>{quiz.is_trivia ? 'Trivia' : 'Private'}</span>
                            {quiz.topic && <span>• {quiz.topic}</span>}
                            {quiz.difficulty && <span>• {quiz.difficulty}</span>}
                            <span>• {new Date(quiz.submitted_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge className="bg-green-600 text-white">
                          {quiz.score} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400">No quiz activity yet. Start taking quizzes to see your history!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-slate-600 border-slate-500 text-slate-400 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500">Email cannot be changed</p>
                    </div>

                    <Button 
                      onClick={handleUpdateProfile}
                      disabled={updating || newName === user?.name}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {updating ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {profile && profile.trivia_ranking && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Global Ranking</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">
                          #{profile.trivia_ranking.rank}
                        </div>
                        <div className="text-sm text-slate-400">Global Rank</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">
                          {profile.trivia_ranking.average_rating}
                        </div>
                        <div className="text-sm text-slate-400">Avg Rating</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">
                          {profile.trivia_ranking.total_users}
                        </div>
                        <div className="text-sm text-slate-400">Total Players</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Profile Component
 * 
 * BACKEND INTEGRATION NEEDED:
 * 1. Fetch user profile data from 'profiles' table
 * 2. Fetch recent quiz attempts with JOIN:
 *    SELECT qa.*, q.title, q.total_questions
 *    FROM quiz_attempts qa
 *    JOIN quizzes q ON qa.quiz_id = q.id
 *    WHERE qa.user_id = current_user
 *    ORDER BY qa.completed_at DESC
 *    LIMIT 10
 * 
 * 3. Add profile image upload using Supabase Storage:
 *    - Create 'avatars' bucket
 *    - Enable RLS: Users can upload/update their own avatar
 *    - Store avatar URL in profiles table
 * 
 * 4. Add edit profile functionality:
 *    - Allow users to update their profile fields
 *    - Use supabase.from('profiles').update()
 *    - Add form validation
 * 
 * 5. Add authentication check
 * 6. Handle loading and error states
 */

const Profile = () => {
  // TODO: Add state management
  // const [profile, setProfile] = useState(null);
  // const [recentAttempts, setRecentAttempts] = useState([]);
  // const [loading, setLoading] = useState(true);
  
  // TODO: Fetch data from Supabase
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
  //     if (!session) {
  //       window.location.href = '/';
  //       return;
  //     }
  //     
  //     // Fetch profile and quiz attempts
  //     const { data: profileData } = await supabase
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
  //   };
  //   
  //   fetchProfile();
  // }, []);
  
  // Hardcoded data for now - TODO: Replace with database data
  const recentAttempts = [
    {
      quiz: "History of Art",
      score: "85/100",
      date: "2023-08-15",
    },
    {
      quiz: "World Geography", 
      score: "78/100",
      date: "2023-08-10",
    },
    {
      quiz: "Introduction to Physics",
      score: "92/100", 
      date: "2023-08-05",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        {/* TODO: Replace with actual user data from profiles table */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="w-20 h-20">
            {/* TODO: Load from profile.avatar_url */}
            <AvatarImage src="/placeholder.svg" alt="Sophia Clark" />
            <AvatarFallback className="text-xl bg-slate-700 text-white">SC</AvatarFallback>
          </Avatar>
          <div>
            {/* TODO: Use profile.full_name */}
            <h1 className="text-2xl font-bold text-white mb-1">Sophia Clark</h1>
            <p className="text-slate-400 mb-1">Student</p>
            {/* TODO: Format profile.created_at */}
            <p className="text-slate-500 text-sm">Joined 2023</p>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="max-w-6xl">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-800 border-slate-700">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-300"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-300"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-300"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Recent Attempts */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Recent Attempts</h2>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-slate-700">
                          <tr className="text-left">
                            <th className="px-6 py-4 font-medium text-slate-400">Quiz</th>
                            <th className="px-6 py-4 font-medium text-slate-400">Score</th>
                            <th className="px-6 py-4 font-medium text-slate-400">Date</th>
                            <th className="px-6 py-4 font-medium text-slate-400"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentAttempts.map((attempt, index) => (
                            <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                              <td className="px-6 py-4 font-medium text-white">{attempt.quiz}</td>
                              <td className="px-6 py-4 text-slate-300">{attempt.score}</td>
                              <td className="px-6 py-4 text-slate-400">{attempt.date}</td>
                              <td className="px-6 py-4">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Review
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <p className="text-slate-400">Activity history coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <p className="text-slate-400">Profile settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
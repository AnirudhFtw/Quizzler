import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Plus, BarChart3, User, Search } from "lucide-react";

/**
 * Dashboard Component
 * 
 * BACKEND INTEGRATION NEEDED:
 * 1. Fetch user profile data from 'profiles' table
 * 2. Fetch user statistics:
 *    - Total quizzes taken (from 'quiz_attempts' table)
 *    - Average score (calculated from quiz_attempts)
 *    - Leaderboard rank (join with leaderboard data)
 * 
 * 3. Create these database tables:
 *    - quiz_attempts (user_id, quiz_id, score, completed_at)
 *    - Enable RLS: Users can only see their own attempts
 * 
 * 4. Add authentication check:
 *    - Redirect to login if not authenticated
 *    - Use supabase.auth.getSession() in useEffect
 * 
 * 5. Add loading states while fetching data
 * 6. Handle errors gracefully
 */

const Dashboard = () => {
  // TODO: Add state for user data
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [stats, setStats] = useState({ quizzesTaken: 0, avgScore: 0, rank: 0 });
  
  // TODO: Add useEffect to fetch user data and stats
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
  //     if (!session) {
  //       window.location.href = '/';
  //       return;
  //     }
  //     
  //     // Fetch user profile
  //     const { data: profile } = await supabase
  //       .from('profiles')
  //       .select('*')
  //       .eq('id', session.user.id)
  //       .single();
  //     
  //     // Fetch quiz statistics
  //     // ... fetch stats
  //     
  //     setUser(profile);
  //     setLoading(false);
  //   };
  //   
  //   fetchDashboardData();
  // }, []);
  const actionCards = [
    {
      icon: BookOpen,
      title: "Take Trivia Quiz",
      description: "Test your skills",
      color: "bg-soft-green"
    },
    {
      icon: Plus,
      title: "Create a Quiz",
      description: "Design your own challenge",
      color: "bg-soft-green"
    },
    {
      icon: BarChart3,
      title: "View Leaderboards",
      description: "See who's on top",
      color: "bg-soft-green"
    },
    {
      icon: User,
      title: "My Profile",
      description: "Manage your account",
      color: "bg-soft-green"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        {/* TODO: Replace hardcoded name with user.full_name from database */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Sarah!
          </h1>
          <p className="text-muted-foreground">
            Ready to challenge your knowledge or create a new quiz?
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {actionCards.map((card, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                if (card.title === "Take Trivia Quiz") {
                  window.location.href = '/find-quiz';
                } else if (card.title === "Create a Quiz") {
                  window.location.href = '/create-quiz';
                } else if (card.title === "View Leaderboards") {
                  window.location.href = '/leaderboard';
                } else if (card.title === "My Profile") {
                  window.location.href = '/profile';
                }
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`${card.color} p-3 rounded-full`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {card.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats Section */}
        {/* TODO: Replace hardcoded stats with real data from database */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                {/* TODO: Fetch from quiz_attempts table: COUNT(*) WHERE user_id = current_user */}
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-muted-foreground text-sm">Quizzes Taken</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                {/* TODO: Calculate: AVG(score) FROM quiz_attempts WHERE user_id = current_user */}
                <div className="text-2xl font-bold text-primary">85%</div>
                <div className="text-muted-foreground text-sm">Average Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                {/* TODO: Calculate rank from leaderboard - need to create leaderboard logic */}
                <div className="text-2xl font-bold text-primary">#3</div>
                <div className="text-muted-foreground text-sm">Leaderboard Rank</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
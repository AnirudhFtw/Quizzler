import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Plus, BarChart3, Users, TrendingUp, Trophy, Clock, Calendar } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userIp, setUserIp] = useState<string>("");

  useEffect(() => {
    // Get user's IP address
    const getUserIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIp(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
        setUserIp('Unknown');
      }
    };

    getUserIp();
  }, []);
  const actionCards = [
    {
      icon: BookOpen,
      title: "Take Trivia Quiz",
      description: "Test your skills",
      color: "bg-soft-green",
      onClick: () => navigate('/find-quiz')
    },
    {
      icon: Plus,
      title: "Create a Quiz",
      description: "Design your own challenge",
      color: "bg-soft-green",
      onClick: () => navigate('/create-quiz')
    },
    {
      icon: Users,
      title: "My Private Quizzes",
      description: "View and manage your quizzes",
      color: "bg-soft-green",
      onClick: () => navigate('/my-quizzes')
    },
    {
      icon: BarChart3,
      title: "Global Leaderboard",
      description: "See top trivia performers",
      color: "bg-soft-green",
      onClick: () => navigate('/leaderboard')
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name || 'User'}!
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
              onClick={card.onClick}
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


      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 bg-muted/30 border-t border-border/20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 <span className="font-semibold text-foreground">@Quizzler</span>
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <span className="text-red-500">❤️</span> for @{userIp || 'Loading...'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
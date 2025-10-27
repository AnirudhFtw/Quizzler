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
      title: "Take Quiz",
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)]">
        {/* Main content container taking 60-70% of viewport */}
        <div className="w-full max-w-5xl mx-auto px-6" style={{height: '70vh'}}>
          {/* Welcome Section - 20% of content space */}
          <div className="text-center mb-8" style={{height: '20%'}}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-lg text-gray-800 font-semibold max-w-3xl mx-auto">
              Ready to challenge your knowledge or create a new quiz? Let's get started with your learning journey.
            </p>
          </div>

          {/* Action Cards Grid - 80% of content space */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-4/5">
            {actionCards.map((card, index) => (
              <Card 
                key={index} 
                className="cursor-pointer border-2 border-gray-300 bg-white hover:border-theme-navy hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl flex items-center justify-center"
                onClick={card.onClick}
              >
                <CardContent className="p-8 w-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div className="bg-theme-emerald p-5 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
                      <card.icon className="w-12 h-12 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {card.title}
                      </h3>
                      <p className="text-gray-800 font-semibold text-base leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-theme-navy border-t border-theme-navy-light">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-white/70">
              &copy; 2025 <span className="font-semibold text-white">@Quizzler</span>
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-white/70 flex items-center gap-1">
              Made with <span className="text-theme-emerald">❤️</span> for @{userIp || 'Loading...'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
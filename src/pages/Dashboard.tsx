import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Plus, BarChart3, Users, TrendingUp, Trophy, Clock, Calendar, Gamepad2 } from 'lucide-react';
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
      icon: Gamepad2,
      title: "Host Live Quiz",
      description: "Create real-time quiz rooms",
      color: "bg-soft-green",
      onClick: () => navigate('/host-live-quiz')
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
    <div className="min-h-screen bg-gray-50 flex flex-col mobile-viewport">
      <Navigation />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4 leading-tight">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-base sm:text-lg text-gray-800 font-semibold max-w-3xl mx-auto px-4">
              Ready to challenge your knowledge or create a new quiz? Let's get started with your learning journey.
            </p>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {actionCards.map((card, index) => (
              <Card 
                key={index} 
                className="cursor-pointer border-2 border-gray-300 bg-white hover:border-theme-navy hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl"
                onClick={card.onClick}
              >
                <CardContent className="p-4 sm:p-6 lg:p-8 h-full">
                  <div className="flex flex-col items-center text-center space-y-3 lg:space-y-4 h-full justify-center">
                    {/* Icon */}
                    <div className="bg-theme-emerald p-3 sm:p-4 lg:p-5 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
                      <card.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-1 lg:space-y-2">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {card.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-800 font-semibold leading-relaxed">
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
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, ChevronDown } from "lucide-react";

const FindQuiz = () => {
  const categories = [
    { name: "Sports", active: true },
    { name: "Current Affairs", active: false },
    { name: "Tech", active: false },
    { name: "History", active: false },
    { name: "Science", active: false },
    { name: "Entertainment", active: false }
  ];

  const quizzes = [
    {
      title: "Demo Quiz",
      category: "Demo",
      difficulty: "Easy",
      participants: "Demo",
      color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
      icon: "🎯",
      isDemo: true
    },
    {
      title: "Sports Trivia",
      category: "Sports",
      difficulty: "Medium",
      participants: "2.3k",
      color: "bg-gradient-to-br from-green-400 to-green-600",
      icon: "🏃"
    },
    {
      title: "Current Events Challenge",
      category: "Current Affairs",
      difficulty: "Hard",
      participants: "1.8k",
      color: "bg-gradient-to-br from-slate-600 to-slate-800",
      icon: "📰"
    },
    {
      title: "Tech Quiz",
      category: "Technology",
      difficulty: "Easy",
      participants: "3.1k",
      color: "bg-gradient-to-br from-teal-400 to-teal-600",
      icon: "💻"
    },
    {
      title: "History Buff",
      category: "History",
      difficulty: "Medium",
      participants: "1.5k",
      color: "bg-gradient-to-br from-amber-400 to-amber-600",
      icon: "🏛️"
    },
    {
      title: "Science Explorer",
      category: "Science",
      difficulty: "Hard",
      participants: "2.7k",
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
      icon: "🔬"
    },
    {
      title: "Movie Madness",
      category: "Entertainment",
      difficulty: "Easy",
      participants: "4.2k",
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      icon: "🎬"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-soft-green text-white";
      case "Medium": return "bg-amber-500 text-white";
      case "Hard": return "bg-red-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Find a Quiz</h1>
          
          {/* Filter Options */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button variant="outline" className="gap-2">
              Popular <ChevronDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              Difficulty <ChevronDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              New <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={category.active ? "default" : "outline"}
                size="sm"
                className={category.active ? "bg-soft-green hover:bg-soft-green/90" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className={`${quiz.color} h-32 flex items-center justify-center text-4xl`}>
                {quiz.icon}
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {quiz.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className={getDifficultyColor(quiz.difficulty)}
                    >
                      {quiz.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {quiz.participants} played
                    </span>
                  </div>
                  <Button 
                    className="w-full bg-soft-green hover:bg-soft-green/90"
                    onClick={() => quiz.isDemo ? window.location.href = '/take-quiz' : null}
                  >
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FindQuiz;
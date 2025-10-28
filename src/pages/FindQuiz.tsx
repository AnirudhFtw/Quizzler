import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search, Clock, CheckCircle, XCircle } from "lucide-react";
import { quizApi } from "@/lib/api-client";
import { toast } from "sonner";
import type { Quiz } from "@/lib/api-types";

const FindQuiz = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [sortBy, setSortBy] = useState<'popularity' | 'difficulty' | 'recent'>('popularity');
  
  // Private quiz access
  const [privateQuizId, setPrivateQuizId] = useState<string>("");
  const [privateQuiz, setPrivateQuiz] = useState<Quiz | null>(null);
  const [privateQuizLoading, setPrivateQuizLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [triviaQuizzes, topicsResponse] = await Promise.all([
          quizApi.getTriviaQuizzes({ 
            topic: selectedTopic || undefined,
            difficulty: selectedDifficulty || undefined,
            sort_by: sortBy
          }),
          quizApi.getTopics()
        ]);
        
        setQuizzes(triviaQuizzes);
        setTopics(topicsResponse.topics);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
        toast.error("Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTopic, selectedDifficulty, sortBy]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy": return "bg-soft-green text-white";
      case "medium": return "bg-amber-500 text-white";
      case "hard": return "bg-red-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getQuizIcon = (topic?: string) => {
    switch (topic?.toLowerCase()) {
      case "sports": return "🏃";
      case "science": return "🔬";
      case "history": return "🏛️";
      case "technology": case "tech": return "💻";
      case "entertainment": return "🎬";
      case "geography": return "🌍";
      case "math": case "mathematics": return "🔢";
      default: return "🎯";
    }
  };

  const getQuizColor = (index: number) => {
    const colors = [
      "bg-gradient-to-br from-indigo-400 to-indigo-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-slate-600 to-slate-800",
      "bg-gradient-to-br from-teal-400 to-teal-600",
      "bg-gradient-to-br from-amber-400 to-amber-600",
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-red-400 to-red-600",
    ];
    return colors[index % colors.length];
  };

  const handleStartQuiz = (quizId: string, quizStatus?: string) => {
    if (quizStatus && quizStatus !== 'active') {
      if (quizStatus === 'assigned') {
        toast.error("This quiz hasn't started yet");
      } else if (quizStatus === 'ended') {
        toast.error("This quiz has ended");
      }
      return;
    }
    navigate(`/take-quiz/${quizId}`);
  };

  const handleFindPrivateQuiz = async () => {
    if (!privateQuizId.trim()) {
      toast.error("Please enter a quiz ID");
      return;
    }

    setPrivateQuizLoading(true);
    try {
      const quiz = await quizApi.getDetails(privateQuizId.trim());
      setPrivateQuiz(quiz);
      toast.success("Quiz found!");
    } catch (error: any) {
      console.error("Failed to find quiz:", error);
      if (error.message?.includes('404')) {
        toast.error("Quiz not found - check the ID and try again");
      } else if (error.message?.includes('403')) {
        toast.error("Access denied to this quiz");
      } else {
        toast.error("Failed to find quiz");
      }
      setPrivateQuiz(null);
    } finally {
      setPrivateQuizLoading(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'assigned': return <Clock className="w-4 h-4" />;
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'ended': return <XCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'assigned': return 'bg-amber-500';
      case 'active': return 'bg-green-500';
      case 'ended': return 'bg-red-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'assigned': return 'Scheduled';
      case 'active': return 'Active Now';
      case 'ended': return 'Ended';
      default: return 'Active';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Find a Quiz</h1>
        </div>
        
        {/* Private Quiz Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 bg-theme-emerald rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Private Quiz</h2>
          </div>
          
          <Card className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200">
            <p className="text-sm sm:text-base text-gray-800 font-semibold mb-4">Enter a quiz ID to access private quizzes shared with you</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter quiz ID..."
                value={privateQuizId}
                onChange={(e) => setPrivateQuizId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleFindPrivateQuiz()}
                className="flex-1"
              />
              <Button 
                onClick={handleFindPrivateQuiz}
                disabled={privateQuizLoading}
                className="bg-soft-green hover:bg-soft-green/90 w-full sm:w-auto"
              >
                {privateQuizLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Find</span>
                  </>
                )}
              </Button>
            </div>
            
            {/* Private Quiz Display */}
            {privateQuiz && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{privateQuiz.title}</h3>
                    <Badge 
                      className={`${getStatusColor(privateQuiz.status)} text-white flex items-center gap-1`}
                    >
                      {getStatusIcon(privateQuiz.status)}
                      {getStatusText(privateQuiz.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{privateQuiz.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{privateQuiz.question_count} questions</span>
                    <span>{privateQuiz.duration} minutes</span>
                    {privateQuiz.difficulty && (
                      <Badge variant="outline" className={getDifficultyColor(privateQuiz.difficulty)}>
                        {privateQuiz.difficulty}
                      </Badge>
                    )}
                  </div>
                  {privateQuiz.start_time && privateQuiz.end_time && (
                    <div className="text-xs text-muted-foreground mb-3">
                      <p>Start: {new Date(privateQuiz.start_time).toLocaleString()}</p>
                      <p>End: {new Date(privateQuiz.end_time).toLocaleString()}</p>
                    </div>
                  )}
                  <Button 
                    className="w-full bg-soft-green hover:bg-soft-green/90"
                    onClick={() => handleStartQuiz(privateQuiz.id, privateQuiz.status)}
                    disabled={privateQuiz.status !== 'active'}
                  >
                    {privateQuiz.status === 'active' ? 'Start Quiz' : 
                     privateQuiz.status === 'assigned' ? 'Quiz Not Started Yet' : 
                     'Quiz Has Ended'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </Card>
        </div>
        
        {/* Trivia Quiz Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 bg-theme-emerald rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trivia Quiz</h2>
          </div>
          
          <p className="text-sm sm:text-base text-gray-800 font-semibold mb-4 sm:mb-6">Explore public trivia quizzes on various topics and difficulty levels</p>
          
          {/* Filter Options */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
            <select
              className="px-3 py-2 border rounded-md bg-background text-sm sm:text-base"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="popularity">Popular</option>
              <option value="recent">New</option>
              <option value="difficulty">By Difficulty</option>
            </select>
            
            <select
              className="px-3 py-2 border rounded-md bg-background text-sm sm:text-base"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          {/* Topic Tabs */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-6 sm:mb-8">
            <Button
              variant={selectedTopic === "" ? "default" : "outline"}
              size="sm"
              className={`text-xs sm:text-sm ${selectedTopic === "" ? "bg-soft-green hover:bg-soft-green/90" : ""}`}
              onClick={() => setSelectedTopic("")}
            >
              All Topics
            </Button>
            {topics.map((topic) => (
              <Button
                key={topic}
                variant={selectedTopic === topic ? "default" : "outline"}
                size="sm"
                className={`text-xs sm:text-sm ${selectedTopic === topic ? "bg-soft-green hover:bg-soft-green/90" : ""}`}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Quiz Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {quizzes.map((quiz, index) => (
                <Card 
                  key={quiz.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className={`${getQuizColor(index)} h-24 sm:h-32 flex items-center justify-center text-2xl sm:text-4xl`}>
                    {getQuizIcon(quiz.topic)}
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2">
                        {quiz.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {quiz.description}
                      </p>
                      {quiz.topic && (
                        <Badge variant="outline" className="text-xs">
                          {quiz.topic}
                        </Badge>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}
                        >
                          {quiz.difficulty || 'Medium'}
                        </Badge>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {quiz.popularity} played
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {quiz.question_count} questions • {quiz.duration}min
                      </div>
                      <Button 
                        className="w-full bg-soft-green hover:bg-soft-green/90 text-sm"
                        onClick={() => handleStartQuiz(quiz.id)}
                      >
                        Start Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {quizzes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">No quizzes found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or check back later for new quizzes!
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default FindQuiz;
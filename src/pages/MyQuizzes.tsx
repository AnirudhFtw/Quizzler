import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Calendar, Clock, User, Copy, Share2, Download, Eye } from "lucide-react";
import { quizApi, resultsApi } from "@/lib/api-client";
import { toast } from "sonner";
import type { Quiz } from "@/lib/api-types";

const MyQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      try {
        const myQuizzes = await quizApi.getMyQuizzes();
        setQuizzes(myQuizzes);
      } catch (error) {
        console.error("Failed to fetch my quizzes:", error);
        toast.error("Failed to load your quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchMyQuizzes();
  }, []);

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString();
  };

  const getQuizStatus = (quiz: Quiz) => {
    const now = new Date();
    
    if (quiz.start_time) {
      const startTime = new Date(quiz.start_time);
      if (now < startTime) {
        return { status: "Upcoming", color: "bg-blue-500" };
      }
    }

    if (quiz.end_time) {
      const endTime = new Date(quiz.end_time);
      if (now > endTime) {
        return { status: "Ended", color: "bg-red-500" };
      }
    }

    return { status: "Active", color: "bg-green-500" };
  };

  const getQuizStatusBadge = (quiz: Quiz) => {
    const status = quiz.status || 'active';
    
    switch (status) {
      case 'assigned':
        return <Badge className="bg-amber-500 text-white">Scheduled</Badge>;
      case 'active':
        return <Badge className="bg-green-500 text-white">Active Now</Badge>;
      case 'ended':
        return <Badge className="bg-red-500 text-white">Ended</Badge>;
      default:
        return <Badge className="bg-green-500 text-white">Active</Badge>;
    }
  };

  const canStartQuiz = (quiz: Quiz) => {
    return quiz.status === 'active' || !quiz.status;
  };

  const handleStartQuiz = (quizId: string) => {
    navigate(`/take-quiz/${quizId}`);
  };

  const copyQuizId = async (quizId: string) => {
    try {
      // Create a comprehensive sharing message
      const currentUrl = window.location.origin;
      const shareMessage = `🎯 Join my quiz on Quizzler!

Quiz ID: ${quizId}

How to join:
1. Go to ${currentUrl}/find-quiz
2. Enter the Quiz ID: ${quizId}
3. Start the quiz!

Good luck! 📚`;
      
      await navigator.clipboard.writeText(shareMessage);
      toast.success("Quiz sharing info copied! Share this with participants.");
    } catch (error) {
      // Fallback: just copy the quiz ID
      try {
        await navigator.clipboard.writeText(quizId);
        toast.success("Quiz ID copied to clipboard!");
      } catch (fallbackError) {
        toast.error("Failed to copy Quiz ID");
      }
    }
  };

  const handleViewResults = (quizId: string, quizTitle: string) => {
    // Navigate to results management page for quiz creators
    navigate(`/quiz-results-management/${quizId}`, { state: { quizTitle } });
  };

  const handleDownloadResults = async (quizId: string) => {
    try {
      toast.info("Preparing download...");
      const results = await resultsApi.getQuizResults(quizId);
      
      if (!results.results || results.results.length === 0) {
        toast.error("No results found to download");
        return;
      }

      downloadAsCSV(results.results, results.quiz.title);
      toast.success("Results downloaded as CSV");
    } catch (error) {
      console.error("Failed to download results:", error);
      toast.error("Failed to download results");
    }
  };

  const downloadAsCSV = async (data: any[], filename: string) => {
    // We need to get quiz details to calculate total marks
    try {
      const quiz = await quizApi.getDetails(data[0]?.quiz_id || quizzes[0]?.id);
      const totalMarks = (quiz.question_count || 0) * (quiz.positive_mark || 1);
      
      const headers = ['Student Name', 'Email', 'Score', 'Date'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => [
          `"${row.student_name}"`,
          `"${row.email}"`,
          `"${row.score}/${totalMarks}"`,
          `"${new Date(row.date).toLocaleString()}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_results.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // Fallback without total marks
      const headers = ['Student Name', 'Email', 'Score', 'Date'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => [
          `"${row.student_name}"`,
          `"${row.email}"`,
          row.score,
          `"${new Date(row.date).toLocaleString()}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_results.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Private Quizzes</h1>
            <p className="text-muted-foreground">
              Manage your created private quizzes. Share the Quiz ID with others to allow them access.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/create-quiz')}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        </div>

        {/* Quizzes Grid */}
        {quizzes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No private quizzes found</h3>
            <p className="text-muted-foreground mb-6">
              Create your first private quiz to get started!
            </p>
            <Button 
              onClick={() => navigate('/create-quiz')}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Quiz
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => {
              const status = getQuizStatus(quiz);
              const canStart = canStartQuiz(quiz);
              
              return (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg line-clamp-2">{quiz.title}</CardTitle>
                      <Badge variant="secondary" className={`${status.color} text-white text-xs`}>
                        {status.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {quiz.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Quiz Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>Created by you</span>
                      </div>
                      
                      {/* Quiz ID for sharing */}
                      <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs">
                        <span className="font-mono flex-1 truncate">ID: {quiz.id}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyQuizId(quiz.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {quiz.question_count && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{quiz.question_count} questions</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.duration} minutes</span>
                      </div>
                      
                      {quiz.start_time && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs">Starts: {formatDateTime(quiz.start_time)}</span>
                        </div>
                      )}
                      
                      {quiz.end_time && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs">Ends: {formatDateTime(quiz.end_time)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleStartQuiz(quiz.id)}
                        disabled={!canStart}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        {!canStart ? 
                          (status.status === "Upcoming" ? "Not Yet Started" : "Quiz Ended") : 
                          "Start Quiz"
                        }
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => copyQuizId(quiz.id)}
                          className="flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4" />
                          Share Quiz
                        </Button>
                        
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResults(quiz.id, quiz.title)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Results
                        </Button>
                      </div>
                      
                      {/* Download Option - Only show if quiz has ended */}
                      {status.status === "Ended" && (
                        <div className="pt-2 border-t">
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadResults(quiz.id)}
                            className="flex items-center gap-2 text-xs w-full"
                          >
                            <Download className="w-3 h-3" />
                            Download CSV
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyQuizzes;

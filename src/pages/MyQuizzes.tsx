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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex flex-col justify-center items-center py-20">
          <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-500 mb-4"></div>
          <p className="text-black font-semibold">Loading your quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-black mb-2">My Private Quizzes</h1>
                <p className="text-lg text-black font-medium max-w-2xl">
                  Manage your created private quizzes. Share the Quiz ID with others to allow them access.
                </p>
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="flex items-center gap-8 p-6 bg-white rounded-xl border border-green-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center border border-green-200">
                  <Users className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Total Quizzes</p>
                  <p className="text-2xl font-bold text-black">{quizzes.length}</p>
                </div>
              </div>
              <div className="h-10 w-px bg-green-200"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Active Quizzes</p>
                  <p className="text-2xl font-bold text-black">
                    {quizzes.filter(q => getQuizStatus(q).status === "Active").length}
                  </p>
                </div>
              </div>
              <div className="h-10 w-px bg-green-200"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Upcoming</p>
                  <p className="text-2xl font-bold text-black">
                    {quizzes.filter(q => getQuizStatus(q).status === "Upcoming").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/create-quiz')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 ml-8"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Quiz
          </Button>
        </div>

        {/* Quizzes Grid */}
        {quizzes.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-32 h-32 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center mb-8">
              <div className="text-6xl">📝</div>
            </div>
            <h3 className="text-2xl font-bold text-black mb-3">No private quizzes found</h3>
            <p className="text-black font-medium mb-8 max-w-md mx-auto">
              Create your first private quiz to get started! You can share it with specific people using the Quiz ID.
            </p>
            <Button 
              onClick={() => navigate('/create-quiz')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Quiz
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {quizzes.map((quiz) => {
              const status = getQuizStatus(quiz);
              const canStart = canStartQuiz(quiz);
              
              return (
                <Card key={quiz.id} className="bg-white border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
                  {/* Status Indicator Strip */}
                  <div className={`h-1 ${status.status === "Active" ? "bg-green-500" : status.status === "Upcoming" ? "bg-blue-500" : "bg-red-500"}`}></div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <CardTitle className="text-xl font-bold text-black line-clamp-2 pr-3 flex-1">{quiz.title}</CardTitle>
                      <Badge className={`${status.status === "Active" ? "bg-green-100 text-green-800" : status.status === "Upcoming" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"} text-xs font-semibold px-3 py-1 rounded whitespace-nowrap ml-2`}>
                        {status.status}
                      </Badge>
                    </div>
                    <p className="text-black line-clamp-2 text-sm leading-relaxed">
                      {quiz.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 pb-6">
                    {/* Quiz Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-black bg-green-50 border border-green-200 p-3 rounded-lg">
                        <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-semibold text-sm text-black">Created by you</span>
                      </div>
                      
                      {/* Quiz ID for sharing */}
                      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="font-mono flex-1 text-black font-semibold truncate text-xs">ID: {quiz.id}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyQuizId(quiz.id)}
                          className="h-7 w-7 p-0 hover:bg-blue-100"
                        >
                          <Copy className="w-3 h-3 text-black" />
                        </Button>
                      </div>
                      
                      {/* Quiz Stats Row */}
                      <div className="grid grid-cols-2 gap-3">
                        {quiz.question_count && (
                          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                              <Users className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-black">{quiz.question_count} questions</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                            <Clock className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-black">{quiz.duration} min</span>
                        </div>
                      </div>
                      
                      {/* Schedule Info */}
                      {(quiz.start_time || quiz.end_time) && (
                        <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          {quiz.start_time && (
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                                <Calendar className="w-3 h-3 text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-black">Starts</p>
                                <p className="text-xs text-black">{formatDateTime(quiz.start_time)}</p>
                              </div>
                            </div>
                          )}
                          
                          {quiz.end_time && (
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                                <Calendar className="w-3 h-3 text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-black">Ends</p>
                                <p className="text-xs text-black">{formatDateTime(quiz.end_time)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                      <Button 
                        onClick={() => handleStartQuiz(quiz.id)}
                        disabled={!canStart}
                        className={`w-full font-semibold py-3 ${
                          canStart 
                            ? "bg-green-500 hover:bg-green-600 text-white" 
                            : "bg-gray-200 text-black cursor-not-allowed"
                        }`}
                      >
                        {!canStart ? 
                          (status.status === "Upcoming" ? "Not Yet Started" : "Quiz Ended") : 
                          "Start Quiz"
                        }
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => copyQuizId(quiz.id)}
                          className="flex items-center gap-2 border-blue-300 hover:bg-blue-50 font-semibold text-black"
                        >
                          <Share2 className="w-4 h-4" />
                          Share Quiz
                        </Button>
                        
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResults(quiz.id, quiz.title)}
                          className="flex items-center gap-2 border-green-300 hover:bg-green-50 font-semibold text-black"
                        >
                          <Eye className="w-4 h-4" />
                          View Results
                        </Button>
                      </div>
                      
                      {/* Download Option - Only show if quiz has ended */}
                      {status.status === "Ended" && (
                        <div className="pt-3 border-t border-green-200">
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadResults(quiz.id)}
                            className="w-full flex items-center gap-2 text-sm hover:bg-green-50 font-semibold text-black"
                          >
                            <Download className="w-4 h-4" />
                            Download CSV Results
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

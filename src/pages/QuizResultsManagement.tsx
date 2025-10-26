import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Users, Trophy, Target } from "lucide-react";
import { resultsApi } from "@/lib/api-client";
import { API_BASE_URL, getAuthToken } from "@/lib/api-config";
import { toast } from "sonner";

interface QuizResult {
  quiz_name: string;
  date: string;
  student_name: string;
  email: string;
  score: number;
}

interface QuizResultsResponse {
  quiz: {
    id: string;
    title: string;
    description: string;
  };
  results: QuizResult[];
  total_participants: number;
}

const QuizResultsManagement = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const quizTitle = location.state?.quizTitle || "Quiz Results";

  useEffect(() => {
    const fetchResults = async () => {
      if (!quizId) return;
      
      try {
        const quizResults = await resultsApi.getQuizResults(quizId);
        setResults(quizResults);
      } catch (error) {
        console.error("Failed to fetch quiz results:", error);
        toast.error("Failed to load quiz results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  const handleDownload = () => {
    if (!results || results.results.length === 0) {
      toast.error("No results to download");
      return;
    }

    downloadAsCSV(results.results, results.quiz.title);
    toast.success("Results downloaded as CSV");
  };

  const downloadAsCSV = async (data: QuizResult[], filename: string) => {
    try {
      // Get quiz details to find total questions
      const response = await fetch(`${API_BASE_URL}/admin/quizzes/${quizId}/results`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      const resultsData = await response.json();
      const totalQuestions = resultsData.quiz?.questions?.length || 0;
      
      const headers = ['Student Name', 'Email', 'Score', 'Date'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => [
          `"${row.student_name}"`,
          `"${row.email}"`,
          totalQuestions > 0 ? `${row.score}/${totalQuestions}` : row.score,
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
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download CSV');
    }
  };

  const downloadAsExcel = (data: QuizResult[], filename: string) => {
    const headers = ['Student Name', 'Email', 'Score', 'Date'];
    const csvContent = [
      headers.join('\t'),
      ...data.map(row => [
        row.student_name,
        row.email,
        row.score,
        new Date(row.date).toLocaleString()
      ].join('\t'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_results.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStats = () => {
    if (!results || results.results.length === 0) return null;

    const scores = results.results.map(r => r.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highestScore = Math.max(...scores);
    const passCount = scores.filter(score => score >= 60).length; // Assuming 60% is passing

    return {
      averageScore: Math.round(averageScore * 100) / 100,
      highestScore,
      passRate: Math.round((passCount / scores.length) * 100)
    };
  };

  const stats = getStats();

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
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/my-quizzes')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{quizTitle}</h1>
            <p className="text-muted-foreground">Quiz Results & Analytics</p>
          </div>
          {results && results.results.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </Button>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {results?.total_participants || 0}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />
                  Total Participants
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats.averageScore}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Target className="w-4 h-4" />
                  Average Score
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats.highestScore}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4" />
                  Highest Score
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats.passRate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Pass Rate (≥60%)
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Participant Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!results || results.results.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
                <p className="text-muted-foreground">
                  No one has completed this quiz yet. Results will appear here once participants finish.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold">Rank</th>
                      <th className="text-left p-4 font-semibold">Participant</th>
                      <th className="text-left p-4 font-semibold">Email</th>
                      <th className="text-center p-4 font-semibold">Score</th>
                      <th className="text-center p-4 font-semibold">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.results
                      .sort((a, b) => b.score - a.score) // Sort by score (highest first)
                      .map((result, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-medium">{result.student_name}</span>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {result.email}
                          </td>
                          <td className="p-4 text-center">
                            <Badge 
                              className={`${
                                result.score >= 80 ? 'bg-green-500' : 
                                result.score >= 60 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              } text-white`}
                            >
                              {result.score} pts
                            </Badge>
                          </td>
                          <td className="p-4 text-center text-sm text-muted-foreground">
                            {new Date(result.date).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default QuizResultsManagement;

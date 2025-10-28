import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { resultsApi } from "@/lib/api-client";
import { toast } from "sonner";
import type { QuizResult } from "@/lib/api-types";

const QuizResults = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!quizId) {
        toast.error("No quiz ID provided");
        navigate('/dashboard');
        return;
      }

      try {
        const resultData = await resultsApi.getMyResult(quizId);
        setResults(resultData);
      } catch (error) {
        console.error("Failed to fetch results:", error);
        toast.error("Failed to load results");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId, navigate]);

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

  if (!results) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Results not found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Calculate stats from results
  const totalQuestions = Object.keys(results.correct_answers).length;
  const userAnswers = Object.keys(results.answers).length;
  const correctCount = Object.entries(results.answers).reduce((count, [questionId, userAnswer]) => {
    return results.correct_answers[questionId] === userAnswer ? count + 1 : count;
  }, 0);
  
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const incorrectCount = userAnswers - correctCount;
  const unansweredCount = totalQuestions - userAnswers;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Quiz Results</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Your performance on the {results.quiz_title}</p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {results.score}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">Score</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {percentage}%
              </div>
              <p className="text-muted-foreground">Percentage</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Performance Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Questions</span>
                <span className="font-medium text-foreground">{totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Correct Answers</span>
                <span className="font-medium text-green-600">{correctCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Incorrect Answers</span>
                <span className="font-medium text-red-600">{incorrectCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Unanswered Questions</span>
                <span className="font-medium text-muted-foreground">{unansweredCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Submitted At</span>
                <span className="font-medium text-muted-foreground">
                  {new Date(results.submitted_at).toLocaleDateString()} at{' '}
                  {new Date(results.submitted_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Answers */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Answer Review</h2>
            <div className="space-y-6">
              {Object.entries(results.correct_answers).map(([questionId, correctAnswer], index) => {
                const userAnswer = results.answers[questionId];
                const isCorrect = userAnswer === correctAnswer;
                const wasAnswered = userAnswer !== undefined;
                const questionData = results.questions[questionId];
                
                if (!questionData) return null;
                
                return (
                  <div key={questionId} className="border border-border rounded-lg p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      {!wasAnswered ? (
                        <div className="w-5 h-5 border-2 border-muted-foreground rounded-full mt-0.5 flex-shrink-0" />
                      ) : isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-3">
                          Question {index + 1}
                        </h3>
                        <p className="text-foreground mb-4 text-base leading-relaxed">
                          {questionData.question_text}
                        </p>
                      </div>
                    </div>
                    
                    {/* Options */}
                    <div className="ml-8 space-y-2">
                      {['A', 'B', 'C', 'D'].map((optionLetter) => {
                        const optionKey = `option_${optionLetter.toLowerCase()}` as keyof typeof questionData;
                        const optionValue = questionData[optionKey];
                        const isUserAnswer = userAnswer === optionLetter.toLowerCase();
                        const isCorrectOption = correctAnswer === optionLetter.toLowerCase();
                        
                        let optionClass = "p-3 rounded-lg border ";
                        
                        if (isCorrectOption) {
                          optionClass += "bg-green-50 border-green-200 text-green-800";
                        } else if (isUserAnswer && !isCorrect) {
                          optionClass += "bg-red-50 border-red-200 text-red-800";
                        } else {
                          optionClass += "bg-gray-50 border-gray-200 text-gray-700";
                        }
                        
                        return (
                          <div key={optionLetter} className={optionClass}>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium min-w-[24px]">
                                {optionLetter}.
                              </span>
                              <span>{optionValue}</span>
                              {isUserAnswer && (
                                <span className="ml-auto text-sm font-medium">
                                  Your answer
                                </span>
                              )}
                              {isCorrectOption && (
                                <span className="ml-auto text-sm font-medium">
                                  Correct answer
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Answer Status */}
                    <div className="ml-8 mt-4 text-sm">
                      {!wasAnswered ? (
                        <p className="text-amber-600 font-medium">
                          ⚠️ Not answered
                        </p>
                      ) : isCorrect ? (
                        <p className="text-green-600 font-medium">
                          ✓ Correct answer
                        </p>
                      ) : (
                        <p className="text-red-600 font-medium">
                          ✗ Incorrect answer
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/find-quiz')}
            className="bg-soft-green hover:bg-soft-green/90"
          >
            Take Another Quiz
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
};

export default QuizResults;
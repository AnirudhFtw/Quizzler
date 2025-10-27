import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sessionApi, quizApi } from "@/lib/api-client";
import { toast } from "sonner";
import type { StartQuizResponse, Question } from "@/lib/api-types";

const TakeQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [hasReceivedWarning, setHasReceivedWarning] = useState(false); // In-memory boolean tracker
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quiz, setQuiz] = useState<StartQuizResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch quiz data and start session
  useEffect(() => {
    const startQuiz = async () => {
      if (!quizId) {
        toast.error("No quiz ID provided");
        navigate('/find-quiz');
        return;
      }

      try {
        const sessionData = await sessionApi.start(quizId);
        setQuiz(sessionData);
        setTimeLeft(sessionData.quiz.duration * 60); // Convert minutes to seconds
        setLoading(false);
      } catch (error) {
        console.error('Failed to start quiz:', error);
        toast.error(error instanceof Error ? error.message : "Failed to start quiz");
        navigate('/find-quiz');
      }
    };

    startQuiz();
  }, [quizId, navigate]);

  // Timer logic - countdown every second
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Tab switching detection - prevents cheating
  useEffect(() => {
    if (!quiz?.quiz.tab_switch_exit) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Tab switch detected. Has received warning:', hasReceivedWarning);
        if (!hasReceivedWarning) {
          // First tab switch - show warning and set flag to true
          console.log('First violation - showing warning');
          setHasReceivedWarning(true);
          setShowWarning(true);
        } else {
          // Second tab switch - auto-submit with 0 marks
          console.log('Second violation - auto-submitting with 0 marks');
          handleAutoSubmitViolation();
        }
      }
    };

    const handleBlur = () => {
      console.log('Window blur detected. Has received warning:', hasReceivedWarning);
      if (!hasReceivedWarning) {
        // First tab switch - show warning and set flag to true
        console.log('First violation - showing warning');
        setHasReceivedWarning(true);
        setShowWarning(true);
      } else {
        // Second tab switch - auto-submit with 0 marks
        console.log('Second violation - auto-submitting with 0 marks');
        handleAutoSubmitViolation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [quiz, hasReceivedWarning]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleOptionClick = (option: 'a' | 'b' | 'c' | 'd') => {
    if (!quiz) return;
    
    const questionId = quiz.questions[currentQuestion].id;
    setUserAnswers(prev => {
      if (prev[questionId] === option) {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      }
      return { ...prev, [questionId]: option };
    });
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || !quizId) return;
    
    setSubmitting(true);
    
    try {
      const result = await sessionApi.submit(quizId, { answers: userAnswers });
      toast.success("Quiz submitted successfully!");
      navigate(`/quiz-results/${quizId}`);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmitViolation = async () => {
    if (!quiz || !quizId) return;
    
    setSubmitting(true);
    
    try {
      // Submit with empty answers (results in 0 marks)
      const result = await sessionApi.submit(quizId, { answers: {} });
      toast.error("Quiz auto-submitted due to rule violation. Score: 0");
      navigate(`/quiz-results/${quizId}`);
    } catch (error) {
      console.error("Failed to auto-submit quiz:", error);
      toast.error("Quiz ended due to rule violation");
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
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

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
          <Button onClick={() => navigate('/find-quiz')}>
            Back to Find Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        {/* Timer */}
        <div className="text-center mb-8">
          <div className="text-4xl font-mono font-bold text-foreground">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Card */}
        <Card className="max-w-2xl mx-auto mb-8">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="text-sm text-muted-foreground mb-4">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {quiz.questions[currentQuestion].question_text}
              </h2>
            </div>

            <div className="space-y-3">
              {[
                { key: 'a', text: quiz.questions[currentQuestion].option_a },
                { key: 'b', text: quiz.questions[currentQuestion].option_b },
                { key: 'c', text: quiz.questions[currentQuestion].option_c },
                { key: 'd', text: quiz.questions[currentQuestion].option_d },
              ].map((option) => {
                const questionId = quiz.questions[currentQuestion].id;
                const isSelected = userAnswers[questionId] === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => handleOptionClick(option.key as 'a' | 'b' | 'c' | 'd')}
                    className={`w-full p-4 text-left border rounded-lg transition-colors ${
                      isSelected 
                        ? 'border-primary bg-primary/10 text-foreground' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <span className="mr-3 text-muted-foreground">{option.key.toUpperCase()}.</span>
                    {option.text}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between max-w-2xl mx-auto">
          {/* Only show Previous button for omni navigation */}
          {quiz.quiz.navigation_type === 'omni' && (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
          )}
          
          {/* For restricted navigation, add spacer div */}
          {quiz.quiz.navigation_type === 'restricted' && <div />}
          
          <Button 
            onClick={currentQuestion === quiz.questions.length - 1 ? handleSubmitQuiz : handleNext}
            className="bg-soft-green hover:bg-soft-green/90"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 
             currentQuestion === quiz.questions.length - 1 ? 'Finish Attempt' : 'Next'}
          </Button>
        </div>
      </main>

      {/* Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="max-w-2xl w-full mx-4">
          <DialogHeader>
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-3xl font-bold text-red-600 mb-4">
              Warning!
            </DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <p className="text-lg font-medium text-gray-800">
                Switching tabs or minimizing the window is not allowed during the quiz. 
                This action has been logged.
              </p>
              <p className="text-base font-semibold text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                This is your first and only warning. Any further tab switches will automatically end the quiz with 0 marks.
              </p>
              <p className="text-sm font-medium text-gray-600 bg-gray-100 p-3 rounded-lg">
                Warning issued - Next violation will end quiz
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => setShowWarning(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg"
              size="lg"
            >
              I Understand - Continue Quiz
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TakeQuiz;
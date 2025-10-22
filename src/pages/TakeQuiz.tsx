import { useState, useEffect } from "react";
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

/**
 * TakeQuiz Component
 * 
 * BACKEND INTEGRATION NEEDED:
 * 1. Fetch quiz data from database using quiz ID from URL params:
 *    - Get quiz metadata from 'quizzes' table
 *    - Get all questions from 'questions' table
 *    - Use JOIN or separate queries
 * 
 * 2. Create 'quiz_attempts' table to store results:
 *    - id (uuid, primary key)
 *    - user_id (uuid, references profiles.id)
 *    - quiz_id (uuid, references quizzes.id)
 *    - score (numeric)
 *    - answers (jsonb - stores user's answers)
 *    - time_taken (integer - seconds)
 *    - violations_count (integer)
 *    - completed_at (timestamp)
 * 
 * 3. Create 'quiz_violations' table to log cheating attempts:
 *    - id (uuid, primary key)
 *    - attempt_id (uuid, references quiz_attempts.id)
 *    - violation_type (text: 'tab_switch', 'window_blur')
 *    - timestamp (timestamp)
 * 
 * 4. Track user's selected answers in state
 * 5. Auto-submit when timer reaches 0
 * 6. Calculate score and save to database on submit
 * 7. Add authentication check
 * 8. Handle loading states
 */

const TakeQuiz = () => {
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(299); // 4:59 in seconds
  const [showWarning, setShowWarning] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  
  // TODO: Add these states for backend integration
  // const [quiz, setQuiz] = useState(null);
  // const [questions, setQuestions] = useState([]);
  // const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  // const [loading, setLoading] = useState(true);
  // const [submitting, setSubmitting] = useState(false);
  // const [attemptId, setAttemptId] = useState<string | null>(null);
  
  // TODO: Fetch quiz data on mount
  // useEffect(() => {
  //   const fetchQuiz = async () => {
  //     const params = new URLSearchParams(window.location.search);
  //     const quizId = params.get('id');
  //     
  //     const { data: quizData, error } = await supabase
  //       .from('quizzes')
  //       .select('*, questions(*)')
  //       .eq('id', quizId)
  //       .single();
  //     
  //     if (error) {
  //       console.error('Error fetching quiz:', error);
  //       return;
  //     }
  //     
  //     setQuiz(quizData);
  //     setQuestions(quizData.questions.sort((a, b) => a.order_index - b.order_index));
  //     setLoading(false);
  //     
  //     // Create a new quiz attempt record
  //     const { data: attempt } = await supabase
  //       .from('quiz_attempts')
  //       .insert({
  //         user_id: user.id,
  //         quiz_id: quizId,
  //         score: 0, // Will be updated on submit
  //       })
  //       .select()
  //       .single();
  //     
  //     setAttemptId(attempt.id);
  //   };
  //   
  //   fetchQuiz();
  // }, []);

  // Hardcoded questions for now - TODO: Replace with database data
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1
    }
  ];

  // Timer logic - countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          // TODO: Auto-submit quiz when time runs out
          // handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Tab switching detection - prevents cheating
  // TODO: Log these violations to 'quiz_violations' table
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolationCount(prev => prev + 1);
        setShowWarning(true);
        
        // TODO: Log violation to database
        // if (attemptId) {
        //   await supabase.from('quiz_violations').insert({
        //     attempt_id: attemptId,
        //     violation_type: 'tab_switch',
        //     timestamp: new Date().toISOString(),
        //   });
        // }
      }
    };

    const handleBlur = () => {
      setViolationCount(prev => prev + 1);
      setShowWarning(true);
      
      // TODO: Log violation to database
      // if (attemptId) {
      //   await supabase.from('quiz_violations').insert({
      //     attempt_id: attemptId,
      //     violation_type: 'window_blur',
      //     timestamp: new Date().toISOString(),
      //   });
      // }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, []); // TODO: Add attemptId to dependencies

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
    // Last question handled by button onClick below
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  /**
   * Submit quiz and save results to database
   * 
   * BACKEND TODO:
   * 1. Calculate final score by comparing userAnswers with correct answers
   * 2. Update 'quiz_attempts' record with:
   *    - Final score
   *    - User's answers (jsonb)
   *    - Time taken (initial_time - timeLeft)
   *    - Violations count
   *    - completed_at timestamp
   * 3. Show success toast notification
   * 4. Redirect to results page with attempt_id
   * 5. Handle errors gracefully
   */
  // const handleSubmitQuiz = async () => {
  //   setSubmitting(true);
  //   
  //   // Calculate score
  //   let correctCount = 0;
  //   questions.forEach((question, index) => {
  //     if (userAnswers[question.id] === question.correct_answer) {
  //       correctCount++;
  //     }
  //   });
  //   
  //   const finalScore = (correctCount / questions.length) * 100;
  //   const timeTaken = 299 - timeLeft; // seconds
  //   
  //   // Update quiz attempt in database
  //   const { error } = await supabase
  //     .from('quiz_attempts')
  //     .update({
  //       score: finalScore,
  //       answers: userAnswers,
  //       time_taken: timeTaken,
  //       violations_count: violationCount,
  //       completed_at: new Date().toISOString(),
  //     })
  //     .eq('id', attemptId);
  //   
  //   if (error) {
  //     console.error('Error saving quiz results:', error);
  //     toast.error('Failed to save quiz results');
  //     setSubmitting(false);
  //     return;
  //   }
  //   
  //   // Success - redirect to results
  //   toast.success('Quiz submitted successfully!');
  //   window.location.href = `/quiz-results?id=${attemptId}`;
  // };

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
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {questions[currentQuestion].question}
              </h2>
            </div>

            <div className="space-y-3">
              {/* TODO: Add onClick to save user's answer to userAnswers state */}
              {/* TODO: Add visual feedback (highlight) for selected answer */}
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className="w-full p-4 text-left border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  // TODO: onClick={() => setUserAnswers({ ...userAnswers, [questions[currentQuestion].id]: index })}
                >
                  <span className="mr-3 text-muted-foreground">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between max-w-2xl mx-auto">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button 
            // TODO: Replace with handleSubmitQuiz() call
            onClick={currentQuestion === questions.length - 1 ? () => window.location.href = '/quiz-results' : handleNext}
            className="bg-soft-green hover:bg-soft-green/90"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Attempt' : 'Next'}
          </Button>
        </div>
      </main>

      {/* Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-bold">Warning!</DialogTitle>
            <DialogDescription className="text-center space-y-2">
              <p>
                Switching tabs or minimizing the window is not allowed during the quiz. 
                This action has been logged.
              </p>
              <p className="text-sm">
                Further violations may lead to disqualification.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => setShowWarning(false)}
              className="w-full bg-soft-green hover:bg-soft-green/90"
            >
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TakeQuiz;
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Circle } from "lucide-react";

const QuizResults = () => {
  const [activeTab, setActiveTab] = useState("review");

  // Mock quiz results data
  const results = {
    score: 8,
    total: 10,
    percentage: 80,
    correctAnswers: 8,
    incorrectAnswers: 2,
    unansweredQuestions: 0,
    quizTitle: "History of Science Quiz"
  };

  const reviewQuestions = [
    {
      question: "What is the name of the first artificial satellite launched into space?",
      userAnswer: "Sputnik",
      correctAnswer: "Sputnik",
      isCorrect: true
    },
    {
      question: "Who developed the theory of relativity?",
      userAnswer: "Einstein",
      correctAnswer: "Einstein", 
      isCorrect: true
    },
    {
      question: "What is the chemical symbol for gold?",
      userAnswer: "Au",
      correctAnswer: "Au",
      isCorrect: true
    },
    {
      question: "What is the name of the first computer?",
      userAnswer: "ENIAC",
      correctAnswer: "ENIAC",
      isCorrect: false
    },
    {
      question: "Who invented the telephone?",
      userAnswer: "Bell",
      correctAnswer: "Alexander Graham Bell",
      isCorrect: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Results</h1>
          <p className="text-muted-foreground">Your performance on the {results.quizTitle}</p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-foreground mb-2">
                {results.score}/{results.total}
              </div>
              <p className="text-muted-foreground">Score</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-foreground mb-2">
                {results.percentage}%
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
                <span className="text-muted-foreground">Correct Answers</span>
                <span className="font-medium text-green-600">{results.correctAnswers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Incorrect Answers</span>
                <span className="font-medium text-red-600">{results.incorrectAnswers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Unanswered Questions</span>
                <span className="font-medium text-muted-foreground">{results.unansweredQuestions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Questions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Review Questions</h2>
            <div className="space-y-4">
              {reviewQuestions.map((question, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    {question.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-2">{question.question}</p>
                      <div className="text-sm space-y-1">
                        <p className="text-muted-foreground">
                          Your answer: <span className={question.isCorrect ? "text-green-600" : "text-red-600"}>{question.userAnswer}</span>
                        </p>
                        {!question.isCorrect && (
                          <p className="text-muted-foreground">
                            Correct answer: <span className="text-green-600">{question.correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.location.href = '/find-quiz'}
            className="bg-soft-green hover:bg-soft-green/90"
          >
            Take Another Quiz
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/dashboard'}
          >
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
};

export default QuizResults;
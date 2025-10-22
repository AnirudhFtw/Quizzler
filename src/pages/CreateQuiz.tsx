import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

/**
 * CreateQuiz Component
 * 
 * BACKEND INTEGRATION NEEDED:
 * 1. Create 'quizzes' table in Supabase:
 *    - id (uuid, primary key)
 *    - creator_id (uuid, references profiles.id)
 *    - title (text, required)
 *    - description (text)
 *    - created_at (timestamp)
 *    - is_public (boolean, default true)
 * 
 * 2. Create 'questions' table:
 *    - id (uuid, primary key)
 *    - quiz_id (uuid, references quizzes.id, ON DELETE CASCADE)
 *    - type (text: 'multiple-choice', 'true-false', 'fill-blank')
 *    - question_text (text, required)
 *    - options (jsonb array for storing answer options)
 *    - correct_answer (text or number)
 *    - order_index (integer, for question ordering)
 * 
 * 3. Enable RLS on both tables:
 *    - Users can create their own quizzes
 *    - Users can read public quizzes or their own quizzes
 *    - Users can update/delete only their own quizzes
 *    - Questions inherit the same permissions as their parent quiz
 * 
 * 4. In handleCreateQuiz:
 *    - First insert into 'quizzes' table
 *    - Then bulk insert questions with the quiz_id
 *    - Use Supabase transactions for data integrity
 *    - Show success toast and redirect to quiz list
 * 
 * 5. Add authentication check to ensure user is logged in
 * 6. Add loading states and error handling
 */

type QuestionType = "multiple-choice" | "true-false" | "fill-blank";

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number | string;
}

const CreateQuiz = () => {
  // Quiz metadata state
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Current question being edited
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
  });
  
  // TODO: Add loading and authentication states
  // const [loading, setLoading] = useState(false);
  // const [user, setUser] = useState(null);
  
  // TODO: Add useEffect to check authentication
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
  //     if (!session) {
  //       window.location.href = '/';
  //     } else {
  //       setUser(session.user);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  const handleQuestionTypeChange = (type: QuestionType) => {
    let options: string[] = [];
    
    if (type === "multiple-choice") {
      options = ["", "", "", ""];
    } else if (type === "true-false") {
      options = ["True", "False"];
    } else if (type === "fill-blank") {
      options = [""];
    }
    
    setCurrentQuestion({
      ...currentQuestion,
      type,
      options,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  const addQuestion = () => {
    if (!currentQuestion.question || !currentQuestion.type) return;
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type,
      question: currentQuestion.question,
      options: currentQuestion.options || [],
      correctAnswer: 0,
    };
    
    setQuestions([...questions, newQuestion]);
    
    // Reset current question
    const defaultOptions = currentQuestion.type === "multiple-choice" 
      ? ["", "", "", ""] 
      : currentQuestion.type === "true-false" 
        ? ["True", "False"] 
        : [""];
    
    setCurrentQuestion({
      type: currentQuestion.type,
      question: "",
      options: defaultOptions,
    });
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  /**
   * Handle quiz creation and save to database
   * 
   * BACKEND TODO:
   * 1. Validate all inputs (title, description, questions)
   * 2. Insert quiz into 'quizzes' table
   * 3. Insert all questions with the quiz_id
   * 4. Handle errors (network, validation, database)
   * 5. Show success toast notification
   * 6. Redirect to dashboard or quiz list page
   */
  const handleCreateQuiz = async () => {
    // TODO: Replace with actual database save
    // setLoading(true);
    
    // const { data: quizData, error: quizError } = await supabase
    //   .from('quizzes')
    //   .insert({
    //     title: quizTitle,
    //     description: quizDescription,
    //     creator_id: user.id,
    //     is_public: true,
    //   })
    //   .select()
    //   .single();
    
    // if (quizError) {
    //   console.error('Error creating quiz:', quizError);
    //   setLoading(false);
    //   return;
    // }
    
    // // Now insert all questions
    // const questionsToInsert = questions.map((q, index) => ({
    //   quiz_id: quizData.id,
    //   type: q.type,
    //   question_text: q.question,
    //   options: q.options,
    //   correct_answer: q.correctAnswer,
    //   order_index: index,
    // }));
    
    // const { error: questionsError } = await supabase
    //   .from('questions')
    //   .insert(questionsToInsert);
    
    // if (questionsError) {
    //   console.error('Error creating questions:', questionsError);
    //   setLoading(false);
    //   return;
    // }
    
    // Success - show toast and redirect
    console.log("Creating quiz:", { quizTitle, quizDescription, questions });
    // toast.success("Quiz created successfully!");
    // window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-sage/5">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create a New Quiz
          </h1>
          <p className="text-muted-foreground">
            Let's get started with the basics
          </p>
        </div>

        {/* Quiz Basic Info */}
        <Card className="mb-8">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Quiz Title</Label>
              <Input
                id="quiz-title"
                placeholder="e.g., World Capitals"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quiz-description">Quiz Description</Label>
              <Textarea
                id="quiz-description"
                placeholder="A fun quiz to test your geography knowledge"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Questions Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Questions</CardTitle>
            <p className="text-muted-foreground">Build your quiz one question at a time</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select 
                  value={currentQuestion.type} 
                  onValueChange={(value: QuestionType) => handleQuestionTypeChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="true-false">True or False</SelectItem>
                    <SelectItem value="fill-blank">Fill in the Blanks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="question-text">Question</Label>
                <Input
                  id="question-text"
                  placeholder="What is the capital of France?"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    question: e.target.value
                  })}
                />
              </div>
            </div>

            {/* Options based on question type */}
            <div className="space-y-4">
              <Label>Options</Label>
              {currentQuestion.type === "multiple-choice" && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                      </div>
                      <Input
                        placeholder={`Option ${index + 1} e.g., Paris`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              )}

              {currentQuestion.type === "true-false" && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                      </div>
                      <div className="flex-1 p-3 border rounded-md bg-muted/20">
                        {option}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentQuestion.type === "fill-blank" && (
                <div className="space-y-3">
                  <Input
                    placeholder="Correct answer"
                    value={currentQuestion.options?.[0] || ""}
                    onChange={(e) => handleOptionChange(0, e.target.value)}
                  />
                </div>
              )}
            </div>

            <Button 
              onClick={addQuestion}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!currentQuestion.question}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </CardContent>
        </Card>

        {/* Added Questions List */}
        {questions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Questions Added ({questions.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground">{question.question}</p>
                  <div className="text-sm text-muted-foreground">
                    Type: {question.type === "multiple-choice" ? "Multiple Choice" : 
                           question.type === "true-false" ? "True or False" : "Fill in the Blanks"}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Create Quiz Button */}
        <div className="text-center">
          <Button 
            onClick={handleCreateQuiz}
            size="lg"
            className="bg-primary hover:bg-primary/90 px-8"
            disabled={!quizTitle || questions.length === 0}
          >
            Create Quiz
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CreateQuiz;
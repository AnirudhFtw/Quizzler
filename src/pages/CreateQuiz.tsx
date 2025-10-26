import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { quizApi } from "@/lib/api-client";
import { toast } from "sonner";
import type { QuestionCreate } from "@/lib/api-types";

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'a' | 'b' | 'c' | 'd';
  mark?: number;
}

const CreateQuiz = () => {
  const navigate = useNavigate();
  
  // Quiz metadata state
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [isTrivia, setIsTrivia] = useState(false);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Private quiz scheduling
  const [startTime, setStartTime] = useState("");
  
  // Marking system
  const [positiveMark, setPositiveMark] = useState(1);
  const [negativeMark, setNegativeMark] = useState(0);
  
  // Quiz behavior settings
  const [navigationType, setNavigationType] = useState<"omni" | "restricted">("omni");
  const [tabSwitchExit, setTabSwitchExit] = useState(true);
  
  // Current question being edited
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: 'a',
    mark: 1
  });

  // Update current question mark when positive mark changes
  useEffect(() => {
    setCurrentQuestion(prev => ({ ...prev, mark: positiveMark }));
  }, [positiveMark]);

  const handleOptionChange = (option: 'a' | 'b' | 'c' | 'd', value: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      [`option_${option}`]: value,
    } as Question);
  };

  const addQuestion = () => {
    if (!currentQuestion.question_text || 
        !currentQuestion.option_a || 
        !currentQuestion.option_b || 
        !currentQuestion.option_c || 
        !currentQuestion.option_d) {
      toast.error("Please fill in all question fields");
      return;
    }
    
    const newQuestion: Question = {
      ...currentQuestion,
      id: Date.now().toString(),
    };
    
    setQuestions([...questions, newQuestion]);
    
    // Reset current question
    setCurrentQuestion({
      id: "",
      question_text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_option: 'a',
      mark: positiveMark
    });
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleCreateQuiz = async () => {
    if (!quizTitle || questions.length === 0) {
      toast.error("Please provide a title and at least one question");
      return;
    }

    // Validate scheduling for private quizzes
    if (!isTrivia && startTime) {
      const start = new Date(startTime);
      const now = new Date();
      
      if (start <= now) {
        toast.error("Start time must be in the future");
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const questionsData = questions.map(q => ({
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option,
        mark: q.mark
      }));
      
      const quizData = {
        title: quizTitle,
        description: quizDescription,
        is_trivia: isTrivia,
        topic: topic || undefined,
        difficulty: difficulty || undefined,
        duration,
        start_time: startTime || undefined,
        positive_mark: positiveMark,
        negative_mark: negativeMark,
        navigation_type: navigationType,
        tab_switch_exit: tabSwitchExit,
        questions: questionsData
      };
      
      const result = await quizApi.create(quizData);
      toast.success("Quiz created successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to create quiz:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create quiz";
      toast.error(errorMessage, {
        duration: 5000, // Show error for 5 seconds
      });
    } finally {
      setLoading(false);
    }
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is-trivia" 
                  checked={isTrivia}
                  onCheckedChange={(checked) => setIsTrivia(checked as boolean)}
                />
                <Label htmlFor="is-trivia">Make this a trivia quiz</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="180"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                />
              </div>
            </div>

            {isTrivia && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic (Optional)</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Geography, Science"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quiz Configuration - Marking & Behavior */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quiz Configuration</CardTitle>
            <p className="text-muted-foreground">Configure marking system and quiz behavior</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Marking System */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Marking System</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="positive-mark">Positive Marks (per correct answer)</Label>
                  <Input
                    id="positive-mark"
                    type="number"
                    min="1"
                    max="10"
                    value={positiveMark}
                    onChange={(e) => setPositiveMark(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="negative-mark">Negative Marks (per wrong answer)</Label>
                  <Input
                    id="negative-mark"
                    type="number"
                    min="0"
                    max="5"
                    step="1"
                    value={negativeMark}
                    onChange={(e) => setNegativeMark(parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">Set to 0 for no negative marking</p>
                </div>
              </div>
            </div>

            {/* Quiz Behavior */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Quiz Behavior</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="navigation-type">Navigation Type</Label>
                  <Select value={navigationType} onValueChange={(value: "omni" | "restricted") => setNavigationType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="omni">Omni - Can navigate freely between questions</SelectItem>
                      <SelectItem value="restricted">Restricted - Sequential navigation only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox 
                    id="tab-switch-exit" 
                    checked={tabSwitchExit}
                    onCheckedChange={(checked) => setTabSwitchExit(checked as boolean)}
                  />
                  <Label htmlFor="tab-switch-exit">Exit quiz if user switches tabs</Label>
                </div>
              </div>
            </div>

            {/* Private Quiz Scheduling */}
            {!isTrivia && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Quiz Scheduling (Optional)</h3>
                <p className="text-sm text-muted-foreground">Leave blank for immediate availability</p>
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    End time will be automatically calculated as start time + {duration} minutes
                  </p>
                </div>
                {startTime && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Quiz Schedule:</strong><br/>
                      Start: {new Date(startTime).toLocaleString()}<br/>
                      End: {new Date(new Date(startTime).getTime() + duration * 60000).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Questions Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Questions</CardTitle>
            <p className="text-muted-foreground">Build your quiz one question at a time</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question-text">Question</Label>
                <Input
                  id="question-text"
                  placeholder="What is the capital of France?"
                  value={currentQuestion.question_text}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    question_text: e.target.value
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="option-a">Option A</Label>
                  <Input
                    id="option-a"
                    placeholder="e.g., Paris"
                    value={currentQuestion.option_a}
                    onChange={(e) => handleOptionChange('a', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option-b">Option B</Label>
                  <Input
                    id="option-b"
                    placeholder="e.g., London"
                    value={currentQuestion.option_b}
                    onChange={(e) => handleOptionChange('b', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option-c">Option C</Label>
                  <Input
                    id="option-c"
                    placeholder="e.g., Berlin"
                    value={currentQuestion.option_c}
                    onChange={(e) => handleOptionChange('c', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option-d">Option D</Label>
                  <Input
                    id="option-d"
                    placeholder="e.g., Madrid"
                    value={currentQuestion.option_d}
                    onChange={(e) => handleOptionChange('d', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Correct Answer</Label>
                  <Select 
                    value={currentQuestion.correct_option} 
                    onValueChange={(value: 'a' | 'b' | 'c' | 'd') => 
                      setCurrentQuestion({...currentQuestion, correct_option: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Option A</SelectItem>
                      <SelectItem value="b">Option B</SelectItem>
                      <SelectItem value="c">Option C</SelectItem>
                      <SelectItem value="d">Option D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marks">Marks</Label>
                  <Input
                    id="marks"
                    type="number"
                    min="1"
                    max="10"
                    value={currentQuestion.mark}
                    onChange={(e) => setCurrentQuestion({
                      ...currentQuestion,
                      mark: parseInt(e.target.value) || 1
                    })}
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={addQuestion}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!currentQuestion.question_text}
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
                  <p className="text-muted-foreground">{question.question_text}</p>
                  <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2 mt-2">
                    <div>A: {question.option_a}</div>
                    <div>B: {question.option_b}</div>
                    <div>C: {question.option_c}</div>
                    <div>D: {question.option_d}</div>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    Correct: Option {question.correct_option.toUpperCase()} • {question.mark} mark(s)
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
            disabled={!quizTitle || questions.length === 0 || loading}
          >
            {loading ? "Creating Quiz..." : "Create Quiz"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CreateQuiz;
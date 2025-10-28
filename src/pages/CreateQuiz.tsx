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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Plus, X, ChevronLeft, ChevronRight, BookOpen, Settings, FileText, CheckCircle, AlertCircle, Clock, Users, Target, Lightbulb, Upload, Download } from "lucide-react";
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
}

const CreateQuiz = () => {
  const navigate = useNavigate();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Quiz metadata state
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [isTrivia, setIsTrivia] = useState(false);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  
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
    correct_option: 'a'
  });

  // Step validation
  const [stepValidation, setStepValidation] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false
  });

  // Update current question mark when positive mark changes
  useEffect(() => {
    setCurrentQuestion(prev => ({ ...prev, mark: positiveMark }));
  }, [positiveMark]);

  // Validate steps
  useEffect(() => {
    setStepValidation({
      step1: Boolean(quizTitle.trim()),
      step2: true, // Configuration is optional
      step3: questions.length > 0,
      step4: Boolean(quizTitle.trim() && questions.length > 0)
    });
  }, [quizTitle, questions]);

  const getStepProgress = () => {
    return (currentStep / totalSteps) * 100;
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <FileText className="w-5 h-5" />;
      case 2: return <Settings className="w-5 h-5" />;
      case 3: return <BookOpen className="w-5 h-5" />;
      case 4: return <CheckCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Basic Information";
      case 2: return "Configuration";
      case 3: return "Add Questions";
      case 4: return "Review & Create";
      default: return "Step";
    }
  };

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
      correct_option: 'a'
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
        correct_option: q.correct_option
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

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please select a CSV file");
      return;
    }

    setImportLoading(true);
    
    try {
      const result = await quizApi.importQuestions(file);
      
      // Add imported questions to existing questions
      const importedQuestions = result.questions.map((q: any) => ({
        id: `imported_${Date.now()}_${Math.random()}`,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option as 'a' | 'b' | 'c' | 'd'
      }));

      setQuestions(prev => [...prev, ...importedQuestions]);
      toast.success(result.message);
      
      // Clear the file input
      event.target.value = '';
    } catch (error) {
      console.error('Import failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to import questions');
    } finally {
      setImportLoading(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = `question_text,option_a,option_b,option_c,option_d,correct_option
"What is the capital of France?","Paris","London","Berlin","Madrid","a"
"Which planet is closest to the Sun?","Venus","Mercury","Earth","Mars","b"
"What is 2 + 2?","3","4","5","6","b"
"Who wrote Romeo and Juliet?","Charles Dickens","William Shakespeare","Jane Austen","Mark Twain","b"
"Which gas do plants absorb during photosynthesis?","Oxygen","Carbon Dioxide","Nitrogen","Hydrogen","b"`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_questions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Sample CSV downloaded! Make sure to use commas, not tabs, as separators.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl overflow-x-hidden">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            Create a New Quiz
          </h1>
          <p className="text-base sm:text-lg text-gray-700 font-medium">
            Build engaging quizzes with our step-by-step wizard
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8 overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative px-2 sm:px-0">
            {Array.from({ length: totalSteps }, (_, index) => {
              const step = index + 1;
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              const isValid = stepValidation[`step${step}` as keyof typeof stepValidation];
              
              return (
                <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                  <div className={`
                    flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 transition-all duration-300
                    ${isActive 
                      ? 'bg-theme-emerald border-theme-emerald text-white shadow-lg scale-110' 
                      : isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isValid
                          ? 'bg-blue-100 border-blue-300 text-blue-600'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
                    ) : (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6">
                        {getStepIcon(step)}
                      </div>
                    )}
                  </div>
                  <div className="mt-1 sm:mt-2 text-center max-w-[60px] sm:max-w-[100px] lg:max-w-[120px]">
                    <div className={`text-xs sm:text-sm font-medium truncate ${isActive ? 'text-theme-emerald' : isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                      <span className="hidden sm:inline">Step </span>{step}
                    </div>
                    <div className={`text-xs truncate hidden sm:block ${isActive ? 'text-theme-emerald' : 'text-gray-500'}`}>
                      {getStepTitle(step)}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Connector Lines */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-300 z-0" style={{ transform: 'translateY(-50%)' }}>
              <div 
                className="h-full bg-gradient-to-r from-theme-emerald to-green-500 transition-all duration-500 ease-out"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-theme-emerald to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[600px] overflow-hidden">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl transition-all duration-500 ease-in-out w-full">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Basic Information</CardTitle>
                <p className="text-gray-700 font-medium">Let's start with the fundamentals of your quiz</p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid gap-8 w-full">
                  <div className="space-y-3">
                    <Label htmlFor="quiz-title" className="text-base font-semibold text-gray-800">Quiz Title *</Label>
                    <Input
                      id="quiz-title"
                      placeholder="e.g., World Geography Challenge"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="h-12 text-base border-2 focus:border-theme-emerald transition-colors w-full"
                    />
                    <p className="text-sm text-gray-800 font-semibold">Choose a descriptive and engaging title</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="quiz-description" className="text-base font-semibold text-gray-800">Quiz Description</Label>
                    <Textarea
                      id="quiz-description"
                      placeholder="A comprehensive quiz to test your knowledge of world geography, including capitals, landmarks, and cultural insights."
                      value={quizDescription}
                      onChange={(e) => setQuizDescription(e.target.value)}
                      className="min-h-[120px] text-base border-2 focus:border-theme-emerald transition-colors resize-none w-full"
                    />
                    <p className="text-sm text-gray-800 font-semibold">Provide context about what participants can expect</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <Checkbox 
                          id="is-trivia" 
                          checked={isTrivia}
                          onCheckedChange={(checked) => setIsTrivia(checked as boolean)}
                          className="scale-125"
                        />
                        <div>
                          <Label htmlFor="is-trivia" className="text-base font-semibold text-gray-800 cursor-pointer">Make this a trivia quiz</Label>
                          <p className="text-sm text-gray-800 font-semibold">Public quizzes visible to all users</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="duration" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration (minutes)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="180"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                        className="h-12 text-base border-2 focus:border-theme-emerald transition-colors"
                      />
                      <p className="text-sm text-gray-800 font-semibold">Recommended: 1-2 minutes per question</p>
                    </div>
                  </div>

                  {isTrivia && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                      <div className="space-y-3">
                        <Label htmlFor="topic" className="text-base font-semibold text-gray-800">Topic (Optional)</Label>
                        <Input
                          id="topic"
                          placeholder="e.g., Geography, Science, History"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="h-12 text-base border-2 focus:border-theme-emerald transition-colors"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="difficulty" className="text-base font-semibold text-gray-800">Difficulty Level</Label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                          <SelectTrigger className="h-12 border-2 focus:border-theme-emerald">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Easy
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                Medium
                              </div>
                            </SelectItem>
                            <SelectItem value="hard">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Hard
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Configuration */}
          {currentStep === 2 && (
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl transition-all duration-500 ease-in-out w-full">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Quiz Configuration</CardTitle>
                <p className="text-gray-700 font-medium">Customize the behavior and scoring of your quiz</p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Marking System */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900">Marking System</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="positive-mark" className="text-base font-semibold text-gray-800">Positive Marks (per correct answer)</Label>
                      <Input
                        id="positive-mark"
                        type="number"
                        min="1"
                        max="10"
                        value={positiveMark}
                        onChange={(e) => setPositiveMark(parseInt(e.target.value) || 1)}
                        className="h-12 text-base border-2 focus:border-theme-emerald transition-colors"
                      />
                      <p className="text-sm text-gray-600">Points awarded for each correct answer</p>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="negative-mark" className="text-base font-semibold text-gray-800">Negative Marks (per wrong answer)</Label>
                      <Input
                        id="negative-mark"
                        type="number"
                        min="0"
                        max="5"
                        step="1"
                        value={negativeMark}
                        onChange={(e) => setNegativeMark(parseInt(e.target.value) || 0)}
                        className="h-12 text-base border-2 focus:border-theme-emerald transition-colors"
                      />
                      <p className="text-sm text-gray-600">Set to 0 for no negative marking</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Quiz Behavior */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Quiz Behavior</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="navigation-type" className="text-base font-semibold text-gray-800">Navigation Type</Label>
                      <Select value={navigationType} onValueChange={(value: "omni" | "restricted") => setNavigationType(value)}>
                        <SelectTrigger className="h-12 border-2 focus:border-theme-emerald">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="omni">
                            <div className="flex flex-col">
                              <span className="font-medium">Omni Navigation</span>
                              <span className="text-sm text-gray-500">Can navigate freely between questions</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="restricted">
                            <div className="flex flex-col">
                              <span className="font-medium">Restricted Navigation</span>
                              <span className="text-sm text-gray-500">Sequential navigation only</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                      <Checkbox 
                        id="tab-switch-exit" 
                        checked={tabSwitchExit}
                        onCheckedChange={(checked) => setTabSwitchExit(checked as boolean)}
                        className="scale-125"
                      />
                      <div>
                        <Label htmlFor="tab-switch-exit" className="text-base font-semibold text-gray-800 cursor-pointer">Exit quiz if user switches tabs</Label>
                        <p className="text-sm text-gray-600">Prevents cheating by closing quiz on tab switch</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Private Quiz Scheduling */}
                {!isTrivia && (
                  <>
                    <Separator />
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-6 h-6 text-green-600" />
                        <h3 className="text-xl font-bold text-gray-900">Quiz Scheduling</h3>
                        <Badge variant="secondary">Optional</Badge>
                      </div>
                      <p className="text-gray-600 font-medium">Schedule when your quiz becomes available to participants</p>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="start-time" className="text-base font-semibold text-gray-800">Start Time</Label>
                          <Input
                            id="start-time"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="h-12 text-base border-2 focus:border-theme-emerald transition-colors"
                          />
                          <p className="text-sm text-gray-600">
                            Leave blank for immediate availability. End time will be calculated as start time + {duration} minutes
                          </p>
                        </div>
                        {startTime && (
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <h4 className="font-semibold text-gray-800 mb-2">Quiz Schedule Preview</h4>
                            <div className="text-sm space-y-1">
                              <p><strong>Start:</strong> {new Date(startTime).toLocaleString()}</p>
                              <p><strong>End:</strong> {new Date(new Date(startTime).getTime() + duration * 60000).toLocaleString()}</p>
                              <p><strong>Duration:</strong> {duration} minutes</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Add Questions */}
          {currentStep === 3 && (
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl transition-all duration-500 ease-in-out w-full">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Add Questions</CardTitle>
                <p className="text-gray-700 font-medium">Build your quiz with engaging questions</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {questions.length} Questions Added
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Import Questions Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Upload className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Import Questions (Optional)</h3>
                  </div>
                  <p className="text-gray-700 font-medium">
                    Skip manual entry by importing questions from a CSV file. Maximum 50 questions per quiz.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={downloadSampleCSV}
                      variant="outline"
                      className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <Download className="w-4 h-4" />
                      Download Sample CSV
                    </Button>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileImport}
                        disabled={importLoading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <Button
                        disabled={importLoading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="w-4 h-4" />
                        {importLoading ? 'Importing...' : 'Import CSV File'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>CSV Format:</strong> question_text, option_a, option_b, option_c, option_d, correct_option</p>
                    <p><strong>Limits:</strong> Question max 500 chars, Options max 200 chars each</p>
                  </div>
                </div>

                <Separator />

                {/* Question Form */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="question-text" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Question Text *
                    </Label>
                    <Textarea
                      id="question-text"
                      placeholder="What is the capital city of France? (Be clear and specific)"
                      value={currentQuestion.question_text}
                      onChange={(e) => setCurrentQuestion({
                        ...currentQuestion,
                        question_text: e.target.value
                      })}
                      className="min-h-[100px] text-base border-2 focus:border-theme-emerald transition-colors resize-none"
                    />
                    <p className="text-sm text-gray-800 font-semibold">Write a clear, unambiguous question</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['a', 'b', 'c', 'd'] as const).map((option, index) => (
                      <div key={option} className="space-y-3">
                        <Label htmlFor={`option-${option}`} className="text-base font-semibold text-gray-800">
                          Option {option.toUpperCase()}
                        </Label>
                        <Input
                          id={`option-${option}`}
                          placeholder={`Option ${option.toUpperCase()} answer`}
                          value={currentQuestion[`option_${option}`]}
                          onChange={(e) => handleOptionChange(option, e.target.value)}
                          className="h-12 text-base border-2 focus:border-theme-emerald transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold text-gray-800">Correct Answer *</Label>
                      <Select 
                        value={currentQuestion.correct_option} 
                        onValueChange={(value: 'a' | 'b' | 'c' | 'd') => 
                          setCurrentQuestion({...currentQuestion, correct_option: value})
                        }
                      >
                        <SelectTrigger className="h-12 border-2 focus:border-theme-emerald">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(['a', 'b', 'c', 'd'] as const).map((option) => (
                            <SelectItem key={option} value={option}>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                                  {option.toUpperCase()}
                                </div>
                                {currentQuestion[`option_${option}`] || `Option ${option.toUpperCase()}`}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={addQuestion}
                        className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={!currentQuestion.question_text.trim() || !currentQuestion.option_a.trim() || !currentQuestion.option_b.trim() || !currentQuestion.option_c.trim() || !currentQuestion.option_d.trim()}
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Questions List */}
                {questions.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        Questions Added ({questions.length})
                      </h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {questions.map((question, index) => (
                          <div key={question.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-emerald-200 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="bg-gray-50">
                                    Question {index + 1}
                                  </Badge>
                                  <Badge className="bg-emerald-100 text-emerald-700">
                                    +{positiveMark} pts
                                  </Badge>
                                </div>
                                <p className="font-semibold text-gray-800 mb-2 line-clamp-2">{question.question_text}</p>
                                <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                                  {(['a', 'b', 'c', 'd'] as const).map((option) => (
                                    <div key={option} className={`flex items-center gap-1 ${question.correct_option === option ? 'text-emerald-600 font-semibold' : ''}`}>
                                      <span className="font-medium">{option.toUpperCase()}:</span>
                                      <span className="truncate">{question[`option_${option}`]}</span>
                                      {question.correct_option === option && <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0" />}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeQuestion(question.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Create */}
          {currentStep === 4 && (
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl transition-all duration-500 ease-in-out w-full">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Review & Create</CardTitle>
                <p className="text-gray-700 font-medium">Review your quiz details before publishing</p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Quiz Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Quiz Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-600">Title</p>
                          <p className="text-gray-900 font-semibold">{quizTitle || "Untitled Quiz"}</p>
                        </div>
                        {quizDescription && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Description</p>
                            <p className="text-gray-700 text-sm">{quizDescription}</p>
                          </div>
                        )}
                        <div className="flex gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Type</p>
                            <Badge className={isTrivia ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"}>
                              {isTrivia ? "Trivia Quiz" : "Private Quiz"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Duration</p>
                            <Badge variant="outline">{duration} minutes</Badge>
                          </div>
                        </div>
                        {isTrivia && (topic || difficulty) && (
                          <div className="flex gap-4">
                            {topic && (
                              <div>
                                <p className="text-sm font-semibold text-gray-600">Topic</p>
                                <Badge variant="outline">{topic}</Badge>
                              </div>
                            )}
                            {difficulty && (
                              <div>
                                <p className="text-sm font-semibold text-gray-600">Difficulty</p>
                                <Badge className={
                                  difficulty === 'easy' ? "bg-green-100 text-green-700" :
                                  difficulty === 'medium' ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }>
                                  {difficulty}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-600" />
                        Configuration
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-600">Positive Marks</span>
                          <Badge className="bg-green-100 text-green-700">+{positiveMark}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-600">Negative Marks</span>
                          <Badge className={negativeMark > 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}>
                            -{negativeMark}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-600">Navigation</span>
                          <Badge variant="outline">
                            {navigationType === 'omni' ? 'Free Navigation' : 'Sequential'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-600">Tab Switch Exit</span>
                          <Badge className={tabSwitchExit ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}>
                            {tabSwitchExit ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                        {!isTrivia && startTime && (
                          <div>
                            <span className="text-sm font-semibold text-gray-600">Scheduled Start</span>
                            <p className="text-sm text-gray-700">{new Date(startTime).toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-emerald-600" />
                        Questions Overview
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-600">Total Questions</span>
                          <Badge className="bg-emerald-100 text-emerald-700 text-lg px-3 py-1">
                            {questions.length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-600">Total Marks</span>
                          <Badge className="bg-blue-100 text-blue-700 text-lg px-3 py-1">
                            {questions.length * positiveMark}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-600">Est. Time</span>
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            {Math.ceil(questions.length * 1.5)} min
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {questions.length > 0 && (
                      <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Preview</h3>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {questions.slice(0, 3).map((question, index) => (
                            <div key={question.id} className="text-sm">
                              <p className="font-semibold text-gray-800">
                                {index + 1}. {question.question_text.substring(0, 50)}
                                {question.question_text.length > 50 ? '...' : ''}
                              </p>
                              <p className="text-gray-600 text-xs">
                                Correct: {question[`option_${question.correct_option}`].substring(0, 30)}
                                {question[`option_${question.correct_option}`].length > 30 ? '...' : ''}
                              </p>
                            </div>
                          ))}
                          {questions.length > 3 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{questions.length - 3} more questions
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Create Quiz Button */}
                <div className="text-center pt-6">
                  <Button 
                    onClick={handleCreateQuiz}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-bold px-16 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
                    disabled={!quizTitle || questions.length === 0 || loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Creating Quiz...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6 mr-3" />
                        Create Quiz
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-600 mt-3">
                    Your quiz will be {isTrivia ? 'published publicly' : 'saved as private'} and ready to use
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 w-full">
          <Button
            variant="outline"
            size="lg"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-8 py-3 border-2 hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-800 font-bold">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <Button
            size="lg"
            onClick={nextStep}
            disabled={currentStep === totalSteps || !stepValidation[`step${currentStep}` as keyof typeof stepValidation]}
            className="px-8 py-3 bg-theme-emerald hover:bg-theme-emerald-dark"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CreateQuiz;
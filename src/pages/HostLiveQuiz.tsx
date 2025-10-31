import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAuthToken, WS_BASE_URL } from '../lib/api-config';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from '../hooks/use-toast';
import { Copy, Users, Clock, Trophy, Send, Home, X } from 'lucide-react';

interface Player {
  name: string;
  score: number;
  time: number;
  correct: boolean;
  question_score: number;
}

interface QuestionForm {
  question: string;
  options: string[];
  correct_answer: number;
  time_limit: number;
}

const HostLiveQuiz: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const wsRef = useRef<WebSocket | null>(null);
  const token = getAuthToken();
  
  // State management
  const [roomCode, setRoomCode] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [isQuestionActive, setIsQuestionActive] = useState<boolean>(false);
  const [results, setResults] = useState<Player[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Question form state
  const [questionForm, setQuestionForm] = useState<QuestionForm>({
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    time_limit: 30
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!user || !token) {
      navigate('/');
      return;
    }
  }, [user, token, navigate]);

  // WebSocket connection
  const connectWebSocket = () => {
    if (!token) return;

    const wsUrl = `${WS_BASE_URL}/realtime/ws/host/${roomCode || 'new'}?token=${encodeURIComponent(`Bearer ${token}`)}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Host WebSocket connected');
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Successfully connected to the live quiz system",
      });
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('Host WebSocket disconnected');
      setIsConnected(false);
      setRoomCode('');
      toast({
        title: "Disconnected",
        description: "Connection to live quiz system lost",
        variant: "destructive"
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to live quiz system",
        variant: "destructive"
      });
    };

    wsRef.current = ws;
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'room_created':
        setRoomCode(message.room_code);
        toast({
          title: "Room Created!",
          description: `Room code: ${message.room_code}`,
        });
        break;
      
      case 'player_count':
        setPlayerCount(message.count);
        break;
      
      case 'answer_count':
        setAnsweredCount(message.answered);
        break;
      
      case 'heartbeat':
        // Just acknowledge heartbeat, no UI update needed
        console.log('Heartbeat received');
        break;
      
      case 'results':
        setResults(message.top_5);
        setShowResults(true);
        setIsQuestionActive(false);
        setAnsweredCount(0);
        toast({
          title: "Question Complete!",
          description: `${message.correct_answers}/${message.total_answers} answered correctly`,
        });
        break;
      
      case 'error':
        toast({
          title: "Error",
          description: message.message,
          variant: "destructive"
        });
        break;
    }
  };

  // Create room and connect
  const createRoom = () => {
    connectWebSocket();
  };

  // Send question to players
  const sendQuestion = () => {
    if (!wsRef.current || !questionForm.question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive"
      });
      return;
    }

    // Validate options
    const validOptions = questionForm.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: "Error",
        description: "Please provide at least 2 options",
        variant: "destructive"
      });
      return;
    }

    const message = {
      type: 'new_question',
      question: questionForm.question.trim(),
      options: questionForm.options.map(opt => opt.trim()).filter(opt => opt),
      correct_answer: questionForm.correct_answer,
      time_limit: questionForm.time_limit
    };

    wsRef.current.send(JSON.stringify(message));
    setCurrentQuestion(questionForm.question);
    setIsQuestionActive(true);
    setShowResults(false);
    setAnsweredCount(0);
    
    // Clear form
    setQuestionForm({
      question: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      time_limit: 30
    });

    toast({
      title: "Question Sent!",
      description: "Players can now answer the question",
    });
  };

  // Close room
  const closeRoom = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'close_room' }));
      wsRef.current.close();
    }
    navigate('/dashboard');
  };

  // Copy room code
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard",
    });
  };

  // Handle option change
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  if (!user || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-theme-emerald to-theme-emerald/80 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">Q</span>
            </div>
            <span className="text-lg sm:text-2xl font-bold text-theme-navy">Quizzler</span>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1 sm:gap-2 border-theme-emerald text-theme-emerald hover:bg-theme-emerald hover:text-white transition-colors text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2"
            >
              <Home className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Dashboard</span>
            </Button>
            {isConnected && (
              <Button 
                variant="destructive" 
                onClick={closeRoom}
                className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Close Room</span>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 px-3 sm:px-6 py-6 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl font-bold text-theme-navy mb-2 sm:mb-4">Host Live Quiz</h1>
            <p className="text-gray-600 text-base sm:text-lg">Create and manage real-time quiz sessions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Room Status */}
            <div className="lg:col-span-1">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-theme-navy">
                    <Users className="w-5 h-5 text-theme-emerald" />
                    Room Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {!isConnected ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">Create a room to start hosting</p>
                    <Button onClick={createRoom} className="w-full bg-theme-emerald hover:bg-theme-emerald/90 text-white h-10 sm:h-auto text-sm sm:text-base">
                      Create Room
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <Label className="text-sm text-gray-600">Room Code</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-lg sm:text-2xl font-bold text-theme-emerald bg-theme-emerald/10 px-3 sm:px-4 py-2 rounded-lg flex-1 text-center border border-theme-emerald/20">
                          {roomCode}
                        </div>
                        <Button size="sm" variant="outline" onClick={copyRoomCode} className="h-10 w-10 p-0">
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">{playerCount}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Players</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-orange-600">{answeredCount}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Answered</div>
                      </div>
                    </div>

                    {isQuestionActive && (
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-sm font-medium text-yellow-800">Question Active</div>
                        <div className="text-xs text-yellow-600">{currentQuestion}</div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Question Form */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-theme-navy">
                  <Send className="w-5 h-5 text-theme-emerald" />
                  Send Question
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Create and send questions to connected players
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div>
                  <Label htmlFor="question" className="text-sm sm:text-base">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter your question here..."
                    value={questionForm.question}
                    onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                    className="mt-1 text-sm sm:text-base"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm sm:text-base">Answer Options</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {questionForm.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant={questionForm.correct_answer === index ? "default" : "outline"}>
                          {String.fromCharCode(65 + index)}
                        </Badge>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Correct Answer</Label>
                  <RadioGroup 
                    value={questionForm.correct_answer.toString()} 
                    onValueChange={(value) => setQuestionForm({ ...questionForm, correct_answer: parseInt(value) })}
                    className="mt-2"
                  >
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2">
                      {questionForm.options.map((_, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="text-sm">
                            Option {String.fromCharCode(65 + index)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="time-limit" className="flex items-center gap-2 text-sm sm:text-base">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    Time Limit (seconds)
                  </Label>
                  <Input
                    id="time-limit"
                    type="number"
                    min="10"
                    max="120"
                    value={questionForm.time_limit}
                    onChange={(e) => setQuestionForm({ ...questionForm, time_limit: parseInt(e.target.value) || 30 })}
                    className="mt-1 w-24 sm:w-32 text-sm sm:text-base"
                  />
                </div>

                <Button 
                  onClick={sendQuestion} 
                  disabled={!isConnected || isQuestionActive}
                  className="w-full bg-theme-emerald hover:bg-theme-emerald/90 text-white disabled:bg-gray-300 h-10 sm:h-auto text-sm sm:text-base"
                >
                  Send Question to Players
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

          {/* Results */}
          {showResults && results.length > 0 && (
            <Card className="mt-6 border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-theme-navy">
                  <Trophy className="w-5 h-5 text-theme-emerald" />
                  Top 5 Results
                </CardTitle>
              </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.map((player, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0 ? 'bg-yellow-50 border-yellow-200 border-2' :
                      index === 1 ? 'bg-gray-50 border-gray-200 border' :
                      index === 2 ? 'bg-orange-50 border-orange-200 border' :
                      'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-gray-600">
                          {player.time}s • {player.correct ? 'Correct' : 'Incorrect'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{player.score}</div>
                      <div className="text-sm text-gray-600">
                        +{player.question_score} this round
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-theme-navy font-semibold">
              &copy; 2025 Quizzler
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              Made with <span className="text-theme-emerald">❤️</span> for learners worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HostLiveQuiz;
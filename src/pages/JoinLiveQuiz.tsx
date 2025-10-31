import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Progress } from '../components/ui/progress';
import { toast } from '../hooks/use-toast';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Home,
  Gamepad2,
  Timer,
  AlertCircle
} from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  time_limit: number;
  question_start_time: number;
}

const JoinLiveQuiz: React.FC = () => {
  const navigate = useNavigate();
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Connection state
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  
  // Game state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isWaitingForQuestion, setIsWaitingForQuestion] = useState(false);
  
  // Room info
  const [connectedPlayers, setConnectedPlayers] = useState<string[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (currentQuestion && !hasAnswered && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, hasAnswered, timeRemaining]);

  // Connect to room
  const connectToRoom = async () => {
    if (!roomCode.trim() || !username.trim()) {
      toast({
        title: "Error",
        description: "Please enter both room code and username",
        variant: "destructive"
      });
      return;
    }

    // Validate room code format (8 characters alphanumeric)
    if (!/^[A-Z0-9]{8}$/.test(roomCode.toUpperCase())) {
      toast({
        title: "Invalid Room Code",
        description: "Room code should be 8 characters (letters and numbers)",
        variant: "destructive"
      });
      return;
    }

    setConnectionError('');
    
    try {
      // First validate if room exists
      const response = await fetch(`${API_BASE_URL}/realtime/rooms/validate/${roomCode.toUpperCase()}`);
      const validation = await response.json();
      
      if (!validation.valid) {
        setConnectionError("Room doesn't exist or is no longer active");
        return;
      }

      // Connect to WebSocket
      const wsUrl = `${WS_BASE_URL}/realtime/ws/player/${roomCode.toUpperCase()}?username=${encodeURIComponent(username.trim())}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('Player WebSocket connected');
        setIsConnected(true);
        setIsWaitingForQuestion(true);
        toast({
          title: "Connected!",
          description: `Joined room ${roomCode.toUpperCase()} as ${username}`,
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

      ws.onclose = (event) => {
        console.log('Player WebSocket disconnected', event.code, event.reason);
        setIsConnected(false);
        setIsWaitingForQuestion(false);
        
        if (event.code === 1003) {
          setConnectionError(event.reason || "Connection rejected");
        } else {
          toast({
            title: "Disconnected",
            description: event.reason || "Connection lost",
            variant: "destructive"
          });
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError("Failed to connect to room");
      };

      wsRef.current = ws;

    } catch (error) {
      console.error('Error connecting to room:', error);
      setConnectionError("Failed to connect to room");
    }
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'player_joined':
        if (message.username !== username) {
          setConnectedPlayers(prev => [...prev, message.username]);
          toast({
            title: "Player Joined",
            description: `${message.username} joined the room`,
          });
        }
        break;
      
      case 'heartbeat':
        // Just acknowledge heartbeat, no UI update needed
        console.log('Heartbeat received');
        break;
      
      case 'question':
        setCurrentQuestion({
          question: message.question,
          options: message.options,
          time_limit: message.time_limit,
          question_start_time: message.question_start_time
        });
        setSelectedOption(null);
        setHasAnswered(false);
        setShowResult(false);
        setCorrectAnswer(null);
        setIsWaitingForQuestion(false);
        
        // Calculate time remaining
        const elapsed = (Date.now() / 1000) - message.question_start_time;
        const remaining = Math.max(0, message.time_limit - elapsed);
        setTimeRemaining(Math.ceil(remaining));
        
        toast({
          title: "New Question!",
          description: "Answer as quickly as possible for bonus points",
        });
        break;
      
      case 'question_ended':
        setCorrectAnswer(message.correct_answer);
        setShowResult(true);
        setIsWaitingForQuestion(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        break;
      
      case 'room_closed':
        toast({
          title: "Room Closed",
          description: message.reason,
          variant: "destructive"
        });
        disconnect();
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

  // Submit answer
  const submitAnswer = (optionIndex: number) => {
    if (!wsRef.current || hasAnswered || !currentQuestion) return;

    setSelectedOption(optionIndex);
    setHasAnswered(true);

    const message = {
      type: 'answer',
      option: optionIndex
    };

    wsRef.current.send(JSON.stringify(message));
    
    toast({
      title: "Answer Submitted!",
      description: "Wait for other players to answer...",
    });
  };

  // Disconnect from room
  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsConnected(false);
    setCurrentQuestion(null);
    setSelectedOption(null);
    setHasAnswered(false);
    setShowResult(false);
    setIsWaitingForQuestion(false);
    setConnectedPlayers([]);
  };

  // Get option result styling
  const getOptionStyle = (index: number) => {
    if (!showResult) {
      if (selectedOption === index && hasAnswered) {
        return 'bg-blue-100 border-blue-300 text-blue-800';
      }
      return 'bg-white border-gray-200 hover:bg-gray-50';
    }

    // Show results
    if (correctAnswer === index) {
      return 'bg-green-100 border-green-300 text-green-800';
    }
    if (selectedOption === index && correctAnswer !== index) {
      return 'bg-red-100 border-red-300 text-red-800';
    }
    return 'bg-gray-100 border-gray-200 text-gray-600';
  };

  // Get option icon
  const getOptionIcon = (index: number) => {
    if (!showResult) return null;
    
    if (correctAnswer === index) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (selectedOption === index && correctAnswer !== index) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="w-full px-3 sm:px-6 py-3 sm:py-4 bg-white border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-theme-emerald rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">Q</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-theme-navy">Quizzler</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-1 sm:gap-2 border-gray-300 hover:bg-gray-50 text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2"
          >
            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Home</span>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Join Live Quiz
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Enter a room code to join a live quiz session and compete with other players in real-time
            </p>
          </div>

          {!isConnected ? (
            /* Connection Form */
            <Card className="max-w-md mx-auto shadow-xl border border-gray-200 mx-3 sm:mx-auto">
              <CardHeader className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-theme-emerald/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-theme-emerald" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                  Join Room
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  Enter the room code provided by your host
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div>
                  <Label htmlFor="room-code" className="text-gray-700 font-medium text-sm sm:text-base">Room Code</Label>
                  <Input
                    id="room-code"
                    placeholder="Enter 8-character room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    maxLength={8}
                    className="mt-2 text-center text-base sm:text-lg font-mono border-gray-300 focus:border-theme-emerald focus:ring-theme-emerald h-10 sm:h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="username" className="text-gray-700 font-medium text-sm sm:text-base">Your Name</Label>
                  <Input
                    id="username"
                    placeholder="Enter your display name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    className="mt-2 border-gray-300 focus:border-theme-emerald focus:ring-theme-emerald h-10 sm:h-12 text-sm sm:text-base"
                  />
                </div>

                {connectionError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-700">{connectionError}</span>
                  </div>
                )}

                <Button 
                  onClick={connectToRoom} 
                  className="w-full bg-theme-emerald hover:bg-theme-emerald/90 text-white py-2 sm:py-3 text-base sm:text-lg font-medium h-10 sm:h-12"
                  disabled={!roomCode.trim() || !username.trim()}
                >
                  Join Room
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Game Interface */
            <div className="space-y-4 sm:space-y-6">
              {/* Room Status */}
              <Card className="shadow-lg border border-gray-200">
                <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-6 justify-center sm:justify-start">
                      <div className="text-center">
                        <div className="text-xs sm:text-sm text-gray-600 font-medium">Room</div>
                        <div className="text-lg sm:text-xl font-bold text-theme-emerald">{roomCode}</div>
                      </div>
                      <Separator orientation="vertical" className="h-6 sm:h-8" />
                      <div className="text-center">
                        <div className="text-xs sm:text-sm text-gray-600 font-medium">Player</div>
                        <div className="text-lg sm:text-xl font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{username}</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={disconnect}
                      className="border-gray-300 hover:bg-gray-50 text-sm sm:text-base w-full sm:w-auto"
                    >
                      Leave Room
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Waiting State */}
              {isWaitingForQuestion && !currentQuestion && (
                <Card className="shadow-lg border border-gray-200">
                  <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8 text-center p-4 sm:p-6">
                    <div className="animate-pulse">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-theme-emerald/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-theme-emerald" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                        Waiting for next question...
                      </h3>
                      <p className="text-gray-600 text-base sm:text-lg">
                        The host will send a question shortly
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Question */}
              {currentQuestion && (
                <Card className="shadow-lg border border-gray-200">
                  <CardHeader className="bg-gray-50 border-b border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                      <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900">Question</CardTitle>
                      <div className="flex items-center gap-2 bg-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-gray-200 self-center sm:self-auto">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className={`font-bold text-base sm:text-lg ${timeRemaining <= 5 ? 'text-red-500' : 'text-theme-emerald'}`}>
                          {timeRemaining}s
                        </span>
                      </div>
                    </div>
                    {timeRemaining > 0 && (
                      <Progress 
                        value={(timeRemaining / currentQuestion.time_limit) * 100} 
                        className="w-full h-2 sm:h-3 mt-3 sm:mt-4"
                      />
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 p-4 sm:p-6">
                    <div className="text-base sm:text-xl font-medium text-gray-900 p-4 sm:p-6 bg-theme-emerald/5 rounded-lg border border-theme-emerald/20">
                      {currentQuestion.question}
                    </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => submitAnswer(index)}
                        disabled={hasAnswered || timeRemaining === 0}
                        className={`p-3 sm:p-4 border-2 rounded-lg text-left transition-all duration-200 flex items-center justify-between min-h-[50px] sm:min-h-[auto] ${getOptionStyle(index)} ${
                          hasAnswered || timeRemaining === 0 ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1">
                          <Badge variant="outline" className="text-xs sm:text-sm shrink-0">
                            {String.fromCharCode(65 + index)}
                          </Badge>
                          <span className="text-sm sm:text-base break-words">{option}</span>
                        </div>
                        <div className="shrink-0">
                          {getOptionIcon(index)}
                        </div>
                      </button>
                    ))}
                  </div>

                  {hasAnswered && !showResult && (
                    <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                      <div className="text-blue-800 font-medium text-sm sm:text-base">Answer submitted!</div>
                      <div className="text-blue-600 text-xs sm:text-sm">Waiting for other players...</div>
                    </div>
                  )}

                  {showResult && (
                    <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {correctAnswer === selectedOption ? (
                          <>
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                            <span className="text-green-800 font-medium text-sm sm:text-base">Correct!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                            <span className="text-red-800 font-medium text-sm sm:text-base">Incorrect</span>
                          </>
                        )}
                      </div>
                      <div className="text-gray-600 text-xs sm:text-sm">
                        The correct answer was: {String.fromCharCode(65 + (correctAnswer || 0))}
                      </div>
                    </div>
                  )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 sm:py-8 px-3 sm:px-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="text-center sm:text-left">
            <p className="text-theme-navy font-semibold text-sm sm:text-base">
              &copy; 2025 Quizzler
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2 justify-center">
              Made with <span className="text-theme-emerald">❤️</span> for learners worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JoinLiveQuiz;

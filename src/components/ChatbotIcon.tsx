import { useState } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from "@/lib/api-config";

interface ChatbotIconProps {
  onQuizCreated?: (quizId: string, quizTitle: string) => void;
}

const ChatbotIcon = ({ onQuizCreated }: ChatbotIconProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your quiz");
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("Please sign in to use the chatbot");
        return;
      }

      const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.CHATBOT.GENERATE}`;
      console.log('🤖 Chatbot API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ prompt: prompt.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate quiz');
      }

      const result = await response.json();
      
      if (result.success && result.is_quiz_request) {
        // Quiz created successfully
        toast.success(result.message, {
          duration: 5000,
        });
        
        // Call parent callback if provided
        if (onQuizCreated) {
          onQuizCreated(result.quiz_id, result.quiz_title);
        }
        
        // Reset and close
        setPrompt("");
        setIsOpen(false);
      } else if (!result.is_quiz_request) {
        // Not a quiz creation request - show bot's response but don't close modal
        toast.info(result.message, {
          duration: 6000,
        });
        // Don't reset prompt or close modal - let user try again
      } else {
        throw new Error(result.message || "Failed to create quiz");
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300 mx-2 bg-white rounded-2xl shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-br from-theme-emerald/10 to-blue-50 relative p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-theme-emerald/10 rounded-2xl flex items-center justify-center shadow-lg border border-theme-emerald/20">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-theme-emerald" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Quiz AI Assistant</h2>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">Create quizzes with natural language</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0 rounded-full flex-shrink-0 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {/* Floating elements like homepage */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-theme-emerald/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-blue-200/30 rounded-full blur-xl"></div>
            </div>
            
            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Simplified Instructions */}
              <div className="bg-gradient-to-br from-theme-emerald/5 to-blue-50 p-3 sm:p-4 rounded-xl border border-theme-emerald/20 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Wand2 className="w-4 h-4 text-theme-emerald" />
                  How it works
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 font-medium mb-2 sm:mb-3">
                  Simply describe the quiz you want in plain English! I'll generate questions automatically.
                </p>
                <div className="text-xs text-gray-600">
                  <strong className="text-gray-800">Examples:</strong>
                  <div className="mt-1 space-y-1">
                    <div>• "Quiz on cars, 10 questions, 20 minutes"</div>
                    <div className="hidden sm:block">• "Python programming quiz, 15 questions, 45 minutes"</div>
                    <div className="hidden sm:block">• "History quiz about World War 2, 12 questions"</div>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-800 mb-2 block">
                    Describe your quiz:
                  </label>
                  <Textarea
                    placeholder="Example: Create a quiz on JavaScript basics with 10 questions, duration 30 minutes..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="min-h-[100px] sm:min-h-[120px] resize-none border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 rounded-lg focus:border-theme-emerald focus:ring-theme-emerald/20 focus:bg-white transition-all duration-200 text-sm"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-600 font-medium mt-1">
                    <span className="hidden sm:inline">Press Ctrl+Enter to generate • </span>Be specific about topic, questions, timing
                  </p>
                </div>

                {/* Simplified Features - Only show on larger screens */}
                <div className="hidden sm:grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Badge variant="outline" className="text-xs bg-theme-emerald/10 text-theme-emerald border-theme-emerald/20">Features</Badge>
                    <div className="text-gray-600 font-medium space-y-0.5">
                      <div>• Any topic</div>
                      <div>• 1-20 questions</div>
                      <div>• Custom duration</div>
                    </div>
                  </div>
                  <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Timing</Badge>
                    <div className="text-gray-600 font-medium space-y-0.5">
                      <div>• "10 minutes from now"</div>
                      <div>• "in 1 hour"</div>
                      <div>• "tomorrow at 2 PM"</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !prompt.trim()}
                    className="flex-1 bg-theme-emerald hover:bg-theme-emerald-dark text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-12 rounded-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span className="hidden sm:inline">Generating Quiz...</span>
                        <span className="sm:hidden">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Generate Quiz
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                    className="px-6 h-12 rounded-lg border-gray-300 hover:bg-gray-50 font-medium transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbot Icon */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-2xl bg-theme-emerald hover:bg-theme-emerald-dark text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border border-theme-emerald/20"
          title="Open Quiz AI Assistant"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
          </div>
        </Button>
        
        {/* Tooltip with matching theme */}
        <div className="absolute bottom-16 right-0 bg-white text-gray-900 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-xl border border-gray-200 font-medium">
          Create quiz with AI
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>
        
        {/* Floating background elements */}
        <div className="absolute inset-0 rounded-2xl bg-theme-emerald/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      </div>
    </>
  );
};

export default ChatbotIcon;

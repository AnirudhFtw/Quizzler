import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/hooks/ProtectedRoute";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from "./pages/CreateQuiz";
import FindQuiz from "./pages/FindQuiz";
import MyQuizzes from "./pages/MyQuizzes";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import TakeQuiz from "./pages/TakeQuiz";
import QuizResults from "./pages/QuizResults";
import QuizResultsManagement from "./pages/QuizResultsManagement";
import HostLiveQuiz from "./pages/HostLiveQuiz";
import JoinLiveQuiz from "./pages/JoinLiveQuiz";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/create-quiz" element={
              <ProtectedRoute>
                <CreateQuiz />
              </ProtectedRoute>
            } />
            <Route path="/find-quiz" element={
              <ProtectedRoute>
                <FindQuiz />
              </ProtectedRoute>
            } />
            <Route path="/my-quizzes" element={
              <ProtectedRoute>
                <MyQuizzes />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/take-quiz/:quizId" element={
              <ProtectedRoute>
                <TakeQuiz />
              </ProtectedRoute>
            } />
            <Route path="/quiz-results/:quizId" element={
              <ProtectedRoute>
                <QuizResults />
              </ProtectedRoute>
            } />
            <Route path="/quiz-results-management/:quizId" element={
              <ProtectedRoute>
                <QuizResultsManagement />
              </ProtectedRoute>
            } />
            <Route path="/host-live-quiz" element={
              <ProtectedRoute>
                <HostLiveQuiz />
              </ProtectedRoute>
            } />
            <Route path="/join-live-quiz" element={<JoinLiveQuiz />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

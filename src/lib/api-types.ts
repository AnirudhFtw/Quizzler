/**
 * API Types
 * TypeScript types for API requests and responses
 */

// Auth Types
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    email_confirmed?: boolean;
  };
  access_token?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

// Quiz Types
export interface QuestionCreate {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'a' | 'b' | 'c' | 'd';
}

export interface QuizCreate {
  title: string;
  description: string;
  is_trivia?: boolean;
  topic?: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  positive_mark?: number;
  negative_mark?: number; // Can be float for fractional negative marking
  navigation_type?: string;
  tab_switch_exit?: boolean;
  difficulty?: string;
  questions: QuestionCreate[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  is_trivia: boolean;
  topic?: string;
  start_time?: string;
  end_time?: string;
  duration: number;
  positive_mark: number;
  negative_mark: number;
  navigation_type: string;
  tab_switch_exit: boolean;
  difficulty?: string;
  popularity: number;
  is_active: boolean;
  created_at: string;
  question_count?: number;
  status?: 'assigned' | 'active' | 'ended';
}

export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export interface QuestionWithAnswer extends Question {
  correct_option: 'a' | 'b' | 'c' | 'd';
}

// Session Types
export interface StartQuizResponse {
  session_id: string;
  started_at: string;
  quiz: {
    id: string;
    title: string;
    description: string;
    duration: number;
    positive_mark: number;
    negative_mark: number;
    navigation_type: string;
    tab_switch_exit: boolean;
  };
  questions: Question[];
  total_questions: number;
}

export interface SubmitAnswersRequest {
  answers: Record<string, string>; // question_id -> selected_option
}

export interface SubmitQuizResponse {
  score: number;
  total_questions: number;
  submitted_at: string;
  time_taken_minutes: number;
}

// Results Types
export interface QuizResult {
  quiz_title: string;
  score: number;
  answers: Record<string, string>;
  correct_answers: Record<string, string>;
  questions: Record<string, {
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
  }>;
  submitted_at: string;
}

export interface QuizResultsResponse {
  quiz: {
    id: string;
    title: string;
    description: string;
  };
  results: Array<{
    quiz_name: string;
    date: string;
    student_name: string;
    email: string;
    score: number;
  }>;
  total_participants: number;
}

export interface LeaderboardEntry {
  user_name: string;
  email: string;
  score: number;
  submitted_at: string;
}

export interface GlobalLeaderboardEntry {
  user_id: string;
  user_name: string;
  email: string;
  total_rating: number;
  quiz_count: number;
  best_quiz: string;
  best_score: number;
  average_rating: number;
}

export interface LeaderboardResponse {
  quiz?: {
    id: string;
    title: string;
    is_trivia: boolean;
  };
  leaderboard: LeaderboardEntry[] | GlobalLeaderboardEntry[];
  total_participants?: number;
  total_entries?: number;
}

export interface UserStats {
  total_quizzes_attempted: number;
  total_score: number;
  trivia_stats: {
    quizzes_attempted: number;
    total_score: number;
    average_score: number;
    best_score: number;
    topics_attempted: string[];
  };
  private_stats: {
    quizzes_attempted: number;
    total_score: number;
    average_score: number;
    best_score: number;
  };
  has_perfect_score: boolean;
}



// API Error Type
export interface ApiError {
  detail: string;
  status_code?: number;
}

// Topics Response
export interface TopicsResponse {
  topics: string[];
}

// User Profile Types
export interface UpdateProfileRequest {
  name?: string;
}

export interface UserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    created_at?: string;
  };
  quiz_history: Array<{
    quiz_id: string;
    quiz_title: string;
    topic?: string;
    is_trivia: boolean;
    difficulty?: string;
    score: number;
    submitted_at: string;
  }>;
  total_quizzes_attempted: number;
  attempted_topics: string[];
  recommendations: Array<{
    id: string;
    title: string;
    topic?: string;
    difficulty?: string;
    popularity: number;
  }>;
  trivia_ranking?: {
    rank: number;
    total_users: number;
    average_rating: number;
  };
}

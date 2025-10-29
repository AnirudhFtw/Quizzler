/**
 * API Configuration
 * Handles environment-based backend URL selection and API client setup
 */

// Get environment variables
const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development';
const API_BASE_URL_DEV = import.meta.env.VITE_API_BASE_URL_DEV || 'http://localhost:8000';
const API_BASE_URL_PROD = import.meta.env.VITE_API_BASE_URL_PROD || 'https://your-production-backend-url.com';

// Direct override if provided
const DIRECT_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Determine the base URL based on environment
export const API_BASE_URL = DIRECT_BASE_URL || (NODE_ENV === 'production' ? API_BASE_URL_PROD : API_BASE_URL_DEV);

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    SIGNOUT: '/auth/signout',
    ME: '/auth/me',
    VERIFY_TOKEN: '/auth/verify-token'
  },
  
  // Quizzes
  QUIZZES: {
    CREATE: '/quizzes',
    GET_MY_QUIZZES: '/quizzes',
    GET_TRIVIA: '/quizzes/trivia',
    GET_QUIZ: (quizId: string) => `/quizzes/${quizId}`,
    GET_TOPICS: '/quizzes/topics/list'
  },
  
  // Quiz Sessions
  SESSIONS: {
    START_QUIZ: (quizId: string) => `/quizzes/${quizId}/start`,
    SUBMIT_QUIZ: (quizId: string) => `/quizzes/${quizId}/submit`
  },
  
  // Users
  USERS: {
    GET_PROFILE: '/users/me',
    UPDATE_PROFILE: '/users/me',
    LEADERBOARD_POSITION: '/users/leaderboard-position'
  },
  
  // Results
  RESULTS: {
    MY_RESULT: (quizId: string) => `/results/${quizId}/my-result`,
    QUIZ_RESULTS: (quizId: string) => `/results/${quizId}/results`,
    GLOBAL_LEADERBOARD: '/results/leaderboards/global',
    QUIZ_LEADERBOARD: (quizId: string) => `/results/leaderboards/quiz/${quizId}`,
    USER_STATS: '/results/stats/user'
  }
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('access_token');
};

// Get headers with auth token
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    ...DEFAULT_HEADERS,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

console.log('API Configuration:', {
  NODE_ENV,
  API_BASE_URL,
  isAuthenticated: isAuthenticated()
});

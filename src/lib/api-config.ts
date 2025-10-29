/**
 * API Configuration
 * Handles environment-based backend URL selection and API client setup
 */

// Get environment variables with multiple fallbacks
const NODE_ENV = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development';
const API_BASE_URL_DEV = import.meta.env.VITE_API_BASE_URL_DEV || 'http://localhost:8000';
const API_BASE_URL_PROD = import.meta.env.VITE_API_BASE_URL_PROD || 'https://quizzler-backend.adityatorgal.me';
const WS_BASE_URL_DEV = import.meta.env.VITE_WS_BASE_URL_DEV || 'ws://localhost:8000';
const WS_BASE_URL_PROD = import.meta.env.VITE_WS_BASE_URL_PROD || 'wss://quizzler-backend.adityatorgal.me';

// Direct override if provided
const DIRECT_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Detect production environment with multiple checks
const isProductionDomain = typeof window !== 'undefined' && 
  (window.location.hostname === 'quizzler.adityatorgal.me' || 
   window.location.hostname.includes('quizzler.adityatorgal.me'));

const isProductionBuild = import.meta.env.PROD || NODE_ENV === 'production';
const isProduction = isProductionDomain || isProductionBuild;

// FORCE HTTPS for production - NO HTTP ALLOWED
export const API_BASE_URL = (() => {
  let url;
  if (DIRECT_BASE_URL) {
    url = DIRECT_BASE_URL;
  } else if (isProduction) {
    url = 'https://quizzler-backend.adityatorgal.me';
  } else {
    url = API_BASE_URL_DEV;
  }
  
  // SAFETY CHECK: Force HTTPS in production, never allow HTTP
  if (isProduction && url.startsWith('http://')) {
    console.warn('🚨 Forcing HTTP to HTTPS in production!');
    url = url.replace('http://', 'https://');
  }
  
  // Remove trailing slash to avoid redirect issues
  url = url.replace(/\/$/, '');
  
  // DEBUGGING: Log the final API base URL
  console.log('🔧 API Configuration:', {
    isProduction,
    DIRECT_BASE_URL,
    API_BASE_URL_DEV,
    API_BASE_URL_PROD,
    finalUrl: url,
    hostname: window?.location?.hostname,
    protocol: window?.location?.protocol
  });
  
  return url;
})();

// WebSocket URL with same logic
export const WS_BASE_URL = (() => {
  if (isProduction) return 'wss://quizzler-backend.adityatorgal.me';
  return WS_BASE_URL_DEV;
})();

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
    CREATE: '/quizzes/',
    GET_MY_QUIZZES: '/quizzes/',
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

console.log('🔧 API Configuration Debug:', {
  NODE_ENV,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV,
  DIRECT_BASE_URL,
  API_BASE_URL_PROD,
  API_BASE_URL_DEV,
  isProductionDomain,
  isProductionBuild,
  isProduction,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  FINAL_API_BASE_URL: API_BASE_URL,
  FINAL_WS_BASE_URL: WS_BASE_URL,
  isAuthenticated: isAuthenticated()
});

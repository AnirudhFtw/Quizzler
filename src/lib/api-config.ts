const NODE_ENV = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development';
const API_BASE_URL_DEV = import.meta.env.VITE_API_BASE_URL_DEV || 'http://localhost:8000';
const API_BASE_URL_PROD = import.meta.env.VITE_API_BASE_URL_PROD || 'https://quizzler-backend.adityatorgal.me';
const WS_BASE_URL_DEV = import.meta.env.VITE_WS_BASE_URL_DEV || 'ws://localhost:8000';
const WS_BASE_URL_PROD = import.meta.env.VITE_WS_BASE_URL_PROD || 'wss://quizzler-backend.adityatorgal.me';

const DIRECT_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const isProduction = (() => {
  if (NODE_ENV === 'production') return true;
  if (NODE_ENV === 'development') return false;
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'quizzler.adityatorgal.me' || hostname.includes('quizzler.adityatorgal.me')) {
      return true;
    }
  }
  
  return import.meta.env.PROD;
})();

export const API_BASE_URL = (() => {
  let url;
  
  if (DIRECT_BASE_URL) {
    url = DIRECT_BASE_URL;
  }
  else if (isProduction) {
    url = API_BASE_URL_PROD;
  } else {
    url = API_BASE_URL_DEV;
  }
  
  if (isProduction && url.startsWith('http://')) {
    console.warn('🚨 Forcing HTTP to HTTPS in production!');
    url = url.replace('http://', 'https://');
  }
  
  url = url.replace(/\/$/, '');
  

  
  return url;
})();

export const WS_BASE_URL = (() => {
  if (isProduction) return 'wss://quizzler-backend.adityatorgal.me';
  return WS_BASE_URL_DEV;
})();

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    SIGNOUT: '/auth/signout',
    ME: '/auth/me',
    VERIFY_TOKEN: '/auth/verify-token'
  },
  
  QUIZZES: {
    CREATE: '/quizzes/',
    GET_MY_QUIZZES: '/quizzes/',
    GET_TRIVIA: '/quizzes/trivia',
    GET_QUIZ: (quizId: string) => `/quizzes/${quizId}`,
    GET_TOPICS: '/quizzes/topics/list'
  },
  
  SESSIONS: {
    START_QUIZ: (quizId: string) => `/quizzes/${quizId}/start`,
    SUBMIT_QUIZ: (quizId: string) => `/quizzes/${quizId}/submit`
  },
  
  USERS: {
    GET_PROFILE: '/users/me',
    UPDATE_PROFILE: '/users/me',
    LEADERBOARD_POSITION: '/users/leaderboard-position'
  },
  
  RESULTS: {
    MY_RESULT: (quizId: string) => `/results/${quizId}/my-result`,
    QUIZ_RESULTS: (quizId: string) => `/results/${quizId}/results`,
    GLOBAL_LEADERBOARD: '/results/leaderboards/global',
    QUIZ_LEADERBOARD: (quizId: string) => `/results/leaderboards/quiz/${quizId}`,
    USER_STATS: '/results/stats/user'
  },
  
  CHATBOT: {
    GREETING: '/chatbot/',
    GENERATE: '/chatbot/generate'
  }
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('access_token');
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    ...DEFAULT_HEADERS,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};



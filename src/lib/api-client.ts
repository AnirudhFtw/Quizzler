/**
 * API Client
 * Centralized API service for communicating with the backend
 */

import { 
  API_BASE_URL, 
  API_ENDPOINTS, 
  getAuthHeaders, 
  setAuthToken, 
  removeAuthToken 
} from './api-config';

import type {
  SignUpRequest,
  SignInRequest,
  AuthResponse,
  User,
  QuizCreate,
  Quiz,
  StartQuizResponse,
  SubmitAnswersRequest,
  SubmitQuizResponse,
  QuizResult,
  QuizResultsResponse,
  LeaderboardResponse,
  UserStats,
  UpdateProfileRequest,
  UserProfile,
  TopicsResponse,
  ApiError
} from './api-types';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private parseValidationErrors(errorData: any): string {
    // Handle Pydantic validation errors
    if (errorData.detail && Array.isArray(errorData.detail)) {
      const errors = errorData.detail.map((error: any) => {
        const field = error.loc ? error.loc.slice(-1)[0] : 'field';
        const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        
        switch (error.type) {
          case 'int_from_float':
            return `${fieldName} must be a whole number (no decimal places)`;
          case 'value_error':
            return `${fieldName}: ${error.msg}`;
          case 'missing':
            return `${fieldName} is required`;
          case 'string_too_short':
            return `${fieldName} is too short`;
          case 'string_too_long':
            return `${fieldName} is too long`;
          case 'type_error':
            return `${fieldName} has an invalid format`;
          default:
            return `${fieldName}: ${error.msg || 'Invalid value'}`;
        }
      });
      return errors.join(', ');
    }
    
    // Handle simple string errors with common patterns
    if (typeof errorData.detail === 'string') {
      const detail = errorData.detail.toLowerCase();
      
      // Common authentication errors
      if (detail.includes('invalid credentials') || detail.includes('invalid email or password')) {
        return 'Invalid email or password. Please check your credentials and try again.';
      }
      if (detail.includes('email already registered') || detail.includes('already registered')) {
        return 'An account with this email already exists. Please try signing in instead.';
      }
      if (detail.includes('user not found')) {
        return 'No account found with this email address.';
      }
      if (detail.includes('start time must be in the future')) {
        return 'Quiz start time must be scheduled for a future date and time.';
      }
      if (detail.includes('only admins can create trivia quizzes')) {
        return 'Only administrators can create trivia quizzes. Please create a regular quiz instead.';
      }
      
      // Return original message with first letter capitalized
      return errorData.detail.charAt(0).toUpperCase() + errorData.detail.slice(1);
    }
    
    // Fallback
    return 'An error occurred while processing your request';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        detail: `HTTP error! status: ${response.status}`,
        status_code: response.status
      }));
      
      const userFriendlyMessage = this.parseValidationErrors(errorData);
      throw new Error(userFriendlyMessage);
    }
    return response.json();
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      credentials: 'include',
      mode: 'cors',
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API request failed:', { url, error });
      throw error;
    }
  }

  // Authentication methods
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Don't set auth token after signup - user needs to verify email first
    // The token will be set after successful signin following email verification
    
    return response;
  }

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(API_ENDPOINTS.AUTH.SIGNIN, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.access_token) {
      setAuthToken(response.access_token);
    }
    
    return response;
  }

  async signOut(): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>(API_ENDPOINTS.AUTH.SIGNOUT, {
      method: 'POST',
    });
    
    removeAuthToken();
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>(API_ENDPOINTS.AUTH.ME);
  }

  async verifyToken(): Promise<{ valid: boolean; user: User }> {
    return this.request<{ valid: boolean; user: User }>(API_ENDPOINTS.AUTH.VERIFY_TOKEN);
  }

  // Quiz methods
  async createQuiz(data: QuizCreate): Promise<{ quiz_id: string; title: string }> {
    return this.request<{ quiz_id: string; title: string }>(API_ENDPOINTS.QUIZZES.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyQuizzes(): Promise<Quiz[]> {
    return this.request<Quiz[]>(API_ENDPOINTS.QUIZZES.GET_MY_QUIZZES);
  }

  async getTriviaQuizzes(params?: {
    topic?: string;
    difficulty?: string;
    sort_by?: 'popularity' | 'difficulty' | 'recent';
  }): Promise<Quiz[]> {
    const searchParams = new URLSearchParams();
    if (params?.topic) searchParams.set('topic', params.topic);
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
    
    const endpoint = `${API_ENDPOINTS.QUIZZES.GET_TRIVIA}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<Quiz[]>(endpoint);
  }

  async getQuizDetails(quizId: string): Promise<Quiz> {
    return this.request<Quiz>(API_ENDPOINTS.QUIZZES.GET_QUIZ(quizId));
  }

  async getAvailableTopics(): Promise<TopicsResponse> {
    return this.request<TopicsResponse>(API_ENDPOINTS.QUIZZES.GET_TOPICS);
  }

  // Quiz session methods
  async startQuiz(quizId: string): Promise<StartQuizResponse> {
    return this.request<StartQuizResponse>(API_ENDPOINTS.SESSIONS.START_QUIZ(quizId), {
      method: 'POST',
    });
  }

  async submitQuiz(quizId: string, data: SubmitAnswersRequest): Promise<SubmitQuizResponse> {
    return this.request<SubmitQuizResponse>(API_ENDPOINTS.SESSIONS.SUBMIT_QUIZ(quizId), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Results methods
  async getMyResult(quizId: string): Promise<QuizResult> {
    return this.request<QuizResult>(API_ENDPOINTS.RESULTS.MY_RESULT(quizId));
  }

  async getQuizResults(quizId: string): Promise<QuizResultsResponse> {
    return this.request<QuizResultsResponse>(API_ENDPOINTS.RESULTS.QUIZ_RESULTS(quizId));
  }

  async getGlobalLeaderboard(limit?: number): Promise<LeaderboardResponse> {
    const endpoint = `${API_ENDPOINTS.RESULTS.GLOBAL_LEADERBOARD}${limit ? `?limit=${limit}` : ''}`;
    return this.request<LeaderboardResponse>(endpoint);
  }



  async getUserProfile(): Promise<UserProfile> {
    return this.request<UserProfile>(API_ENDPOINTS.USERS.GET_PROFILE);
  }

  async updateUserProfile(data: UpdateProfileRequest): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(API_ENDPOINTS.USERS.UPDATE_PROFILE, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getUserStats(): Promise<UserStats> {
    return this.request<UserStats>(API_ENDPOINTS.RESULTS.USER_STATS);
  }

  // Import questions from CSV
  async importQuestions(file: File): Promise<{ message: string; questions: any[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseUrl}/quizzes/import-questions`;
    const config: RequestInit = {
      method: 'POST',
      body: formData,
      credentials: 'include',
      mode: 'cors',
      headers: {
        ...getAuthHeaders(),
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
    };

    // Remove Content-Type from headers for FormData
    if (config.headers && 'Content-Type' in config.headers) {
      delete (config.headers as any)['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      return this.handleResponse<{ message: string; questions: any[] }>(response);
    } catch (error) {
      console.error('Import questions failed:', { url, error });
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const authApi = {
  signUp: (data: SignUpRequest) => apiClient.signUp(data),
  signIn: (data: SignInRequest) => apiClient.signIn(data),
  signOut: () => apiClient.signOut(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  verifyToken: () => apiClient.verifyToken(),
};

export const quizApi = {
  create: (data: QuizCreate) => apiClient.createQuiz(data),
  getMyQuizzes: () => apiClient.getMyQuizzes(),
  getTriviaQuizzes: (params?: Parameters<typeof apiClient.getTriviaQuizzes>[0]) => 
    apiClient.getTriviaQuizzes(params),
  getDetails: (quizId: string) => apiClient.getQuizDetails(quizId),
  getTopics: () => apiClient.getAvailableTopics(),
  importQuestions: (file: File) => apiClient.importQuestions(file),
};

export const sessionApi = {
  start: (quizId: string) => apiClient.startQuiz(quizId),
  submit: (quizId: string, data: SubmitAnswersRequest) => apiClient.submitQuiz(quizId, data),
};

export const userApi = {
  getProfile: () => apiClient.getUserProfile(),
  updateProfile: (data: UpdateProfileRequest) => apiClient.updateUserProfile(data),
};

export const resultsApi = {
  getMyResult: (quizId: string) => apiClient.getMyResult(quizId),
  getQuizResults: (quizId: string) => apiClient.getQuizResults(quizId),
  getGlobalLeaderboard: (limit?: number) => apiClient.getGlobalLeaderboard(limit),
  getUserStats: () => apiClient.getUserStats(),
};

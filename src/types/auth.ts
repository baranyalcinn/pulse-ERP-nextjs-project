export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface User {
  username: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
} 
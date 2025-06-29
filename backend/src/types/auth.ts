export interface LoginRequest {
  email: string;
  password: string;
  type: 'admin' | 'employee';
}

export interface TokenPayload {
  id: number;
  email: string;
  role: 'admin' | 'employee';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'employee';
  };
} 
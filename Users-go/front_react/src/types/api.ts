// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
  timestamp?: string;
  path?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  dateOfBirth?: string;
  bio?: string;
}

// Token Types
export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

// Auth Request Types
export interface UserRegistrationRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  acceptTerms: boolean;
}

export interface UserLoginRequest {
  email?: string;
  username?: string;
  password: string;
  rememberMe?: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  bio?: string;
}

// Auth Response Types
export interface UserRegistrationResponse {
  userId: string;
  username: string;
  email: string;
  status: 'pending_verification' | 'active' | 'disabled';
  createdAt: string;
}

export interface UserLoginResponse {
  user: User;
  token: TokenInfo;
}

export interface RefreshTokenResponse {
  token: TokenInfo;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: User;
} 
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  UserRegistrationRequest,
  UserLoginRequest,
  RefreshTokenRequest,
  EmailVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserRegistrationResponse,
  UserLoginResponse,
  RefreshTokenResponse,
  LogoutResponse,
  EmailVerificationResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ChangePasswordResponse,
  UserProfileResponse,
  ApiResponse
} from '../types/api';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token和调试信息
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加调试日志
    console.log('🔀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL || ''}${config.url || ''}`,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      headers: error.response?.headers
    });
    // 新增详细后端错误信息输出
    if (error.response?.data) {
      console.log('🔎 后端详细错误信息:', error.response.data);
    }
    if (error.response?.status === 401) {
      // Token过期，清除本地存储
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  // 用户注册
  register: (userData: UserRegistrationRequest): Promise<AxiosResponse<ApiResponse<UserRegistrationResponse>>> => {
    console.log('📝 Registering user with data:', userData);
    return api.post('/auth/register', userData);
  },
  
  // 用户登录
  login: (credentials: UserLoginRequest): Promise<AxiosResponse<ApiResponse<UserLoginResponse>>> => {
    return api.post('/auth/login', credentials);
  },
  
  // 用户登出
  logout: (): Promise<AxiosResponse<ApiResponse<LogoutResponse>>> => {
    return api.post('/auth/logout');
  },
  
  // 刷新token
  refreshToken: (refreshToken: string): Promise<AxiosResponse<ApiResponse<RefreshTokenResponse>>> => {
    return api.post('/auth/refresh', { refreshToken });
  },
  
  // 验证邮箱
  verifyEmail: (token: string): Promise<AxiosResponse<ApiResponse<EmailVerificationResponse>>> => {
    return api.post('/auth/verify-email', { token });
  },
  
  // 忘记密码
  forgotPassword: (email: string): Promise<AxiosResponse<ApiResponse<ForgotPasswordResponse>>> => {
    return api.post('/auth/forgot-password', { email });
  },
  
  // 重置密码
  resetPassword: (data: ResetPasswordRequest): Promise<AxiosResponse<ApiResponse<ResetPasswordResponse>>> => {
    return api.post('/auth/reset-password', data);
  },
};

// 用户相关API
export const userAPI = {
  // 获取用户资料
  getProfile: (): Promise<AxiosResponse<ApiResponse<UserProfileResponse>>> => {
    return api.get('/users/profile');
  },
  
  // 更新用户资料
  updateProfile: (profileData: UpdateProfileRequest): Promise<AxiosResponse<ApiResponse<UserProfileResponse>>> => {
    return api.put('/users/profile', profileData);
  },
  
  // 修改密码
  changePassword: (passwordData: ChangePasswordRequest): Promise<AxiosResponse<ApiResponse<ChangePasswordResponse>>> => {
    return api.post('/users/change-password', passwordData);
  },
};

export default api; 
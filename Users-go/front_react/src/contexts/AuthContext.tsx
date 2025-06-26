import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, userAPI } from '../services/api';
import { User, UserRegistrationRequest, UserLoginRequest, UpdateProfileRequest } from '../types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: UserLoginRequest) => Promise<any>;
  register: (userData: UserRegistrationRequest) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (profileData: UpdateProfileRequest) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    async function tryRestoreSession() {
      if (token && userData) {
        try {
          // 尝试拉取后端profile，token失效会被拦截器处理
          const resp = await userAPI.getProfile();
          if (resp.data.data && resp.data.data.data) {
            setUser((resp.data.data.data as unknown) as User);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (e) {
          // token失效自动登出
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    }
    tryRestoreSession();
  }, []);

  const login = async (credentials: UserLoginRequest) => {
    try {
      const response = await authAPI.login(credentials);
      const { user: userData, token } = response.data.data!;
      
      localStorage.setItem('accessToken', token.accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: UserRegistrationRequest) => {
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData: UpdateProfileRequest) => {
    try {
      const response = await userAPI.updateProfile(profileData);
      // 拉取后端最新 profile
      const profileResp = await userAPI.getProfile();
      if (profileResp.data.data) {
        localStorage.setItem('user', JSON.stringify(profileResp.data.data));
        setUser((profileResp.data.data as unknown) as User);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
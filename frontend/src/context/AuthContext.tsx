import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  email: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  isVerified: boolean;
  role: string;
  roleVerify: string;
  phone: string;
  address: string;
  profile: string;
  postalcode: string;
}

interface SignupData {
  email: string;
  lastname: string;
  firstname: string;
  middlename?: string;
  password: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (userData: SignupData) => Promise<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/users/me');
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setUser(null);
        localStorage.removeItem('isAuthenticated');
      }
    } catch {
      setUser(null);
      localStorage.removeItem('isAuthenticated');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('isAuthenticated', 'true');
        return true;
      } else {
        toast.error(response.data.message || 'Login failed');
        return false;
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error('Login failed');
      }
      return false;
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      const response = await api.post('/api/users/', userData);
      
      if (response.data.success) {
        toast.success('Account created successfully! Please verify your email.');
        return true;
      } else {
        toast.error(response.data.message || 'Signup failed');
        return false;
      }
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Signup failed';
      toast.error(message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('isAuthenticated');
    }
  };

  const value = {
    user,
    login,
    logout,
    signup,
    isLoading,
    isAuthenticated: !!user,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

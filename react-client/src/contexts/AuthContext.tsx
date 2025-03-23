import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@chakra-ui/react';
import authService from '../services/authService';
import { User, AuthContextType, AuthResponse, RegisterFormData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
        }
      } catch (err) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      setCurrentUser(response.userDetails);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return response;
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterFormData): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      localStorage.setItem('token', response.token);
      setCurrentUser(response.userDetails);
      toast({
        title: 'Account created',
        description: 'Your account has been successfully created',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return response;
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    toast({
      title: 'Logged out',
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import authService from '../services/authService';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: false,
  login: async () => null,
  register: async () => null,
  logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialCheckDone, setInitialCheckDone] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear invalid auth data
        authService.logout();
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };

    checkAuth();
  }, []);

  // Test backend connection when component mounts
  useEffect(() => {
    const testBackendConnection = async () => {
      if (!initialCheckDone) return;

      try {
        const isConnected = await authService.testConnection();
        if (!isConnected) {
          toast({
            title: 'Connection issue',
            description: 'Could not connect to the server. Some features may not work properly.',
            status: 'warning',
            duration: 10000,
            isClosable: true,
            position: 'top-right',
          });
        }
      } catch (error) {
        console.error('Backend connection test failed:', error);
      }
    };

    testBackendConnection();
  }, [initialCheckDone, toast]);

  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      navigate('/');
      toast({
        title: 'Welcome back!',
        description: `You've successfully signed in.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      return user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      toast({
        title: 'Login failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<User | null> => {
    setLoading(true);
    try {
      const user = await authService.register(email, password, firstName, lastName);
      setCurrentUser(user);
      navigate('/');
      toast({
        title: 'Account created!',
        description: 'Your account has been successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      return user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast({
        title: 'Registration failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
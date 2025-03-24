import { apiService } from './api';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

// In types/index.ts
interface AuthResponse {
  userId: string;
  token: string;
  expiresAt: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

const authService = {
  register: async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log('Attempting registration with:', { email, firstName, lastName });
      const response = await apiService.post<AuthResponse>('/auth/register', {
        email,
        password,
        firstName,
        lastName
      });
      console.log('Registration successful, token received');
      
      // Map the response to a User object
      const user: User = {
        id: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role as 'USER' | 'SYSTEM_ADMIN',
        storageQuota: 10240, // Default values
        aiQuota: 50
      };
      
      console.log('Saving user to localStorage:', user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await apiService.post<AuthResponse>('/auth/login', {
        email,
        password
      });
      console.log('Login successful, token received');
      
      // Map the response to a User object
      const user: User = {
        id: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role as 'USER' | 'SYSTEM_ADMIN',
        storageQuota: 10240, // Default values
        aiQuota: 50
      };
      
      console.log('Saving user to localStorage:', user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // In authService.ts
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    console.log('getCurrentUser - userStr from localStorage:', userStr);
    
    if (!userStr) return null;
  
    try {
      const user = JSON.parse(userStr);
      console.log('getCurrentUser - parsed user:', user);
      return user;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user'); // Remove invalid data
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      // Check if token is expired
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
  // Add this function to authService
  testConnection: async () => {
    try {
      await apiService.get('/health'); // Assumes you have a /health endpoint
      return true;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }
};

export default authService;
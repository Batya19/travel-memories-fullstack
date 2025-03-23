import api from './api';
import { AuthResponse, LoginFormData, RegisterFormData, User } from '../types';

const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login error');
      }
      throw new Error('Could not connect to server');
    }
  },

  async register(userData: RegisterFormData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration error');
      }
      throw new Error('Could not connect to server');
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/api/auth/me');
      return response.data;
    } catch (error) {
      throw new Error('Could not retrieve user details');
    }
  },
};

export default authService;
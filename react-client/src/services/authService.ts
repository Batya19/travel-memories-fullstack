import { apiService } from './api/client';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

// Enhanced error handling for API responses
interface ValidationError {
type: string;
title: string;
status: number;
errors?: Record<string, string[]>;
traceId?: string;
}

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

// Enhanced error extraction utility
const extractErrorMessage = (error: any): string => {
// Handle axios error response
if (error.response && error.response.data) {
    const errorData: ValidationError = error.response.data;
    
    // Check for detailed validation errors
    if (errorData.errors) {
        // Flatten and combine all error messages
        const errorMessages = Object.values(errorData.errors)
            .flat()
            .filter(msg => msg && msg.trim() !== '');
        
        return errorMessages.length > 0 
            ? errorMessages.join('. ') 
            : errorData.title || 'Validation error occurred';
    }

    // Fallback to title or generic message
    return errorData.title || 'An error occurred during the operation';
}

// Generic fallback
return error.message || 'Unknown error occurred';
};

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

testConnection: async () => {
    try {
        await apiService.get('/health'); // Assumes you have a /health endpoint
        return true;
    } catch (error) {
        console.error('Backend connection test failed:', error);
        return false;
    }
},

updateProfile: async (data: { firstName: string, lastName: string }) => {
    try {
        // Get current user's email to include in the update
        const user = authService.getCurrentUser();
        if (!user) {
            throw new Error('No authenticated user found');
        }

        const updateData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: user.email
        };

        const response = await apiService.put<User>('/users/me', updateData);

        // Update user in local storage
        const updatedUser = { ...user, ...data };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        return response;
    } catch (error) {
        console.error('Failed to update profile:', error);
        
        // Extract and throw a more informative error
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
    }
},

changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
        return await apiService.post('/users/change-password', {
            currentPassword,
            newPassword,
            confirmNewPassword: confirmPassword
        });
    } catch (error) {
        console.error('Failed to change password:', error);
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
    }
},

getUserQuota: async () => {
    try {
        return await apiService.get('/users/quota');
    } catch (error) {
        console.error('Failed to get user quota:', error);

        // Extract and throw a more informative error
        const errorMessage = extractErrorMessage(error);

        // Fallback to default quota from current user
        const user = authService.getCurrentUser();
        if (user) {
            return {
                storageQuotaMB: user.storageQuota,
                storageUsedMB: 0,
                storageRemainingMB: user.storageQuota,
                aiQuotaTotal: user.aiQuota,
                aiQuotaUsed: 0,
                aiQuotaRemaining: user.aiQuota
            };
        }
        
        throw new Error(errorMessage);
    }
}
};

export default authService;
// src/utils/apiErrorUtils.ts

import { AxiosError } from 'axios';

/**
 * Standard interface for validation errors from the API
 */
export interface ApiValidationError {
  type: string;
  title: string;
  status: number;
  errors?: Record<string, string[]>;
  traceId?: string;
}

/**
 * Extracts a user-friendly error message from API error responses
 */
export const extractErrorMessage = (error: unknown): string => {
  // Handle axios error response
  if (isAxiosError(error) && error.response?.data) {
    const errorData = error.response.data as ApiValidationError;
    
    // Check for detailed validation errors
    if (errorData.errors) {
      // Flatten and combine all error messages
      const errorMessages = Object.values(errorData.errors)
        .flat()
        .filter(msg => msg && typeof msg === 'string' && msg.trim() !== '');
      
      return errorMessages.length > 0 
        ? errorMessages.join('. ') 
        : errorData.title || 'Validation error occurred';
    }

    // Fallback to title or generic message
    return errorData.title || 'An error occurred during the operation';
  }

  // Generic fallback
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Unknown error occurred';
};

/**
 * Type guard to check if an error is an Axios error
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}
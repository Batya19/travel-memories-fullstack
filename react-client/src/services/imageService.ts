import { apiService } from './api';
import { Image } from '../types';
import axios from 'axios';

interface GenerateAiImageRequest {
    prompt: string;
    style?: string;
    tripId?: string;
}

const imageService = {
    // Get all images for a specific trip
    getImages: async (tripId: string) => {
        try {
            return await apiService.get<Image[]>(`/images?tripId=${tripId}`);
        } catch (error) {
            console.error(`Failed to fetch images for trip ${tripId}:`, error);
            throw error;
        }
    },

    // Get a specific image by ID
    getImage: async (id: string) => {
        try {
            return await apiService.get<Image>(`/images/${id}`);
        } catch (error) {
            console.error(`Failed to fetch image ${id}:`, error);
            throw error;
        }
    },

    // Upload one or more images to a trip
    uploadImages: async (files: File[], tripId: string, onProgress?: (progress: number) => void) => {
        try {
            const formData = new FormData();

            // שמור על האותיות גדולות בהתחלה
            formData.append('TripId', tripId);  // T גדולה

            // Append each file to the form data
            Array.from(files).forEach(file => {
                formData.append('Files', file);  // F גדולה
            });

            // הוסף לוג לדיבוג
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: `, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
            }

            const baseURL = import.meta.env.VITE_API_URL ?
                `${import.meta.env.VITE_API_URL}/api` :
                'http://localhost:7051/api';

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found. Please log in again.');
            }

            const response = await axios.post(
                `${baseURL}/images/upload`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // וודא שזה בפורמט הנכון עם רווח אחרי Bearer
                    },
                    onUploadProgress: (progressEvent: any) => {
                        if (onProgress && progressEvent.total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            onProgress(percentCompleted);
                        }
                    }
                }
            );

            return response.data;
        } catch (error) {
            // השאר את הטיפול בשגיאות ללא שינוי...
            console.error('Failed to upload images:', error);

            // בקובץ imageService.ts, בבלוק ה-catch:
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Error data:', error.response.data);
                    // הוסף את השורה הבאה כדי לראות את המידע המפורט
                    console.error('Error details:', error.response.data.errors);
                    console.error('Error status:', error.response.status);
                    console.error('Error headers:', error.response.headers);
                }
            }
            throw error;
        }
    },

    // Delete an image
    deleteImage: async (id: string) => {
        try {
            return await apiService.delete<void>(`/images/${id}`);
        } catch (error) {
            console.error(`Failed to delete image ${id}:`, error);
            throw error;
        }
    },

    // Generate an AI image
    generateAiImage: async (request: GenerateAiImageRequest) => {
        try {
            return await apiService.post<Image>('/ai-images', request);
        } catch (error) {
            console.error('Failed to generate AI image:', error);
            throw error;
        }
    },

    // Update image metadata (e.g., adding tags)
    updateImageMetadata: async (id: string, metadata: any) => {
        try {
            return await apiService.patch<Image>(`/images/${id}`, metadata);
        } catch (error) {
            console.error(`Failed to update image metadata for ${id}:`, error);
            throw error;
        }
    },

    // Get remaining AI image quota for the current user
    getAiQuota: async () => {
        try {
            return await apiService.get<{ remaining: number, total: number }>('/images/ai-quota');
        } catch (error) {
            console.error('Failed to fetch AI quota:', error);
            throw error;
        }
    }
};

export default imageService;
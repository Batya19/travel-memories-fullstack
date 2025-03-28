import { apiService } from './api/client';
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
            console.log(`API Call: Requesting images for tripId ${tripId}`);

            // Fixed URL to use the correct endpoint
            const url = `/images/trip/${tripId}?_debug=${Date.now()}`;

            const response = await apiService.get<Image[]>(url);

            console.log(`API Response: Received ${response.length} images for tripId ${tripId}`);

            // Verify that all returned images actually belong to this trip
            const foreignImages = response.filter(img => img.tripId !== tripId);
            if (foreignImages.length > 0) {
                console.error(`ERROR: Received ${foreignImages.length} images that don't belong to tripId ${tripId}:`, foreignImages);

                // Filter out the foreign images to fix the issue
                const correctImages = response.filter(img => img.tripId === tripId);
                console.log(`FIXED: Filtered to ${correctImages.length} correct images for this trip`);

                return correctImages;
            }

            return response;
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
    uploadImages: async (files: File[], tripId: string, tags: string[], onProgress?: (progress: number) => void) => {
        try {
            const formData = new FormData();

            // שמור על האותיות גדולות בהתחלה
            formData.append('TripId', tripId);  // T גדולה

            // Append each file to the form data
            Array.from(files).forEach(file => {
                formData.append('Files', file);  // F גדולה
            });

            // הוסף לוג של תוכן ה-tags לפני שמנסים לשלוח אותם
            console.log('Tags:', tags);

            // הוסף את תגיות ה-`Tags` אם זה מערך
            if (Array.isArray(tags)) {
                tags.forEach(tag => {
                    console.log(`Appending tag: ${tag}`); // לוג של כל תגית שמוסיפים
                    formData.append('Tags', tag);
                });
            } else {
                console.error('Tags is not an array:', tags); // לוג במקרה שה-`tags` לא מערך
            }

            // הוסף לוג לדיבוג כדי לראות את כל תוכן ה-FormData
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
            console.error('Failed to upload images:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Error data:', error.response.data);
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
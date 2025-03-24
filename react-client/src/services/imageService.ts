import { apiService } from './api';
import { Image } from '../types';

interface UploadResponse {
    id: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
}

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
            formData.append('tripId', tripId);

            // Append each file to the form data
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });

            // Custom config for the file upload with progress tracking
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent: any) => {
                    if (onProgress && progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(percentCompleted);
                    }
                }
            };

            // Use the underlying axios instance for more control
            return await apiService.post<UploadResponse[]>('/images/upload', formData, config);
        } catch (error) {
            console.error('Failed to upload images:', error);
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
            return await apiService.post<Image>('/images/generate-ai', request);
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
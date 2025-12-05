import { apiService } from './api/client';
import { Image } from '../types';
import axios from 'axios';

interface GenerateAiImageRequest {
    prompt: string;
    style?: string;
    tripId?: string;
}

const imageCache = new Map<string, Image[]>();

const imageService = {
    getImages: async (tripId: string) => {
        if (imageCache.has(tripId)) {
            return imageCache.get(tripId)!;
        }

        try {
            const url = `/images/trip/${tripId}`;
            const response = await apiService.get<Image[]>(url);

            const foreignImages = response.filter(img => img.tripId !== tripId);
            let correctImages = response;
            if (foreignImages.length > 0) {
                correctImages = response.filter(img => img.tripId === tripId);
            }

            imageCache.set(tripId, correctImages);

            return correctImages;
        } catch (error) {
            console.error(`Failed to fetch images for trip ${tripId}:`, error);
            imageCache.delete(tripId);
            throw error;
        }
    },

    uploadImages: async (files: File[], tripId: string, onProgress?: (progress: number) => void) => {
        const formData = new FormData();

        files.forEach(file => {
            formData.append('files', file);
        });
        formData.append('tags', JSON.stringify([]));
        formData.append('tripId', tripId);

        try {
            const response = await apiService.post<Image[]>(`/images/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(percentCompleted);
                    }
                },
            });

            imageCache.delete(tripId);
            return response;
        } catch (error) {
            console.error(`Failed to upload images for trip ${tripId}:`, error);
            throw error;
        }
    },

    deleteImage: async (id: string) => {
        try {
            return await apiService.delete<void>(`/images/${id}`);
        } catch (error) {
            console.error(`Failed to delete image ${id}:`, error);
            throw error;
        }
    },

    generateAiImage: async (request: GenerateAiImageRequest) => {
        try {
            const response = await apiService.post<Image>('/ai-images', request);
            if (request.tripId) {
                imageCache.delete(request.tripId);
            }
            return response;
        } catch (error) {
            console.error('Failed to generate AI image:', error);
            throw error;
        }
    },

    getAiQuota: async () => {
        try {
            return await apiService.get<{ remaining: number, total: number }>('/ai-images/quota');
        } catch (error) {
            console.error('Failed to get AI quota:', error);
            throw error;
        }
    },

    clearCache: () => {
        imageCache.clear();
    }
};

export default imageService;
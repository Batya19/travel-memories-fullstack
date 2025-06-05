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
            console.log(`Using cached images for tripId: ${tripId}`);
            return imageCache.get(tripId)!;
        }

        try {
            console.log(`API Call: Requesting images for tripId ${tripId}`);

            const url = `/images/trip/${tripId}?_debug=${Date.now()}`;

            const response = await apiService.get<Image[]>(url);

            console.log(`API Response: Received ${response.length} images for tripId ${tripId}`);

            const foreignImages = response.filter(img => img.tripId !== tripId);
            let correctImages = response;
            if (foreignImages.length > 0) {
                console.error(`ERROR: Received ${foreignImages.length} images that don't belong to tripId ${tripId}:`, foreignImages);
                correctImages = response.filter(img => img.tripId === tripId);
                console.log(`FIXED: Filtered to ${correctImages.length} correct images for this trip`);
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
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            }
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

    updateImageMetadata: async (id: string, metadata: unknown) => {
        try {
            const response = await apiService.patch<Image>(`/images/${id}`, metadata);
            return response;
        } catch (error) {
            console.error(`Failed to update image metadata for ${id}:`, error);
            throw error;
        }
    },

    getAiQuota: async () => {
        try {
            return await apiService.get<{ remaining: number, total: number }>('/images/ai-quota');
        } catch (error) {
            console.error('Failed to get AI quota:', error);
            throw error;
        }
    },

    clearCache: () => {
        imageCache.clear();
        console.log('Image cache cleared.');
    }
};

export default imageService;
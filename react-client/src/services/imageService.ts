import { apiService } from './api/client';
import { Image } from '../types';
import axios from 'axios';

interface GenerateAiImageRequest {
    prompt: string;
    style?: string;
    tripId?: string;
}

// Add a cache for images outside the imageService object
// This ensures the cache persists across calls within the same session.
const imageCache = new Map<string, Image[]>(); 

const imageService = {
    // Get all images for a specific trip
    getImages: async (tripId: string) => {
        // 1. Check if images for this tripId are already in cache
        if (imageCache.has(tripId)) {
            console.log(`Using cached images for tripId: ${tripId}`); 
            return imageCache.get(tripId)!; // Return cached data
        }

        try {
            console.log(`API Call: Requesting images for tripId ${tripId}`); 

            // Fixed URL to use the correct endpoint
            // Added _debug parameter to prevent caching issues during development, remove in production
            const url = `/images/trip/${tripId}?_debug=${Date.now()}`;

            const response = await apiService.get<Image[]>(url); 

            console.log(`API Response: Received ${response.length} images for tripId ${tripId}`); 

            // Verify that all returned images actually belong to this trip
            const foreignImages = response.filter(img => img.tripId !== tripId); 
            let correctImages = response;
            if (foreignImages.length > 0) {
                console.error(`ERROR: Received ${foreignImages.length} images that don't belong to tripId ${tripId}:`, foreignImages); 
                // Filter out the foreign images to fix the issue
                correctImages = response.filter(img => img.tripId === tripId); 
                console.log(`FIXED: Filtered to ${correctImages.length} correct images for this trip`); 
            }

            // 2. Store the fetched images in the cache before returning
            imageCache.set(tripId, correctImages); 

            return correctImages;
        } catch (error) {
            console.error(`Failed to fetch images for trip ${tripId}:`, error); 
            // If the request fails, ensure it's not cached to allow future retries
            imageCache.delete(tripId); // Remove from cache on error
            throw error;
        }
    },

    // Upload images for a specific trip
    uploadImages: async (files: File[], tripId: string, tags: string[], onProgress?: (progress: number) => void) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await apiService.post<Image[]>(`/images/upload/${tripId}`, formData, {
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
            // Clear cache for this trip after upload to ensure fresh data is fetched next time
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

    // Delete an image
    deleteImage: async (id: string) => {
        try {
            // Invalidate cache for any trip this image might belong to (if tripId is known)
            // For a single image deletion, it's safer to clear all cache or find the tripId if possible
            // For simplicity, if `id` implies a trip, you'd delete `imageCache.delete(tripId)`
            // If not, a full clear might be needed, or refactor cache by single image ID.
            // For now, no specific tripId invalidation here, relying on re-fetch if needed.
            // A more robust solution might pass the tripId to deleteImage.
            return await apiService.delete<void>(`/images/${id}`);
        } catch (error) {
            console.error(`Failed to delete image ${id}:`, error);
            throw error;
        }
    },

    // Generate an AI image
    generateAiImage: async (request: GenerateAiImageRequest) => {
        try {
            const response = await apiService.post<Image>('/ai-images', request);
            // If AI image is generated for a specific trip, invalidate its cache
            if (request.tripId) {
                imageCache.delete(request.tripId);
            }
            return response;
        } catch (error) {
            console.error('Failed to generate AI image:', error);
            throw error;
        }
    },

    // Update image metadata (e.g., adding tags)
    updateImageMetadata: async (id: string, metadata: unknown) => {
        try {
            const response = await apiService.patch<Image>(`/images/${id}`, metadata);
            // If image metadata is updated, invalidate cache for the relevant trip
            // This would require knowing the tripId associated with the image,
            // which might need to be passed as a parameter or fetched.
            // For now, no specific cache invalidation here.
            return response;
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
            console.error('Failed to get AI quota:', error);
            throw error;
        }
    },

    // Example of adding a function to clear the entire image cache
    clearCache: () => {
        imageCache.clear();
        console.log('Image cache cleared.');
    }
};

export default imageService;
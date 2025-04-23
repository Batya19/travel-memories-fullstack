import apiClient from './api/client';

export interface AIImageRequest {
    prompt: string;
    style?: string;
    tripId?: string;
}

export interface AIImageResponse {
    imageId: string;
    url: string;
    prompt: string;
    style?: string;
    createdAt: string;
    tripId?: string;
}

export interface AIQuotaResponse {
    total: number;
    used: number;
    remaining: number;
    resetDate: string;
}

const aiImageService = {
    // Generate an AI image
    generateImage: async (request: AIImageRequest): Promise<AIImageResponse> => {
        try {
            console.log('Sending request to API:', request);
            const response = await apiClient.post<AIImageResponse>('/ai-images', request);
            return response.data;
        } catch (error) {
            console.error('Failed to generate AI image:', error);
            throw error;
        }
    },

    // Get user quota
    getQuota: async (): Promise<AIQuotaResponse> => {
        try {
            const response = await apiClient.get<AIQuotaResponse>('/ai-images/quota');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch quota information:', error);
            throw error;
        }
    }
};

export default aiImageService;
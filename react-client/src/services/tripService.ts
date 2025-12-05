import { apiService } from './api/client';
import { Trip } from '../types';

const tripService = {
    getTrips: async () => {
        try {
            return await apiService.get<Trip[]>('/trips');
        } catch (error) {
            console.error('Failed to fetch trips:', error);
            throw error;
        }
    },

    getTrip: async (id: string) => {
        try {
            return await apiService.get<Trip>(`/trips/${id}`);
        } catch (error) {
            console.error(`Failed to fetch trip ${id}:`, error);
            throw error;
        }
    },

    createTrip: async (tripData: Omit<Trip, 'id' | 'createdAt'>) => {
        try {
            return await apiService.post<Trip>('/trips', tripData);
        } catch (error) {
            console.error('Failed to create trip:', error);
            throw error;
        }
    },

    updateTrip: async (id: string, tripData: Partial<Omit<Trip, 'id' | 'createdAt'>>) => {
        try {
            return await apiService.put<Trip>(`/trips/${id}`, tripData);
        } catch (error) {
            console.error(`Failed to update trip ${id}:`, error);
            throw error;
        }
    },

    deleteTrip: async (id: string) => {
        try {
            return await apiService.delete<void>(`/trips/${id}`);
        } catch (error) {
            console.error(`Failed to delete trip ${id}:`, error);
            throw error;
        }
    },

    generateShareLink: async (id: string) => {
        try {
            const response = await apiService.post<{ shareId: string }>(`/trips/${id}/regenerate-share`);
            return response;
        } catch (error) {
            console.error(`Failed to generate share link for trip ${id}:`, error);
            throw error;
        }
    },

    getSharedTrip: async (shareId: string) => {
        try {
            return await apiService.get<Trip>(`/trips/shared/${shareId}`);
        } catch (error) {
            console.error(`Failed to fetch shared trip ${shareId}:`, error);
            throw error;
        }
    }
};

export default tripService;
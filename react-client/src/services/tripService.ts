import { apiService } from './api';
import { Trip } from '../types';

const tripService = {
    // Get all trips for the current user
    getTrips: async () => {
        try {
            return await apiService.get<Trip[]>('/trips');
        } catch (error) {
            console.error('Failed to fetch trips:', error);
            throw error;
        }
    },

    // Get a specific trip by ID
    getTrip: async (id: string) => {
        try {
            return await apiService.get<Trip>(`/trips/${id}`);
        } catch (error) {
            console.error(`Failed to fetch trip ${id}:`, error);
            throw error;
        }
    },

    // Create a new trip
    createTrip: async (tripData: Omit<Trip, 'id' | 'createdAt'>) => {
        try {
            return await apiService.post<Trip>('/trips', tripData);
        } catch (error) {
            console.error('Failed to create trip:', error);
            throw error;
        }
    },

    // Update an existing trip
    updateTrip: async (id: string, tripData: Partial<Omit<Trip, 'id' | 'createdAt'>>) => {
        try {
            return await apiService.put<Trip>(`/trips/${id}`, tripData);
        } catch (error) {
            console.error(`Failed to update trip ${id}:`, error);
            throw error;
        }
    },

    // Delete a trip
    deleteTrip: async (id: string) => {
        try {
            return await apiService.delete<void>(`/trips/${id}`);
        } catch (error) {
            console.error(`Failed to delete trip ${id}:`, error);
            throw error;
        }
    },

    // Generate a sharing link for a trip
    generateShareLink: async (id: string) => {
        try {
            return await apiService.post<{ shareId: string }>(`/trips/${id}/share`);
        } catch (error) {
            console.error(`Failed to generate share link for trip ${id}:`, error);
            throw error;
        }
    },

    // Get a trip by share ID (for public access)
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
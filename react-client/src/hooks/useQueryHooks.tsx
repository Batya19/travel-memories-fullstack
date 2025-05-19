import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tripService from '../services/tripService';
import imageService from '../services/imageService';
import { Trip } from '../types';

// === Trips Queries ===
export function useTrips() {
    return useQuery({
        queryKey: ['trips'],
        queryFn: tripService.getTrips,
    });
}

export function useTrip(id: string | undefined) {
    return useQuery({
        queryKey: ['trip', id],
        queryFn: () => tripService.getTrip(id!),
        enabled: !!id,
    });
}

// === Trip Mutations ===
export function useCreateTrip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tripData: Omit<Trip, "id" | "createdAt">) =>
            tripService.createTrip(tripData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trips'] });
        },
    });
}

export function useUpdateTrip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Trip> }) =>
            tripService.updateTrip(id, data),
        onSuccess: (updatedTrip) => {
            queryClient.invalidateQueries({ queryKey: ['trips'] });
            queryClient.invalidateQueries({ queryKey: ['trip', updatedTrip.id] });
        },
    });
}

export function useDeleteTrip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => tripService.deleteTrip(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: ['trips'] });
            queryClient.removeQueries({ queryKey: ['trip', id] });
        },
    });
}

export function useGenerateShareLink(tripId: string) {
    return useMutation({
        mutationFn: () => tripService.generateShareLink(tripId),
    });
}

// === Images Queries ===
export function useTripImages(tripId: string | undefined) {
    return useQuery({
        queryKey: ['tripImages', tripId],
        queryFn: () => imageService.getImages(tripId!),
        enabled: !!tripId,
    });
}

export function useDeleteImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (imageId: string) => imageService.deleteImage(imageId),
        onSuccess: () => {
            // ביטול תוקף של כל שאילתות התמונות בכל הטיולים
            queryClient.invalidateQueries({ queryKey: ['tripImages'] });
        },
    });
}

export function useUploadImages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            files,
            tripId,
            tags,
            onProgress
        }: {
            files: File[],
            tripId: string,
            tags: string[],
            onProgress?: (progress: number) => void
        }) =>
            imageService.uploadImages(files, tripId, tags, onProgress),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['tripImages', variables.tripId]
            });
        },
    });
}

// === AI Image Queries and Mutations ===
export function useAIQuota() {
    return useQuery({
        queryKey: ['aiQuota'],
        queryFn: () => imageService.getAiQuota(),
    });
}

export function useGenerateAIImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: { prompt: string, style?: string, tripId?: string }) =>
            imageService.generateAiImage(request),
        onSuccess: (data) => {
            if (data.tripId) {
                queryClient.invalidateQueries({
                    queryKey: ['tripImages', data.tripId]
                });
            }
            queryClient.invalidateQueries({ queryKey: ['aiQuota'] });
        },
    });
}
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { Trip, Image } from '../types';
import tripService from '../services/tripService';
import imageService from '../services/imageService';
import { useToast } from '@chakra-ui/react';

interface TripContextType {
  // Trips state
  trips: Trip[];
  currentTrip: Trip | null;
  isLoading: boolean;
  error: string | null;

  // Trip images - משתנה לאחסון מידע לפי טיול
  tripImagesMap: Record<string, Image[]>;
  tripImages: Image[]; // לתאימות לאחור
  isImagesLoading: boolean;

  // Actions
  fetchTrips: () => Promise<Trip[]>;
  fetchTrip: (tripId: string) => Promise<Trip | null>;
  fetchTripImages: (tripId: string) => Promise<Image[]>;
  clearTripImages: () => void; // פונקציה חדשה לניקוי התמונות
  createTrip: (tripData: Omit<Trip, "id" | "createdAt">) => Promise<Trip | null>;
  updateTrip: (tripId: string, tripData: Partial<Trip>) => Promise<Trip | null>;
  deleteTrip: (tripId: string) => Promise<boolean>;
  uploadImages: (files: File[], tripId: string, onProgress?: (progress: number) => void) => Promise<Image[]>;
  deleteImage: (imageId: string) => Promise<boolean>;
  generateShareLink: (tripId: string) => Promise<{ shareId: string }>;
}

const TripContext = createContext<TripContextType>({
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,
  tripImagesMap: {}, // מבנה נתונים חדש
  tripImages: [],
  isImagesLoading: false,
  fetchTrips: async () => [],
  fetchTrip: async () => null,
  fetchTripImages: async () => [],
  clearTripImages: () => { },
  createTrip: async () => null,
  updateTrip: async () => null,
  deleteTrip: async () => false,
  uploadImages: async () => [],
  deleteImage: async () => false,
  generateShareLink: async () => ({ shareId: '' }),
});

export const useTrip = () => useContext(TripContext);

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // מבנה נתונים חדש: מפה של תמונות לפי מזהה טיול
  const [tripImagesMap, setTripImagesMap] = useState<Record<string, Image[]>>({});
  const [isImagesLoading, setIsImagesLoading] = useState<boolean>(false);

  const toast = useToast();

  // הגדרת tripImages כנגזרת של tripImagesMap והטיול הנוכחי
  const tripImages = useMemo(() => {
    if (!currentTrip) return [];
    return tripImagesMap[currentTrip.id] || [];
  }, [currentTrip, tripImagesMap]);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await tripService.getTrips();
      setTrips(data);
      return data;
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load trips. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to load trips. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrip = async (tripId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const trip = await tripService.getTrip(tripId);
      setCurrentTrip(trip);
      return trip;
    } catch (err) {
      console.error(`Error fetching trip ${tripId}:`, err);
      setError('Failed to load trip details. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to load trip details. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTripImages = async (tripId: string) => {
    setIsImagesLoading(true);

    try {
      console.log(`Fetching images for trip: ${tripId}`);
      const images = await imageService.getImages(tripId);
      console.log(`Received ${images.length} images for trip ${tripId}`);

      // שמירת התמונות במפה לפי מזהה הטיול
      setTripImagesMap(prev => ({
        ...prev,
        [tripId]: images
      }));

      return images;
    } catch (err) {
      console.error(`Error fetching images for trip ${tripId}:`, err);
      toast({
        title: 'Error',
        description: 'Failed to load images. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return [];
    } finally {
      setIsImagesLoading(false);
    }
  };

  // Enhanced clearTripImages function with more options
  const clearTripImages = useCallback(() => {
    if (currentTrip) {
      // Clear only current trip's images from the map
      console.log(`Clearing images for trip: ${currentTrip.id}`);
      setTripImagesMap(prev => {
        const newMap = { ...prev };
        delete newMap[currentTrip.id];
        return newMap;
      });
    } else {
      // If no current trip, clear all images
      console.log('Clearing all trip images');
      setTripImagesMap({});
    }
  }, [currentTrip]);

  const createTrip = async (tripData: Omit<Trip, "id" | "createdAt">) => {
    setIsLoading(true);

    try {
      const newTrip = await tripService.createTrip(tripData);
      setTrips(prevTrips => [...prevTrips, newTrip]);

      // איתחול מפת התמונות עבור הטיול החדש
      setTripImagesMap(prev => ({
        ...prev,
        [newTrip.id]: []
      }));

      toast({
        title: 'Trip created',
        description: `${newTrip.name} has been created successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      return newTrip;
    } catch (err) {
      console.error('Error creating trip:', err);
      toast({
        title: 'Error',
        description: 'Failed to create trip. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrip = async (tripId: string, tripData: Partial<Trip>) => {
    setIsLoading(true);

    try {
      const updatedTrip = await tripService.updateTrip(tripId, tripData);

      // Update trips list
      setTrips(prevTrips =>
        prevTrips.map(trip => trip.id === tripId ? { ...trip, ...updatedTrip } : trip)
      );

      // Update current trip if it's the one being edited
      if (currentTrip && currentTrip.id === tripId) {
        setCurrentTrip({ ...currentTrip, ...updatedTrip });
      }

      toast({
        title: 'Trip updated',
        description: `${updatedTrip.name} has been updated successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      return updatedTrip;
    } catch (err) {
      console.error(`Error updating trip ${tripId}:`, err);
      toast({
        title: 'Error',
        description: 'Failed to update trip. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      await tripService.deleteTrip(tripId);

      // Remove from trips list
      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));

      // Remove trip images from the map
      setTripImagesMap(prev => {
        const newMap = { ...prev };
        delete newMap[tripId];
        return newMap;
      });

      // Clear current trip if it's the one being deleted
      if (currentTrip && currentTrip.id === tripId) {
        setCurrentTrip(null);
      }

      toast({
        title: 'Trip deleted',
        description: 'The trip has been deleted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      return true;
    } catch (err) {
      console.error(`Error deleting trip ${tripId}:`, err);
      toast({
        title: 'Error',
        description: 'Failed to delete trip. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };

  const uploadImages = async (files: File[], tripId: string, onProgress?: (progress: number) => void) => {
    try {
      const uploadedImages = await imageService.uploadImages(files, tripId, [], onProgress);
      console.log(`Uploaded ${uploadedImages.length} images to trip ${tripId}`);

      // עדכון תמונות הטיול במפה
      setTripImagesMap(prev => {
        const currentImages = prev[tripId] || [];
        return {
          ...prev,
          [tripId]: [...currentImages, ...uploadedImages]
        };
      });

      toast({
        title: 'Images uploaded',
        description: `Successfully uploaded ${uploadedImages.length} images.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      return uploadedImages;
    } catch (err) {
      console.error('Error uploading images:', err);
      toast({
        title: 'Error',
        description: 'Failed to upload images. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return [];
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      await imageService.deleteImage(imageId);

      // מחיקת התמונה מכל הטיולים במפה
      setTripImagesMap(prev => {
        const newMap = { ...prev };
        // Find which trip this image belongs to
        let foundInTrip = '';

        // עבור על כל הטיולים במפה
        Object.keys(newMap).forEach(tripId => {
          const hasImage = newMap[tripId].some(img => img.id === imageId);
          if (hasImage) {
            foundInTrip = tripId;
            // עדכן את התמונות בטיול זה
            newMap[tripId] = newMap[tripId].filter(img => img.id !== imageId);
          }
        });

        console.log(`Deleted image ${imageId} from trip ${foundInTrip}`);
        return newMap;
      });

      toast({
        title: 'Image deleted',
        description: 'The image has been deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (err) {
      console.error(`Error deleting image ${imageId}:`, err);
      toast({
        title: 'Error',
        description: 'Failed to delete the image. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };

  const generateShareLink = async (tripId: string) => {
    try {
      const response = await tripService.generateShareLink(tripId);
      return response;
    } catch (err) {
      console.error(`Error generating share link for trip ${tripId}:`, err);
      toast({
        title: 'Error',
        description: 'Failed to generate share link. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return { shareId: '' };
    }
  };

  // Provide all the values and functions to the context
  const value = {
    trips,
    currentTrip,
    isLoading,
    error,
    tripImagesMap,
    tripImages,
    isImagesLoading,
    fetchTrips,
    fetchTrip,
    fetchTripImages,
    clearTripImages,
    createTrip,
    updateTrip,
    deleteTrip,
    uploadImages,
    deleteImage,
    generateShareLink,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export default TripProvider;
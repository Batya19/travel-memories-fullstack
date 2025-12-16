import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Image as ImageType } from '../types';
import imageService from '../services/imageService';

interface ImageCacheContextType {
  getImagesForTrip: (tripId: string) => Promise<ImageType[]>;
  getCachedImages: (tripId: string) => ImageType[] | null;
  preloadImagesForTrips: (tripIds: string[]) => Promise<void>;
  clearCache: () => void;
}

const ImageCacheContext = createContext<ImageCacheContextType | undefined>(undefined);

export const useImageCache = () => {
  const context = useContext(ImageCacheContext);
  if (!context) {
    throw new Error('useImageCache must be used within ImageCacheProvider');
  }
  return context;
};

interface ImageCacheProviderProps {
  children: ReactNode;
}

export const ImageCacheProvider: React.FC<ImageCacheProviderProps> = ({ children }) => {
  const [imageCache, setImageCache] = useState<Map<string, ImageType[]>>(new Map());
  const [loadingTrips, setLoadingTrips] = useState<Set<string>>(new Set());

  const getCachedImages = useCallback((tripId: string): ImageType[] | null => {
    return imageCache.get(tripId) || null;
  }, [imageCache]);

  const getImagesForTrip = useCallback(async (tripId: string): Promise<ImageType[]> => {
    // Return cached if available
    const cached = imageCache.get(tripId);
    if (cached) {
      return cached;
    }

    // Prevent duplicate requests
    if (loadingTrips.has(tripId)) {
      return new Promise((resolve) => {
        const checkCache = setInterval(() => {
          const result = imageCache.get(tripId);
          if (result) {
            clearInterval(checkCache);
            resolve(result);
          }
        }, 100);
      });
    }

    // Fetch and cache
    setLoadingTrips(prev => new Set(prev).add(tripId));
    
    try {
      const images = await imageService.getImages(tripId);
      setImageCache(prev => new Map(prev).set(tripId, images));
      return images;
    } catch (error) {
      console.error(`Failed to fetch images for trip ${tripId}:`, error);
      return [];
    } finally {
      setLoadingTrips(prev => {
        const next = new Set(prev);
        next.delete(tripId);
        return next;
      });
    }
  }, [imageCache, loadingTrips]);

  const preloadImagesForTrips = useCallback(async (tripIds: string[]) => {
    const unloadedTrips = tripIds.filter(id => !imageCache.has(id) && !loadingTrips.has(id));
    
    if (unloadedTrips.length === 0) return;

    await Promise.all(unloadedTrips.map(tripId => getImagesForTrip(tripId)));
  }, [imageCache, loadingTrips, getImagesForTrip]);

  const clearCache = useCallback(() => {
    setImageCache(new Map());
    setLoadingTrips(new Set());
  }, []);

  return (
    <ImageCacheContext.Provider 
      value={{ 
        getImagesForTrip, 
        getCachedImages, 
        preloadImagesForTrips,
        clearCache 
      }}
    >
      {children}
    </ImageCacheContext.Provider>
  );
};


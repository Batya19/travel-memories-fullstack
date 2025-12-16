import { useEffect, useState } from 'react';
import { useImageCache } from '../contexts/ImageCacheContext';
import { Image as ImageType } from '../types';

export const useCachedImages = (tripId: string | undefined) => {
  const { getImagesForTrip, getCachedImages } = useImageCache();
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) {
      setImages([]);
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
      // Check cache first
      const cached = getCachedImages(tripId);
      if (cached) {
        setImages(cached);
        setLoading(false);
        return;
      }

      // Fetch if not cached
      setLoading(true);
      const fetchedImages = await getImagesForTrip(tripId);
      setImages(fetchedImages);
      setLoading(false);
    };

    fetchImages();
  }, [tripId, getImagesForTrip, getCachedImages]);

  return { images, loading };
};


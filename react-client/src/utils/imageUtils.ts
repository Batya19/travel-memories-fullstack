// src/utils/imageUtils.ts
import { Image } from '../types';

export const getImageUrl = (image: Image): string => {
  if (!image) {
    return '/images/placeholder.jpg';
  }
  
  const apiBaseUrl = import.meta.env.VITE_API_URL || '';
  // Use the /api/images/{id}/content endpoint pattern from your Swagger
  return `${apiBaseUrl.replace(/\/$/, '')}/api/images/${image.id}/content`;
};
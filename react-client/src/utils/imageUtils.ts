import { Image } from '../types';

// Get the base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7051';

/**
 * Get a complete URL for an image based on its ID or full object
 */
export const getImageUrl = (image: Image | string): string => {
  // If we got an image object
  if (typeof image !== 'string') {
    // If the image has a complete URL including http/https, use it directly
    if (image.filePath && (image.filePath.startsWith('http://') || image.filePath.startsWith('https://'))) {
      return image.filePath;
    }
    
    // Otherwise construct the URL using the image ID
    return `${API_URL}/api/images/${image.id}/content`;
  }
  
  // If we got just an ID string
  return `${API_URL}/api/images/${image}/content`;
};

/**
 * Gets a complete URL for an image from the url path in AI image response
 */
export const getAIImageUrl = (url: string): string => {
  // If the URL already starts with http:// or https://, it's a complete URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, prepend the API base URL
  return `${API_URL}${url}`;
};
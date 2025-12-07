import { Image as ImageType } from '../types';
import { formatDateShort } from './dateUtils';

export const getImageUrl = (image: ImageType | string): string => {
  const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7051';

  // If we received an image object
  if (typeof image !== 'string') {
    // If the image has a complete URL, use it directly
    if (image.fileUrl && (image.fileUrl.startsWith('http://') || image.fileUrl.startsWith('https://'))) {
      return image.fileUrl;
    }

    // If filePath is a complete URL, use it
    if (image.filePath && (image.filePath.startsWith('http://') || image.filePath.startsWith('https://'))) {
      return image.filePath;
    }

    // Otherwise construct URL using image ID
    return `${API_URL}/api/images/${image.id}/content`;
  }

  // If we received an ID string
  return `${API_URL}/api/images/${image}/content`;
};

export const getAIImageUrl = (url: string): string => {
  // If the URL already starts with http:// or https://, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Otherwise, prepend the API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7051';
  return `${API_URL}${url}`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatImageDate = (dateString: string | null): string => {
  return formatDateShort(dateString);
};
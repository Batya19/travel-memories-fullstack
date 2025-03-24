// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'SYSTEM_ADMIN';
  storageQuota: number;
  aiQuota: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface FormErrors {
  [key: string]: string;
}

// Trip types
export interface Trip {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  shareId?: string;
  createdAt: string;
}

// Image types
export interface Image {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  takenAt?: string;
  tripId?: string;
  isAiGenerated: boolean;
  aiPrompt?: string;
  aiStyle?: string;
  createdAt: string;
}

// Tag types
export interface Tag {
  id: string;
  name: string;
}
export enum UserRole {
    USER = 'USER',
    PREMIUM_USER = 'PREMIUM_USER',
    SYSTEM_ADMIN = 'SYSTEM_ADMIN'
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    storageQuota: number;
    aiQuota: number;
    storageUsed: number;
    aiQuotaUsed: number; // Added this field
    tripCount: number;
    imageCount: number;
    createdAt: Date;
    updatedAt?: Date;
    lastLoginDate?: Date; // Added this field if needed
    isActive?: boolean; // Added this field if needed
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    userDetails: {
        userId: string;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
    };
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
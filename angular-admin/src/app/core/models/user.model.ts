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
    aiQuotaUsed: number;
    tripCount: number;
    imageCount: number;
    createdAt: Date;
    updatedAt?: Date;
    lastLoginDate?: Date;
    isActive?: boolean;
}
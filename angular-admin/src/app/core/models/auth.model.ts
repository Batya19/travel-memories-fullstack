import { UserRole } from "./user.model";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    userId: string;
    token: string;
    expiresAt: string;
    userDetails: {
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
    };
}
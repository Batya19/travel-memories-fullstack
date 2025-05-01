export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    userId: string;
    token: string;
    expiresAt: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}
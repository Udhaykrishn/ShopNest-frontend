export enum UserRole {
    ADMIN = "admin",
    VENDOR = "vendor",
    USER = 'user'
}

export interface User {
    _id: string;
    username: string;
    role: UserRole;
    email: string;
    phone: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    error: string | null;
}


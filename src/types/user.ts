
export interface User {
    _id: string;
    id: string;
    username: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    createdAt: string;
}

export interface UserDataResponse {
    users: User[];
    total: number;
    totalPage: number;
    currentPage: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

export type UserQueryParams = {
    search: string;
    page: number;
    limit: number;
}


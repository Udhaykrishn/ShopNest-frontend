
export interface Vendor {
    _id: string;
    username: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    isApproved: boolean;
    createdAt: string;
}

export interface VendorResponse {
    vendors: Vendor[];
    currentPage: number;
    totalPages: number;
}

export interface VendorQueryParams {
    isApproved: boolean;
    isRejected: boolean;
    search?: string;
    page?: number;
    limit?: number;
}
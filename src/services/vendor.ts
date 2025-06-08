import { adminApi as api, vendorApi as vendor } from '@/types';
import type { VendorQueryParams, } from '@/types';



export const vendorApi = {
    getVendors: async (params: Partial<VendorQueryParams>) => {
        const { isApproved, isRejected, search = '', page = 1, limit = 10 } = params;
        const response = await api.get('/vendor', {
            params: { isApproved, isRejected, search, page, limit }
        });
        return response.data;
    },

    approveVendor: async (vendorId: string) => {
        const { data } = await api.patch(`/vendor/approve/${vendorId}`);
        console.log(data)
        return data;
    },

    rejectVendor: async (vendorId: string) => {
        const response = await api.patch(`/vendor/reject/${vendorId}`);
        return response.data;
    },

    blockVendor: async (vendorId: string) => {
        const response = await api.patch(`/vendor/block/${vendorId}`);
        return response.data;
    },

    unblockVendor: async (vendorId: string) => {
        const response = await api.patch(`/vendor/unblock/${vendorId}`);
        return response.data;
    },
};

export const authVendorApi = {
    login: async (payload) => {

        const { data } = await vendor.post("/auth/vendor/login", payload)
        return data
    },
    signup: async (payload) => {
        const { data } = await vendor.post("/auth/vendor/signup", payload)
        return data;
    },

    logout: async () => {
        const { data } = await vendor.post("/auth/vendor/logout")
        return data;
    }
}
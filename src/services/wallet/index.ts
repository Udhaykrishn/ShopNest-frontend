import { api, vendorApi } from "@/types"
export const walletService = {
    getWallet: async (page: object, limit: object) => {
        const { data } = await api.get(`/wallet/user?page=${page}&limit=${limit}`)
        return data.data
    },
    addToUserWallet: async (amount: number) => {
        const { data } = await api.post("/wallet/user", { amount });
        return data;
    },
    addToVendorWallet: async (amount: number) => {
        const { data } = await vendorApi.post("/wallet/vendor", { amount });
        return data
    }
}


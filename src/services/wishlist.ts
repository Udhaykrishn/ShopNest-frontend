import { api } from "@/types"

export const wishlistService = {
    getWishlist: async ({ page, limit }: { page: number; limit: number; }) => {
        const { data } = await api.get("/wishlist", { params: { page, limit } });
        return data.data;
    },
    addToWishlist: async (productId: string) => {
        const { data } = await api.post("/wishlist", { productId });
        return data.data;
    },
    removeWishlist: async (productId: string) => {
        const { data } = await api.delete(`/wishlist/${productId}`)
        return data.data
    }
}
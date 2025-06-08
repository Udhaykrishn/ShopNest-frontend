import { api } from "@/types";

export const cartService = {
    quantityCheck: async (payload: { id: string, sku: string, action: string, quantity: number }) => {
        const { data } = await api.post(`/cart/stock`, {
            sku: payload.sku,
            productId: payload.id,
            action: payload.action,
            quantity: payload.quantity
        })
        return data.data;
    },

    deleteCart: async (payload: { id: string, sku: string }) => {
        const { data } = await api.delete(`/cart`, {
            data: { sku: payload.sku, productId: payload.id, }
        })

        return data.data;
    },

    clearCart: async () => {
        const { data } = await api.post("/cart/clear",{});
        return data;
    },

    cartCount: async (payload: { id: string }) => {
        const { data } = await api.get(`/cart/count/${payload.id}`)
        return data;
    },

    addToCart: async (payload: { id: string, productId: string, sku: string, quantity: number }) => {
        const { data } = await api.post(`/cart/${payload.id}`, {
            sku: payload.sku,
            productId: payload.productId,
            quantity: payload.quantity
        })

        return data;
    }
}
import { vendorApi as api, Product } from "@/types";
import { adminApi } from "@/types"

export const productsApi = {
    getProducts: async (id: string) => {
        const { data } = await api.get(`/products/${id}/vendor`,)
        return data;
    },

    createProduct: async ({ id, payload }: { id: string, payload: any }) => {
        console.log("working", id)
        const { data } = await api.post(`/products/${id}`, payload)
        return data;
    },

    updateProduct: async ({ productId, productData }: { productId: string, productData: Partial<Product> }) => {
        const { data } = await api.put<Product>(`/products/${productId}`, productData)
        return data;
    },

    blockProduct: async (productId: string) => {
        const { data } = await api.patch<Product>(`/products/block/${productId}`, {
            isBlocked: true,
        });
        return data;
    },

    unblockProduct: async (productId: string) => {
        const { data } = await api.patch<Product>(`/products/unblock/${productId}`, {
            isBlocked: false
        })
        return data;
    },

    approveProduct: async (id: string) => {
        const { data } = await adminApi.patch<Product>(`/products/approve/${id}`)
        return data;
    },
    rejectProduct: async (id: string) => {
        console.log("working this reject reject product inside the admin: ")
        const { data } = await adminApi.patch<Product>(`/products/reject/${id}`)
        return data;
    },

    checkStock: async ({ sku, productId, quantity, action }: { sku: string, productId: string, quantity: number, action: string }) => {
        const { data } = await api.post('/products/stock', {
            sku,
            productId,
            action,
            quantity
        })

        return data;
    }
}
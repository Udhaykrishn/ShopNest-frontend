import { vendorApi as api } from "@/types"
interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    isBlocked: boolean;
    isApproved: boolean,
}

export const productApi = {
    getProducts: async (): Promise<Product[]> => {
        try {
            const response = await api.get("/");
            console.log(response.data)
            return response.data?.data?.products
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },

    updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
        try {
            const response = await api.put(`/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },

    blockProduct: async (id: string): Promise<Product> => {
        try {
            const response = await api.post(`/${id}/block`);
            return response.data;
        } catch (error) {
            console.error("Error blocking product:", error);
            throw error;
        }
    },

    unblockProduct: async (id: string): Promise<Product> => {
        try {
            const response = await api.post(`/${id}/unblock`);
            return response.data;
        } catch (error) {
            console.error("Error unblocking product:", error);
            throw error;
        }
    },

    getProductById: async (id: string): Promise<Product> => {
        try {
            const response = await api.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product by ID:", error);
            throw error;
        }
    }
};

import { api } from "@/types";

export const userService = {
    login: async (data) => {
        try {
            const response = await api.get("/auth/users/login", data);
            return response.data
        } catch (error) {
            console.error("Error fetching vendor:", error);
            throw error;
        }
    },

    signup: async (data) => {
        try {
            const response = await api.put(`/auth/users/signup`, data);
            return response.data;
        } catch (error) {
            console.error("Error to signup :", error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const { data } = await api.post('/auth/user/logout')
            return data;
        } catch (error: any) {
            console.error("Error to update profile: ", error);
            throw error;
        }
    },

    updateProfile: async (payload: any) => {
        try {
            const { data } = await api.put('/users', {
                ...payload
            })
            console.log("data getting: ", data)
            return data;
        } catch (error) {
            console.error("Error to update profile: ", error);
            throw error;
        }
    }

    // blockProduct: async (id: string): Promise<Product> => {
    //     try {
    //         const response = await api.post(`/${id}/block`);
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error blocking product:", error);
    //         throw error;
    //     }
    // },

    // unblockProduct: async (id: string): Promise<Product> => {
    //     try {
    //         const response = await api.post(`/${id}/unblock`);
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error unblocking product:", error);
    //         throw error;
    //     }
    // },

    // getProductById: async (id: string): Promise<Product> => {
    //     try {
    //         const response = await api.get(`/${id}`);
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error fetching product by ID:", error);
    //         throw error;
    //     }
    // }


};

import { adminApi } from "@/types"

export const adminService = {
    login: async (payload: { email: string, password: string }) => {
        const { data } = await adminApi.post("/auth/admin/login", payload)
        return data
    },

    logout:async ()=>{
        const {data} = await adminApi.post("/auth/admin/logout")
        return data;
    }
}




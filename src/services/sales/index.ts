import { adminApi } from "@/types"

export const saleService = {
    getAdminDashboard: async (date: object,start:object,end:object) => {
        const { data } = await adminApi.get(`/sales/admin?date=${date}&start=${start}&end=${end}`)
        return data;
    }
}
import { adminApi, api, Coupon, formSchema } from "@/types"
import { z } from "zod";

export const couponService = {
    getAllCoupon: async (page: object, limit: object, search: object) => {
        const { data } = await adminApi.get(`/coupon?page=${page}&limit=${limit}&search=${search}`)
        return data.data;
    },
    addCoupon: async (couponData: z.infer<typeof formSchema>) => {
        const { data } = await adminApi.post("/coupon", { ...couponData })
        return data;
    },
    updateCoupon: async (payload: { couponId: string, couponData: Partial<Coupon> }) => {
        const { data } = await adminApi.patch(`/coupon/${payload.couponId}`, { ...payload.couponData })
        return data.data
    },
    validCoupons: async (amount: number) => {
        const { data } = await api.get("/coupon/users", { params: { amount } });
        return data.data;
    },
    applyCoupon: async (payload: { couponId: string, amount: number }) => {
        const { data } = await api.post(`/coupon/apply/${payload.couponId}`, { amount: payload.amount })
        return data.data;
    },
    removeCoupon: async (couponId: string) => {
        const { data } = await api.delete(`/coupon/remove/${couponId}`)
        return data.data;
    }
}
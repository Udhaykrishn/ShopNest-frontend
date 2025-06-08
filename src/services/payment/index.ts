import { api } from "@/types";

export const paymentService = {
    createOrder: async (amount: string) => {
        console.log("amount is: ", amount)
        const { data } = await api.post("/payment/user", { amount });
        return data;
    },
    retryPayment: async ({ orderId, paymentId }: { orderId: number, paymentId: string }) => {
        const { data } = await api.post(`/payment/retry/${paymentId}`, { orderId })
        return data.data
    }
}   
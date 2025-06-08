import { api, vendorApi } from "@/types"

export const orderService = {
    getOrderById: async (page: number, limit: number, search: number) => {
        const { data } = await api.get('/order', {
            params: {
                page,
                limit,
                search
            }
        })
        return data.data;
    },

    postOrder: async (payload: any) => {
        const { data } = await api.post('/order', payload)

        return data;
    },

    getOneOrder: async (orderId: string) => {
        const { data } = await api.get(`/order/${orderId}`);
        return data;
    },

    changeStatusOrder: async (payload: { orderId: number, sku: string, status: string }) => {
        const { data } = await api.patch(`/order/status/${payload.sku}`, { orderId: payload.orderId, status: payload.status })
        return data.data;
    },

    getOrderByVendor: async (page: object, limit: object, search: object) => {
        const { data } = await vendorApi.get(`/order/vendor?page=${page}&limit=${limit}&search=${search}`);

        return data.data;
    },

    requestReturn: async (payload: { orderId: number, sku: string, reason: string }) => {
        const { data } = await api.post(`/order/return-request/${payload.orderId}`, { sku: payload.sku, reason: payload.reason });
        return data.data;
    },

    getOrderReturnStatus: async (orderId: number) => {
        const { data } = await vendorApi.get(`/order/return-status/${orderId}`)
        return data.data;
    },

    approveReturnRequest: async (payload: { orderId: number, reason: string | undefined, sku: string }) => {
        const { data } = await vendorApi.patch(`/order/return-request/approve/${payload.orderId}`, { sku: payload.sku, reason: payload.reason })
        return data.data;
    },

    rejectReturnRequest: async (payload: { orderId: number, reason: string | undefined, sku: string }) => {
        const { data } = await vendorApi.patch(`/order/return-request/reject/${payload.orderId}`, { sku: payload.sku, reason: payload.reason });
        return data.data;
    },

    cancelOrderItem: async ({ orderId, itemOrderId, reason }) => {
        const { data } = await api.patch(`/order/cancel/${orderId}`, { itemOrderId, reason });
        return data.data;
    },
}


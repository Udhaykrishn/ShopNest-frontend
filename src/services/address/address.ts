import { api } from "@/types"

export const addressService = {
    getAddress: async () => {
        const { data } = await api.get('/address')
        return data.data;
    },
    addAddress: async (payload: any) => {
        const { data } = await api.post('/address', {
            ...payload
        })

        return data.data;
    },
    deleteAddress: async (addressId: string) => {
        const { data } = await api.delete(`/address/${addressId}`)
        return data.data
    },
    updateAddress: async (payload: { addressId: string, data: any }) => {
        const { data } = await api.put(`/address/${payload.addressId}`, {
            ...payload.data
        })
        return data.data
    },
    getOneAddress: async (addressId: string) => {
        const { data } = await api.get(`/address/${addressId}`)
        return data.data
    },

    setDefaultAddress: async (addressId: string) => {
        const { data } = await api.patch(`/address/default/${addressId}`)
        return data.data;
    }

}
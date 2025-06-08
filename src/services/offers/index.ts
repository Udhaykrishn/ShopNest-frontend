import { adminApi } from "@/types"
import { Offer } from "@/types/offer";

export const offerService = {
    offers: async ({ page, limit, search }: { page: object, limit: object, search: object }) => {
        const { data } = await adminApi.get(`/offers?page=${page}&limit=${limit}&search=${search}`)
        return data;
    },
    addOffer: async (offerData: Partial<Offer>) => {
        const { data } = await adminApi.post("/offers", offerData)
        return data;
    },
    editOffer: async ({ offerId, offerData }: { offerId: string, offerData: Partial<Offer> }) => {
        const { data } = await adminApi.patch(`/offers/${offerId}`, offerData);
        return data;
    }
}
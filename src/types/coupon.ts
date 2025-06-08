import * as z from 'zod';

export interface Coupon {
    _id: string;
    name: string;
    min_price: number;
    offerPrice: number;
    expireOn: string;
    isBlocked: boolean;
    isExpired: boolean;
}

export const formSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    offerPrice: z.number().min(1, 'Offer price must be at least 1'),
    min_price: z.number().min(1, 'Minimum price must be at least 1'),
    expireOn: z.date().refine((date) => date > new Date(), 'Expiry date must be in the future'),
});
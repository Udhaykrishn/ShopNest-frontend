import { couponService } from "@/services/coupon"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"

// export const useCouponQuery = (page: number, limit: number, search: string) => {
//     return useQuery({
//         queryKey: ["coupon", page, limit, search],
//         queryFn: () => couponService.getAllCoupon(page, limit, search),
//         placeholderData: (prev) => prev
//     })
// }

export const useValidCouponQuery = (amount: number) => {
    return useSuspenseQuery({
        queryKey: ["valid-coupon", amount],
        queryFn: () => couponService.validCoupons(amount),
    })
}

export const useCouponMutation = () => {

    const query = useQueryClient();

    const handleQuery = () => {
        query.invalidateQueries({ queryKey: ["coupon"] })
    }

    const handleUserquery = () => {
        query.invalidateQueries({ queryKey: ["valid-coupon"] })
    }

    const addCoupon = useMutation({
        mutationFn: couponService.addCoupon,
        onSuccess: () => {
            handleQuery()
        }
    })

    const editCoupon = useMutation({
        mutationFn: couponService.updateCoupon,
        onSuccess: () => {
            handleQuery();
        }
    })

    const applyCoupon = useMutation({
        mutationFn: couponService.applyCoupon,
        onSuccess: () => {
            handleUserquery()
        }
    })

    const removeCoupon = useMutation({
        mutationFn: couponService.removeCoupon,
        onSuccess: () => {
            handleUserquery()
        }
    })


    return { addCoupon, editCoupon, applyCoupon, removeCoupon }
}
import { router } from "@/router"
import { paymentService } from "@/services/payment"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export const usePayment = () => {
    const queryClient = useQueryClient()

    const createOrder = useMutation({
        mutationFn: paymentService.createOrder,
        retry: false,
        onSettled: () => {
            queryClient.invalidateQueries();
            queryClient.invalidateQueries({ queryKey: ["orders"] })
        }
    })

    const retryPayment = useMutation({
        mutationFn: paymentService.retryPayment,
        retry: false,
        onSettled: () => {
            router.load()
            queryClient.invalidateQueries();
            queryClient.invalidateQueries({ queryKey: ["orders"] })
        }
    })

    return { createOrder, retryPayment }
}

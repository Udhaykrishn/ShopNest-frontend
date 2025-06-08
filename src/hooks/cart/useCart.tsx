import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cartService } from "@/services/cart/cart";
import { api } from "@/types";
import { useCartStore } from "@/stores/cart/useCartStore";


export const useCartQuery = () => {
    return useQuery({
        queryKey: ["carts"],
        queryFn: async () => {
            const { data } = await api.get(`/cart`)
            return data;
        }

    })
}

export const useCartMutation = () => {

    const { toast } = useToast()
    const { setCartLength } = useCartStore()

    const queryClient = useQueryClient()

    const invalidCarts = async () => {
        await queryClient.invalidateQueries({ queryKey: ["carts"] });
    };

    const handleError = (error: any, action?: string) => {
        const errorMessage = error?.response?.data?.message || error?.message || action;
        toast({
            title: `${errorMessage}`,
            variant: "default",
        });
    };

    const plusQuantity = useMutation({
        mutationFn: cartService.quantityCheck,
        onSuccess: () => {
            invalidCarts()
        },
        onError: (error) => handleError(error)
    })

    const clearCart = useMutation({
        mutationFn:cartService.clearCart,
        onSuccess:()=>{
            invalidCarts();
        },
        onError:(error)=> handleError(error)
    })

    const minusQuantity = useMutation({
        mutationFn: cartService.quantityCheck,
        onSuccess: () => {
            invalidCarts()
        },
        onError: (error) => handleError(error)
    })

    const deleteCart = useMutation({
        mutationFn: cartService.deleteCart,
        onSuccess: () => {
            invalidCarts()
            toast({
                title: "Product remove success",
                description: "Product removed from cart",
                variant: "default"
            })
        },
        onError: (error) => handleError(error, "cart deleting")
    })


    const addToCart = useMutation({
        mutationFn: cartService.addToCart,
        onSuccess: (data) => {
            invalidCarts()
            setCartLength(data.data.items.length)
        },
        onError: (error) => handleError(error, "cart adding")
    })


    return { plusQuantity, minusQuantity, deleteCart, addToCart,clearCart }
}
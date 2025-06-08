import { wishlistService } from "@/services/wishlist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWishlistQuery = (page: number, limit: number) => {
    return useQuery({
        queryKey: ["wishlist", page, limit],
        queryFn: () => wishlistService.getWishlist({ page, limit }),
        placeholderData: (page) => page
    })
}

export const useWishlistMutation = () => {
    const query = useQueryClient()
    const addToWishlist = useMutation({
        mutationFn: wishlistService.addToWishlist,
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ["wishlist"] });
        }
    })

    const removeWishlist = useMutation({
        mutationFn: wishlistService.removeWishlist,
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ["wishlist"] });
        }
    })

    return { addToWishlist, removeWishlist }
}
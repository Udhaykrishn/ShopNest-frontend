import { offerService } from "@/services/offers"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export const useOfferMutation = () => {

    const query = useQueryClient()
    const handleQueryInvalidation = () => {
        query.invalidateQueries({ queryKey: ["offers"] })
    }


    const addOffer = useMutation({
        mutationFn: offerService.addOffer,
        onSuccess: () => {
            handleQueryInvalidation()
        }
    })

    const editOffer = useMutation({
        mutationFn: offerService.editOffer,
        onSuccess: () => {
            handleQueryInvalidation();
        }
    })


    return { addOffer, editOffer }

}
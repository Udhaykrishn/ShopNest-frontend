import { addressService } from "@/services/address/address"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../use-toast"

export const useAddressQuery = () => {
    return useQuery({
        queryKey: ["address"],
        queryFn: addressService.getAddress
    })
}

export const useAddressMutation = () => {
    const query = useQueryClient()

    const { toast } = useToast()

    const handleQueryInvalidation = () => {
        query.invalidateQueries({ queryKey: ["address"] })
    }

    const handleShowError = (error: any, message: string) => {
        const errors = error.response.data.errors
        if (errors) {
            toast({
                title: message,
                description: errors[0]?.errors[0] || `Failed to ${message}`,
                variant: "destructive"
            })
        } else {
            toast({
                title: message,
                description: error.response.data.message || `Failed to ${message}`,
                variant: "destructive"
            })
        }
    }
    const handleShowSuccess = (message: string) => {
        toast({
            title: message,
            description: `${message} is successfully done`
        })
    }

    const deleteAddress = useMutation({
        mutationFn: addressService.deleteAddress,
        onSuccess: () => {
            handleQueryInvalidation()
            handleShowSuccess("Delete address")
        },
        onError: (error) => handleShowError(error, "delete address")

    })

    const addAddress = useMutation({
        mutationFn: addressService.addAddress,
        onSuccess: () => {
            handleQueryInvalidation()
            handleShowSuccess("Add address")
        },
        onError: (error) => handleShowError(error, "add address")
    })

    const updateAddress = useMutation({
        mutationFn: addressService.updateAddress,
        onSuccess: () => {
            handleQueryInvalidation()
            handleShowSuccess("Update address")
        },
        onError: (error) => handleShowError(error, "update address")
    })
    
    const setDefaultAddress = useMutation({
        mutationFn: addressService.setDefaultAddress,
        onSuccess: () => {
            handleQueryInvalidation()
            handleShowSuccess("Set default address")
        },
        onError: (error) => handleShowError(error, "set default address")
    })

    return { deleteAddress, addAddress, updateAddress, setDefaultAddress }
}
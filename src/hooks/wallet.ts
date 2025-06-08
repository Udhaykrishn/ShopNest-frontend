import { walletService } from "@/services/wallet";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useWallet = ()=>{
    const query = useQueryClient();
    const addToUserWallet = useMutation({
        mutationFn:walletService.addToUserWallet,
        onSuccess:()=>{
            query.invalidateQueries({queryKey:["user-wallet"]});
        }   
    })

    const addToVendorWallet = useMutation({
        mutationFn:walletService.addToVendorWallet,
        onSuccess:()=>{
            query.invalidateQueries({queryKey:["vendor-wallet"]})
        }
    })


    return {addToUserWallet,addToVendorWallet}
}



import { userService } from "@/services/user";
import { api } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { router } from "@/router";
import {authStore} from "@/stores/user/userAuthStore"

export const useProfile = () => {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => {
            const { data } = await api.get("/auth/user/profile")
            return data;
        }
    })
}

export const useUserMutation = () => {
    const {logout:userLogout} = authStore.getState()
    const { toast } = useToast()
    const query = useQueryClient()
    const updateProfile = useMutation({
        mutationFn: userService.updateProfile,
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ["user-profile"] })
        },
        onError: (error: any) => {
            const errors = error.response.data.errors
            if (errors) {
                const message = errors[0].errors[0]
                toast({
                    title: "Validation Error",
                    description: message,
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Failed to update",
                    description: error.response?.data?.message || "something went wrong on update profile",
                    variant: "destructive"
                })
            }
        }
    })

    const logout = useMutation({
        mutationFn: userService.logout,
        onSuccess() {
            userLogout();           
            router.navigate({ to: "/login" })
            toast({
                title: "Logout",
                description: "Logout successfully done",
                variant: "default"
            })
        },
    })

    return { updateProfile, logout }
}
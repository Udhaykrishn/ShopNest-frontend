import { api } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const UserProfile = () => {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => {
            const { data } = await api.get("/auth/user/profile")
            return data;
        }
    })
}
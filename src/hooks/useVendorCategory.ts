import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useVendorCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await axios.get("http://shopnest.zapto.org/api/categorys")
            return data;
        }
    });
};
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAllProducts = (query: string = "") => {
    return useQuery({
        queryKey: ["all-products", query],
        queryFn: async () => {

            const url = query ? `https://shopnest.zapto.org/api/products?${query}` : `https://shopnest.zapto.org/api/products`
            const { data } = await axios.get(url)
            return data.data;
        }
    });
};
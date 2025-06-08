import { categoryService } from "@/services/all-categorys"
import { useQuery } from "@tanstack/react-query";

export const useAllCategories = () => {
    return useQuery({
        queryKey: ["all-categorys"],
        queryFn: categoryService.getCategories
    });
};


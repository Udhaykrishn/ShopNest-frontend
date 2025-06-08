import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import categoryService from "@/services/category";
import { useToast } from "./use-toast";

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn:  categoryService.getCategories
    });
};

export const useCategoryMutations = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast(); 

    const invalidateCategories = () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
    };

    const handleError = (error: any, action: string) => {
        const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
        toast({
            title: `Error in ${action}`,
            description: errorMessage,
            variant: "destructive",
        });
    };

    const createCategory = useMutation({
        mutationFn: categoryService.createCategory,
        onSuccess: () => {
            invalidateCategories();
            toast({
                title: "Success",
                description: "Category created successfully",
            });
        },
        onError: (error) => handleError(error, "creating category")
    });

    const updateCategory = useMutation({
        mutationFn: categoryService.updateCategory,
        onSuccess: () => {
            invalidateCategories();
            toast({
                title: "Success",
                description: "Category updated successfully",
            });
        },
        onError: (error) => handleError(error, "updating category")
    });

    const blockCategory = useMutation({
        mutationFn: (id: string) => categoryService.blockCategory(id),
        onSuccess: () => {
            invalidateCategories();
            toast({
                title: "Success",
                description: "Category blocked successfully",
            });
        },
        onError: (error) => handleError(error, "blocking category")
    });

    const unblockCategory = useMutation({
        mutationFn: (id: string) => categoryService.unblockCategory(id),
        onSuccess: () => {
            invalidateCategories();
            toast({
                title: "Success",
                description: "Category unblocked successfully",
            });
        },
        onError: (error) => handleError(error, "unblocking category")
    });

    return {
        createCategory,
        updateCategory,
        blockCategory,
        unblockCategory
    };
};

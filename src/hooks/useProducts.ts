import { productsApi } from "@/services/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export const useProducts = (id: string) => {
    return useQuery({
        queryKey: ['all-products'],
        queryFn: () => productsApi.getProducts(id),
        refetchOnWindowFocus: false,
        retry: 2
    })
}

export const useProductMutations = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const invalidateProduct = () => {
        queryClient.invalidateQueries({ queryKey: ["all-products"] });
    };

    const blockProduct = useMutation({
        mutationFn: productsApi.blockProduct,
        onSuccess: () => {
            toast({
                title: "Block Product",
                description: "Product blocked successfully",
                variant: "default",
            });
            invalidateProduct();
        },
    });

    const unblockProduct = useMutation({
        mutationFn: productsApi.unblockProduct,
        onSuccess: () => {
            toast({
                title: "Unblock Product",
                description: "Product unblocked successfully",
                variant: "default",
            });
            invalidateProduct();
        },
    });

    const updateProduct = useMutation({
        mutationFn: productsApi.updateProduct,
        onSuccess: (data) => {
            toast({
                title: "Update Product",
                description: "Product updated successfully",
                variant: "default",
            });
            invalidateProduct();
            queryClient.invalidateQueries({queryKey: ["products", data._id]})
        },
        onError: (error) => {
            console.log("error is: ", error)
        }
    });

    const createProduct = useMutation({
        mutationFn: productsApi.createProduct,
        onSuccess: () => {
            toast({
                title: "Create Product",
                description: "Product created successfully",
                variant: "default",
            });
            invalidateProduct();
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response.data.message || "Failed to create product.",
                variant: "destructive"
            });
        }
    });

    const approveProduct = useMutation({
        mutationFn: productsApi.approveProduct,
    });

    const rejectProduct = useMutation({
        mutationFn: productsApi.rejectProduct,
    });

    const stockCheck = useMutation({
        mutationFn: productsApi.checkStock
    })

    return {
        blockProduct,
        unblockProduct,
        updateProduct,
        createProduct,
        approveProduct,
        rejectProduct,
        stockCheck
    };
};
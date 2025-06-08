import { orderService } from "@/services/orders";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { router } from "@/router";
import { api } from "@/types";

export const useOrderQuery = ({ page, limit, search }) => {
    return useQuery({
        queryKey: ["orders", page, limit, search],
        queryFn: () => orderService.getOrderById(page, limit, search),
        placeholderData: (prev) => prev
    })
}

export const useOrderByVendorQuery = ({ page, limit, search }: { page: object, limit: object, search: object }) => {
    return useSuspenseQuery({
        queryKey: ["vendor-orders"],
        queryFn: () => orderService.getOrderByVendor(page, limit, search)
    })
}

export const useDownloadInvoice = ({ orderId }: { orderId: number }) => {
    return useQuery({
        queryKey: ["invoice"],
        queryFn: async () => {
            try {
                const { data } = await api.get(`/order/invoice/${orderId}`, {
                    responseType: 'blob',
                    headers: {
                        "Accept": "application/pdf",
                    },
                });

                const blob = data instanceof Blob ? data : new Blob([data], { type: "application/pdf" });

                if (blob.type === "application/json") {
                    const text = await blob.text();
                    console.error("Backend error response:", text);
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.message || "Server returned an error");
                }

                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = `invoice-${orderId}.pdf`;
                document.body.appendChild(link);
                link.click();

                link.remove();
                window.URL.revokeObjectURL(url);

                return { success: true };
            } catch (error: any) {
                console.error("Invoice download error:", {
                    message: error.message,
                    status: error.response?.status,
                    headers: error.response?.headers,
                    data: error.response?.data,
                });
                throw new Error(error.message || "Failed to download invoice");
            }
        },
        enabled: false,
        retry: false,
    });
}

export const useOrderMutation = () => {
    const { toast } = useToast()
    const query = useQueryClient()
    const handleQueryInvalidate = () => {
        query.invalidateQueries({ queryKey: ["orders"] })
    }
    const postOrder = useMutation({
        mutationFn: orderService.postOrder,
        onSuccess: () => {
            handleQueryInvalidate();
        },
        onError: (error: any) => {
            toast({
                title: error.response.data.message,
                variant: "destructive"
            })
        }
    })

    const handleInvalidateQueryAndRouter = async (data) => {
        handleQueryInvalidate()
        query.invalidateQueries({ queryKey: ["orders", data.orderId] })
        await router.invalidate({
            sync: true,
            filter: (route) => {
                return route.routeId === "/_authenticated/profile/orders/$id" && route.params.id === data.orderId
            }
        })
    }


    const statusChangeOrder = useMutation({
        mutationFn: orderService.changeStatusOrder,
        onSuccess: async (data) => {
            console.log("order status and order id is: ", data.status, data.orderId)
            handleQueryInvalidate();
            query.invalidateQueries({ queryKey: ["vendor-orders"] })
            query.invalidateQueries({ queryKey: ["orders", data.orderId] })

            await router.invalidate({
                sync: true,
                filter: (route) => {
                    return route.routeId === "/_authenticated/profile/orders/$id" && route.params.id === data.orderId
                }
            })

            await router.invalidate({
                sync: true,
                filter: (route) => {
                    return route.routeId === "/vendor/_auth/orders/"
                }
            })

            await router.invalidate({
                sync: true,
                filter: (route) => {
                    return route.routeId === "/_authenticated/profile/orders/$id" && route.params.id === data.orderId
                }
            })
        }
    })

    const cancelPerItemOrder = useMutation({
        mutationFn: orderService.cancelOrderItem,
        onSuccess: async (data) => {
            handleInvalidateQueryAndRouter(data)
        }
    })

    const orderReturnMutation = useMutation({
        mutationFn: orderService.requestReturn,
        onSuccess: async (data) => {
            handleInvalidateQueryAndRouter(data)
        }
    })

    const orderReturnApproveMutation = useMutation({
        mutationFn: orderService.approveReturnRequest,
        onSuccess: async (data) => {
            handleInvalidateQueryAndRouter(data)
        }
    })

    const orederReturnRejectMutation = useMutation({
        mutationFn: orderService.rejectReturnRequest,
        onSuccess: async (data) => {
            handleInvalidateQueryAndRouter(data)
        }
    })

    const downloadInvoice = useQuery({
        queryKey: ["invoice"],
        queryFn: async () => {
            try {
                const { data } = await api.get("/order/invoice", {
                    responseType: 'blob',
                    headers: {
                        "Accept": "application/pdf",
                    },
                });

                const blob = data instanceof Blob ? data : new Blob([data], { type: "application/pdf" });

                if (blob.type === "application/json") {
                    const text = await blob.text();
                    console.error("Backend error response:", text);
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.message || "Server returned an error");
                }

                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = 'invoice.pdf';
                document.body.appendChild(link);
                link.click();

                link.remove();
                window.URL.revokeObjectURL(url);

                return { success: true };
            } catch (error: any) {
                
                throw new Error(error.message || "Failed to download invoice");
            }
        },
        enabled: false,
        retry: false,
    });

    return { postOrder, orederReturnRejectMutation, cancelPerItemOrder, orderReturnApproveMutation, downloadInvoice, statusChangeOrder, orderReturnMutation }
}
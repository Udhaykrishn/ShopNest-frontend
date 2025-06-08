import { vendorApi, authVendorApi } from '@/services';
import { VendorQueryParams } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useVendorAuthStore } from "@/stores/vendor/vendorAuthStore";
import { toast } from './use-toast';
import { otpStore } from '@/stores/otp';
import { router } from '@/router';

export const useVendors = (params: Partial<VendorQueryParams>) => {
    return useQuery({
        queryKey: ['vendors',params],
        queryFn: () => vendorApi.getVendors(params),
        placeholderData: (prev) => prev
    });
};

export const useVendorMutations = (params:any) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { setEmail } = otpStore();
    const { setAuth, logout } = useVendorAuthStore();

    const invalidateVendors = () => {
        queryClient.invalidateQueries({ queryKey: ['vendors',params] });
    };

    const signupVendor = useMutation({
        mutationFn: authVendorApi.signup,
        onSuccess: (data) => {
            setEmail(data.data);
            navigate({ to: "/vendor/otp" });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Failed to Sign Up",
                description: error?.response?.data?.message || "Failed to sign up"
            });
            console.log(error?.response?.data?.message);
        }
    });

    const loginVendor = useMutation({
        mutationFn: authVendorApi.login,
        onSuccess: (data) => {
            const {avatar,_id,username,email,phone,role,createdAt} = data.data
            setAuth({ isAuthenticated: true,vendor:{avatar,role,id:_id,username,email,phone,createdAt} });
            navigate({ to: "/vendor" });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Failed to Login",
                description: error?.response?.data?.message || "Failed to login"
            });
            console.log(error?.response?.data?.message);
        }
    });

    const logoutVendor = useMutation({
        mutationFn: authVendorApi.logout,
        onSuccess: () => {
            logout();
            router.navigate({ to: "/vendor/login" });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Failed to Login",
                description: error?.response?.data?.message || "Failed to login"
            });
        }
    })

    const rejectVendor = useMutation({
        mutationFn: vendorApi.rejectVendor,
        onSuccess: () => {
            invalidateVendors();
            toast({
                variant: "default",
                title: "Vendor Rejected",
                description: "The vendor has been successfully rejected."
            });
        }
    });

    const approveVendor = useMutation({
        mutationFn: vendorApi.approveVendor,
        onSuccess: () => {
            toast({
                variant: "default",
                title: "Vendor Approved",
                description: "The vendor has been successfully approved."
            });
            invalidateVendors();
        },
    });

    const blockVendor = useMutation({
        mutationFn: vendorApi.blockVendor,
        onSuccess: () => {
            invalidateVendors();
            toast({
                variant: "default",
                title: "Vendor Blocked",
                description: "The vendor has been successfully blocked."
            });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Failed to Block Vendor",
                description: "An error occurred while blocking the vendor."
            });
        }
    });

    const unblockVendor = useMutation({
        mutationFn: vendorApi.unblockVendor,
        onSuccess: () => {
            invalidateVendors();
            toast({
                variant: "default",
                title: "Vendor Unblocked",
                description: "The vendor has been successfully unblocked."
            });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Failed to Unblock Vendor",
                description: "An error occurred while unblocking the vendor."
            });
        }
    });

    return {
        approveVendor,
        blockVendor,
        unblockVendor,
        rejectVendor,
        loginVendor,
        signupVendor,
        logoutVendor
    };
};

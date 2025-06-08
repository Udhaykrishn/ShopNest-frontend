import { vendorApi as api } from "@/types";

export const vendorApi = () => {
    const loginVendor = async (payload: any) => {
        const { data } = await api.post("/auth/vendor/login", payload)
        return data;
    }

    const signupVendor = async (payload: any) => {
        const { data } = await api.post("/auth/vendor/signup", payload)
        return data;
    }


    return { loginVendor, signupVendor }
}
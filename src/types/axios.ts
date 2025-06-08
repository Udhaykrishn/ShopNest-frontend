import axios from "axios";
import { router } from "@/router"
import { useAuthStore } from "@/stores/user/userAuthStore"
import { useAdminState } from "@/stores/admin/adminAuthStore";
import { useVendorAuthStore } from "@/stores/vendor/vendorAuthStore";
import { env } from "@/lib/env.lib";
const { logout } = useAuthStore.getState()
const {logout:adminLogout} = useAdminState.getState() 
const {  logout:vendorLogout } = useVendorAuthStore.getState()

const BACKEND_URL = env.VITE_BACKEND_URI

console.log(BACKEND_URL)    

export const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    return config;
},
    (error) => {
        console.log("coming from interceptores", error.response)
        return Promise.reject(error)
    }
)
api.interceptors.response.use(
    (res) => res,
    (error) => {
        console.log("coming from interceptores", error.response)
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            logout()
            console.log("working this line") 
            router.navigate({
                to: "/login"
            })

        }
        return Promise.reject(error)
    }
)

export const adminApi = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
})

adminApi.interceptors.request.use((config) => {
    return config;
},
    (error) => {
        console.log("coming from interceptores", error.response)
        return Promise.reject(error)
    }
)

adminApi.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            console.log("working this code", error.response)
            adminLogout()
            router.navigate({ to: "/admin/login" })
        }
        return Promise.reject(error)
    }
)


export const vendorApi = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
})

vendorApi.interceptors.request.use((config) => {
    return config;
},
    (error) => {
        console.log("coming from interceptores", error.response)
        return Promise.reject(error)
    }
)

vendorApi.interceptors.response.use(
    (res) => res,
    (error) => {
        console.log()
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            vendorLogout()
            router.navigate({
                to: "/vendor/login"
            })
        }
        return Promise.reject(error)
    }
)

import { create } from "zustand"

type IVendor = {
    username:string;
    role:string;
    id:string;
    email:string;
    avatar:string;
    phone:string;
    createdAt:string | null;
}


export interface VendorAuthState {
    vendor:IVendor | null,
    isAuthenticated:boolean,
    setAuth: (payload: { isAuthenticated:boolean,vendor:IVendor}) => void;
    logout: () => void;
}

export const vendorAuthStore = create<VendorAuthState>((set) => ({
    isAuthenticated: false,
    vendor:{
        username:"",
        role:"",
        id:"",
        email:"",
        avatar:"",
        phone:"",
        createdAt:null
    },
    setAuth: ({ isAuthenticated,vendor}) => {
        set({ isAuthenticated,vendor })
    },
    logout: () => {
        set({ isAuthenticated:false,vendor:null })
    }
}))

export const useVendorAuthStore = vendorAuthStore;
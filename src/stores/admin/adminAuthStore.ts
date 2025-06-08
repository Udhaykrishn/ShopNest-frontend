import {create} from "zustand"

export interface AdminAuthStore{
    isAuthenticated:boolean,
    setAuth:(payload:{isAuthenticated:boolean})=>void;
    logout:()=>void;
}

export const authAdminState = create<AdminAuthStore>((set)=>({
    isAuthenticated:false,
    setAuth:({isAuthenticated})=> set({isAuthenticated}),
    logout:()=>set({isAuthenticated:false})
}))

export const useAdminState = authAdminState
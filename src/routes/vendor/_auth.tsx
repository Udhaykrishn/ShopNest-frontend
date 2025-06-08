import { vendorApi } from '@/types'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/_auth')({
    beforeLoad: async ({ context }) => {
        if(!context.vendor.isAuthenticated){
            try {
                const {data} = await vendorApi.get("/auth/vendor/profile",{withCredentials:true});

                const {username,avatar,phone,email,createdAt,_id,role} = data.data;

                context.vendor.setAuth({
                    isAuthenticated:true,
                    vendor:{
                        username,
                        avatar,
                        phone,
                        email,
                        createdAt,
                        id:_id,
                        role,
                    }
                })
            } catch (err) {
                throw redirect({to:"/vendor/login"});
            }
        }
    }
    
})


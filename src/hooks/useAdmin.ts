import { useMutation } from '@tanstack/react-query';
import { adminService } from '@/services';
import { useAdminState } from '@/stores/admin/adminAuthStore';


export const useAdminMutation = () => {
    const { logout,setAuth:adminLogin } = useAdminState.getState()



    const loginAdmin = useMutation({
        mutationFn: adminService.login,
        onSuccess() {
            adminLogin({isAuthenticated:true})
        },
    })

    const logoutAdmin = useMutation({
        mutationFn:adminService.logout,
        onSuccess:()=>{
            logout()
        }
    })




    return {
        loginAdmin,
        logoutAdmin
    };
};
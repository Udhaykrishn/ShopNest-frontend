import { RouterProvider } from '@tanstack/react-router';
import { authStore, } from './stores/user/userAuthStore';
import { router } from "./router";
import { useVendorAuthStore } from './stores/vendor/vendorAuthStore';
import { useAdminState } from './stores/admin/adminAuthStore';
import { useQueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import LoadingSpinner from './components/Loader';

export const App = () => {

    const auth =  authStore();
    const vendor = useVendorAuthStore();
    const admin = useAdminState()
    const queryClient = useQueryClient()

    return (
        <Suspense fallback={<LoadingSpinner />}>
          <RouterProvider router={router} context={{ auth, vendor, admin, queryClient }} />
        </Suspense>
      )
}



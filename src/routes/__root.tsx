import { NotFoundPage } from '@/components/page-not-found'
import DefaultLayout from '@/layout/defaultLayout'
import { AdminAuthStore } from '@/stores/admin/adminAuthStore'
import { AuthState } from '@/stores/user/userAuthStore'
import { VendorAuthState } from '@/stores/vendor/vendorAuthStore'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext } from '@tanstack/react-router'

interface RouterContext {
    auth: AuthState,
    vendor: VendorAuthState,
    admin: AdminAuthStore,
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    notFoundComponent: NotFoundPage,
    component: DefaultLayout, 
})



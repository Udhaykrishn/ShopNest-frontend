import { createRouter } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import { useAuthStore } from '@/stores/user/userAuthStore';
import { NotFoundPage } from '@/components/page-not-found';
import { useVendorAuthStore } from '@/stores/vendor/vendorAuthStore';
import { useAdminState } from '@/stores/admin/adminAuthStore';
import { QueryClient } from '@tanstack/react-query';

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router,
    }
}

export const router = createRouter({
    defaultNotFoundComponent: NotFoundPage,
    routeTree,
    context: {
        auth: useAuthStore.getState(),
        vendor: useVendorAuthStore.getState(),
        admin: useAdminState.getState(),
        queryClient: new QueryClient
    }
})




import { OrdersList } from '@/components/orders/order-lists'
import { UserDashboardLayout } from '@/components/users/layout/layout'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/profile/orders/')({
    component: () => (
        <UserDashboardLayout>
            <OrdersList />
        </UserDashboardLayout>
    ),
})

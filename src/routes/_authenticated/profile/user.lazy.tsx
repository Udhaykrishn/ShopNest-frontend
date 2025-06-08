import { UserDashboardLayout } from '@/components/users/layout/layout'
import { UserDashboard } from '@/components/users/profile/user-profile'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/profile/user')({
    component: () => (
        <UserDashboardLayout>
            <UserDashboard />
        </UserDashboardLayout>
    ),
})

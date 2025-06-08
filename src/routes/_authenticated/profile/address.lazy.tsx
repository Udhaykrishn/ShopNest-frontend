import { AddressComponent } from '@/components/address/address'
import { UserDashboardLayout } from '@/components/users/layout/layout'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/profile/address')({
    component: () => <UserDashboardLayout><AddressComponent /></UserDashboardLayout>,
})



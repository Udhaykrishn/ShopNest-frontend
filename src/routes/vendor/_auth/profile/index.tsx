import { VendorDashboardLayout } from '@/components/vendors/layout/vendor-dashboard.layout'
import { VendorProfile } from '@/components/vendors/profile/vendor-profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/_auth/profile/')({
  component: ()=><VendorDashboardLayout><VendorProfile/></VendorDashboardLayout>,
})
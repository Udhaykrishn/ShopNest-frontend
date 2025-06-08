import { createFileRoute } from '@tanstack/react-router'
import { VendorDashboardLayout } from '@/components/vendors/layout/vendor-dashboard.layout'
import { DashboardContent } from '@/components/vendors/dashboard-content'

export const Route = createFileRoute('/vendor/_auth/')({
  component: VendorDashboard,
})

function VendorDashboard() {
  return (
    <VendorDashboardLayout>
      <DashboardContent />
    </VendorDashboardLayout>
  )
}

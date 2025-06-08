import { AdminDashboardLayout } from '@/components/admin/layout/admin-dashboard.layout'

import { createFileRoute } from '@tanstack/react-router'
import { VendorTable } from '@/components/admin/vendors/vendor-table'

export const Route = createFileRoute('/admin/_procted/vendor/')({
  component: () => (
    <AdminDashboardLayout>
      <VendorTable />
    </AdminDashboardLayout>
  ),
})

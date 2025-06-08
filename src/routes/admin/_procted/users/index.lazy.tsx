import { UserManagement                     } from '@/components/admin/users/user-mangement'
import { createLazyFileRoute } from '@tanstack/react-router'
import { AdminDashboardLayout } from '@/components/admin/layout/admin-dashboard.layout'

export const Route = createLazyFileRoute('/admin/_procted/users/')({
  component: () => (
    <AdminDashboardLayout>
      <UserManagement />
    </AdminDashboardLayout>
  ),
})

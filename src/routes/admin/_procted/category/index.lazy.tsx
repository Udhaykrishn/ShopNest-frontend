import { AdminDashboardLayout } from '@/components/admin/layout/admin-dashboard.layout'
import { createLazyFileRoute } from '@tanstack/react-router'
import CategoryManagement from '@/components/admin/categorys/category-mangement'

export const Route = createLazyFileRoute('/admin/_procted/category/')({
  component: () => (
    <AdminDashboardLayout>
      <CategoryManagement />
    </AdminDashboardLayout>
  ),
})

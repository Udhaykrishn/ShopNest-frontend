import { createLazyFileRoute } from '@tanstack/react-router'
import { AdminDashboardLayout } from '@/components/admin/layout/admin-dashboard.layout';
import ProductApprove from "@/components/admin/product/product-appove"


export const Route = createLazyFileRoute('/admin/_procted/product/')({
    component: () => <AdminDashboardLayout><ProductApprove /></AdminDashboardLayout>
})

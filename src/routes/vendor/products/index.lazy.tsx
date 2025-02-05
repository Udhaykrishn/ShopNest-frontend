import  {AdminDashboardLayout}  from '@/components/vendors/layout/vendor-dashboard.layout';
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/vendor/products/')({
    component: Products,
})

function Products() {
    return (
        <AdminDashboardLayout>
            <div>Hello "/vendor/products/"!</div>
        </AdminDashboardLayout>
    );
}



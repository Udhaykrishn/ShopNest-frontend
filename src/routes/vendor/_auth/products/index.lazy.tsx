import { VendorDashboardLayout } from '@/components/vendors/layout/vendor-dashboard.layout'
import ProductManagement from '@/components/vendors/products/ProductMangement'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/vendor/_auth/products/')({
  component: Products,
})

function Products() {
  return (
    <VendorDashboardLayout>
      <ProductManagement />
    </VendorDashboardLayout>
  )
}

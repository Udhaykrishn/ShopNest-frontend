import { VendorOrderList } from '@/components/orders/vendor-order-list'
import { VendorDashboardLayout } from '@/components/vendors/layout/vendor-dashboard.layout'
import { orderService } from '@/services/orders'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/vendor/_auth/orders/')({

  validateSearch: (search) => {
    return {
      page: search.page || 1,
      limit: search.limit || 5,
      search: search.search || ""
    }
  },
  loaderDeps: ({ search: { page, limit, search } }) => {
    return { page, limit, search }
  },
  loader: async ({ context, deps: { page, limit, search } }) => {
    const { queryClient } = context

    const data = await queryClient.fetchQuery({
      queryKey: ["vendor-orders", { page, limit, search }],
      queryFn: () => orderService.getOrderByVendor(page, limit, search)
    })

    return data;
  },
  component: VendorOrderPage
})

function VendorOrderPage() {
  const { data, total } = Route.useLoaderData()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)

  const fetchOrders = async (page: any, limit: any,search:any) => {
    const result = await orderService.getOrderByVendor(page, limit,search)
    return { data: result.data, total: result.total }
  }

  return (
    <VendorDashboardLayout>
      <VendorOrderList
        initialOrders={data}
        fetchOrders={fetchOrders}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        total={total}
      />
    </VendorDashboardLayout>
  )
}
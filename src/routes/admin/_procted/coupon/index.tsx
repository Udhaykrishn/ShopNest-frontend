import { CouponManagement } from '@/components/admin/coupon'
import { AdminDashboardLayout } from '@/components/admin/layout/admin-dashboard.layout'
import { couponService } from '@/services/coupon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_procted/coupon/')({
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
    const { queryClient } = context;


    const data = await queryClient.fetchQuery({
      queryKey: ["coupons", { page, limit, search }],
      queryFn: () => couponService.getAllCoupon(page, limit, search)
    })

    return data;

  },
  component: RouteComponent
})



function RouteComponent() {
  const data = Route.useLoaderData();
  const { limit, search,page } = Route.useSearch()

  return <AdminDashboardLayout><CouponManagement data={data} page={page} limit={limit} search={search} /></AdminDashboardLayout>
}
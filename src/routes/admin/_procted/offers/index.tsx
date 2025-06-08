import { AdminDashboardLayout } from '@/components/admin/layout/admin-dashboard.layout'
import { OfferManagement } from '@/components/admin/offers'
import categoryService from '@/services/category'
import { offerService } from '@/services/offers'
import { loaderDeps, validateSearch } from '@/utils/router-props'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_procted/offers/')({
  validateSearch,
  loaderDeps,
  loader: async ({ context, deps: { page, limit, search } }) => {
    const { queryClient } = context
    const data = await queryClient.fetchQuery({
      queryKey: ["offers", { page, limit, search }],
      queryFn: () => offerService.offers({ page, limit, search }),
    })

    const categorys = await queryClient.fetchQuery({
      queryKey: ["category"],
      queryFn: categoryService.getCategories
    })


    return { data, categorys };
  },
  component: RouteComponent,
})

function RouteComponent() {

  const { data, categorys } = Route.useLoaderData();
  const { limit, page, search } = Route.useSearch()

  const filteredCategroy = categorys.filter(data => !data.isBlocked)

  return <AdminDashboardLayout><OfferManagement data={data.data} categorys={filteredCategroy} page={page} limit={limit} total={data.total} search={search} /></AdminDashboardLayout>
}

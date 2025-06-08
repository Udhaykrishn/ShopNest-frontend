import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboardLayout } from '@/components/admin/layout/admin-dashboard.layout'
import { DashboardContent } from '@/components/admin/Dashboard'
import { saleService } from '@/services/sales';

export const Route = createFileRoute('/admin/_procted/')({
  validateSearch: (search) => {
    const query: any = {}

    if (search.date) {
      query.date = search.date;
    }
    if (search.start) {
      query.start = search.start
    }


    if (search.end) {
      query.end = search.end
    }

    return query;
  },

  loaderDeps: ({ search: { date, start, end } }) => {
    return { date, start, end }
  },
  loader: async ({ context, deps: { date,start,end } }) => {
    const { queryClient } = context;

    const data = await queryClient.fetchQuery({
      queryKey: ["sales"],
      queryFn: () => saleService.getAdminDashboard(date,start,end),
    })

    return data;
  },
  component: VendorDashboard,
})

function VendorDashboard() {

  const data = Route.useLoaderData();

  console.log("data is: ",data);

  return (
    <AdminDashboardLayout>
      <DashboardContent backendData={data.data} />
    </AdminDashboardLayout>
  )
}

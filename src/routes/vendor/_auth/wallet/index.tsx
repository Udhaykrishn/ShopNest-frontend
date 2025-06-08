import { VendorDashboardLayout } from '@/components/vendors/layout/vendor-dashboard.layout'
import { Wallet } from '@/components/wallet/wallet';
import { useWallet } from '@/hooks/wallet';
import { vendorApi } from '@/types';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/_auth/wallet/')({
  validateSearch: (search) => {
    return {
      page: search.page || 1,
      limit: search.limit || 5
    }
  },

  loaderDeps: ({ search: { page, limit } }) => {
    return { page, limit }
  },

  loader: async ({ context, deps: { page, limit } }) => {
    const { queryClient } = context;

    const data = await queryClient.fetchQuery({
      queryKey: ["vendor-wallet", { page, limit }],
      queryFn: async () => {
        const { data } = await vendorApi.get(`/wallet/vendor?page=${page}&limit=${limit}`);
        console.log("frontend wallet data is: ",data.data)
        return data.data;
      }
    })

    return data;
  },
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData();

  const { addToVendorWallet } = useWallet()

  return <VendorDashboardLayout><Wallet data={data} addToWallet={addToVendorWallet} route='/vendor/wallet' /></VendorDashboardLayout>
}

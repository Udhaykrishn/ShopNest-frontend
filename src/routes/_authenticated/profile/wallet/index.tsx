import { Wallet } from '@/components/wallet/wallet'
import { createFileRoute } from '@tanstack/react-router'
import { UserDashboardLayout } from '@/components/users/layout/layout'
import { walletService } from '@/services/wallet'
import { useWallet } from '@/hooks/wallet'

export const Route = createFileRoute('/_authenticated/profile/wallet/')({
  validateSearch: (search) => {
    return {
      page: search.page || 1,
      limit: search.limit || 5,
    }
  },
  loaderDeps: ({ search: { page, limit } }) => {
    return { page, limit }
  },
  loader: async ({ context,deps:{page,limit} }) => {
    const { queryClient } = context

    const data = await queryClient.fetchQuery({
      queryKey: ['user-wallet'],
      queryFn: async () => {
        const data = await walletService.getWallet(page,limit)
        console.log(data)
        return data
      },
    })

    return data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()

  const { addToUserWallet } = useWallet()

  return (
    <UserDashboardLayout>
      <Wallet data={data} addToWallet={addToUserWallet} route='/profile/wallet' />
    </UserDashboardLayout>
  )
}

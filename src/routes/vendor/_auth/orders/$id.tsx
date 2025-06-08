import { orderService } from '@/services/orders';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/_auth/orders/$id')({
    loader: async ({ context, params }) => {
        const { id } = params
        const { queryClient } = context;
        const data = await queryClient.fetchQuery({
            queryKey: ["vendor-orders", id],
            queryFn: () => orderService.getOneOrder(id)
        })

        return data;
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/vendor/_auth/orders/$id"!</div>
}

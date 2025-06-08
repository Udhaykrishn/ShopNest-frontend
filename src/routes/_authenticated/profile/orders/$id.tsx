import { api } from '@/types';
import { createFileRoute } from '@tanstack/react-router'
import { SingleOrder } from '@/components/orders/single-order';
import { parseParams, stringifyParams } from '@/utils'

export const Route = createFileRoute('/_authenticated/profile/orders/$id')({
    parseParams,
    stringifyParams,
    loader: async ({ context, params }) => {
        const { queryClient } = context;
        const { id } = params
        const data = await queryClient.fetchQuery({
            queryKey: ["orders", id],
            queryFn: async () => {
                const { data } = await api.get(`/order/${id}`)
                return data.data;
            }
        })
        return data;
    },
    component: OrderComponent
})

function OrderComponent() {
    const data = Route.useLoaderData();
    return <SingleOrder orders={data} />
}
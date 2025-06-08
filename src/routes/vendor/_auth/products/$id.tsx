import { VendorDashboardLayout } from '@/components/vendors/layout/vendor-dashboard.layout'
import { createFileRoute } from '@tanstack/react-router'
import { ProductEditForm } from "@/components/vendors/products/product-edit"
import { vendorApi } from '@/types'
import { Product } from '@/types'

export const Route = createFileRoute('/vendor/_auth/products/$id')({
    loader: async ({ context, params }) => {
        const { queryClient } = context;
        const { id } = params
        const data = await queryClient.fetchQuery({
            queryKey: ["products", id],
            queryFn: async () => {
                const { data } = await vendorApi.get(`/products/${id}`)
                return data.data;
            }
        })

        return data;
    },
    component: RouteComponenet,
    
})

function RouteComponenet(){

    const product:Product = Route.useLoaderData();
    
    return (
        <VendorDashboardLayout><ProductEditForm product={product} /></VendorDashboardLayout>
    )
}


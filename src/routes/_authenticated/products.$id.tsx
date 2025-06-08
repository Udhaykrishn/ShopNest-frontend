import { SingleProductPage } from '@/components/products/product-view/view-product'
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import { router } from '@/router'
import { parseParams } from '@/utils'
import { stringifyParams } from '@/utils/encoding';


export const Route = createFileRoute('/_authenticated/products/$id')({
  parseParams,
  stringifyParams,
  loader: async ({ params, context }) => {
    const queryKey = ["sigle-products", params.id]
    const { queryClient } = context;
    
    const data = await queryClient.fetchQuery({
      queryKey,
      queryFn: async () => {
        const { data } = await axios.get(`http://shopnest.zapto.org/api/products/${params.id}`)
        
        if (data.data.isBlocked) {
          router.navigate({ to: "/shop" })
        }
        return data;
      }
    })
    return data;
  },
  component: SingleProductPage
})
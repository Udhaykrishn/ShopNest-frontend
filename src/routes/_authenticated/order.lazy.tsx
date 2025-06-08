import OrderSuccess from '@/components/orders/order-placed'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/order')({
    component: OrderSuccess,
})

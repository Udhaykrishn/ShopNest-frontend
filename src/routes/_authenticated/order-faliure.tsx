import { OrderFailure } from '@/components/orders/order-faliure'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/order-faliure')({
  component: OrderFailure,
})

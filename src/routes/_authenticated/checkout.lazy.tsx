import CheckoutPage from '@/components/checkout/checkout'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/checkout')({
    component: CheckoutPage,
})

import CartList from '@/components/cart/CartList'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/cart')({
  component: CartList,
})

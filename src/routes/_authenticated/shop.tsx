import { createFileRoute } from '@tanstack/react-router'
import { ShopPage } from '@/components/Shop'
export const Route = createFileRoute('/_authenticated/shop')({
  component: ShopPage,
})

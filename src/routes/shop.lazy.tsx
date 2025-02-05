import { createLazyFileRoute } from '@tanstack/react-router'
import {ShopPage} from "@/components/Shop"
export const Route = createLazyFileRoute('/shop')({
  component:ShopPage,
})

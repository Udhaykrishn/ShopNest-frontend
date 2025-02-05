import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/vendor/product/$productId')({

  component: RouteComponent,
})

function RouteComponent() {
  const { productId } = Route.useParams()
  return <div>Hello ${productId}</div>
}

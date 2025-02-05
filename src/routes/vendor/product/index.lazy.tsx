import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/vendor/product/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/vendor/product/"!</div>
}

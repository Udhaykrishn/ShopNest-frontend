import { createLazyFileRoute } from '@tanstack/react-router'


export const Route = createLazyFileRoute('/vendor/')({
  component: () => {
    return <h2>Hello Vendor</h2>
  },
})


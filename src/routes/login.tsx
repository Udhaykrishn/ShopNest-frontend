import { LoginIndex } from '@/components/users'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context.auth
    
    if (isAuthenticated) {
      throw redirect({ to: "/shop" })
    }
  },
  component: LoginIndex,

})

import AdminLoginPage from '@/components/admin/login-page'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/login')({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context.admin
    if (isAuthenticated) {
      throw redirect({ to: "/admin" })
    }
  },

  component: AdminLoginPage,
})

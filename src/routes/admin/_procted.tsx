import { adminApi } from '@/types'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_procted')({
  beforeLoad: async ({ context }) => {
    try {
      const { setAuth } = context.admin

      const { data } = await adminApi.get("/auth/admin/profile", { withCredentials: true })
      if (data.success) {
        setAuth({
          isAuthenticated: data.success
        })
      } else {
        throw redirect({ to: "/admin/login" })
      }
    } catch (error) {
      throw redirect({ to: "/admin/login" })
    }
  },

})

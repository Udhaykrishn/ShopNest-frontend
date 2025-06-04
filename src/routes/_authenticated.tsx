import { api } from '@/types'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
      try {
        const { data } = await api.get("/auth/user/profile",{withCredentials:true})

        context.auth.setAuth({
          isAuthenticated: true,
          role: data.data.role,
          id: data.data._id
        })
      } catch (err) {
        throw redirect({ to: "/login" })
      }
  },
})


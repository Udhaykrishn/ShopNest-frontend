import LoginPage from '@/components/users/Login'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/login')({
  component: LoginPage,
})


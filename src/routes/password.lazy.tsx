import ForgotPasswordForm from '@/components/users/forgot-password'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/password')({
  component: ForgotPasswordForm,
})
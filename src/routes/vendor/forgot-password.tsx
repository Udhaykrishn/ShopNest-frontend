import { VendorForgotPasswordForm } from '@/components/vendors/password/forgot-password'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/forgot-password')({
  component: VendorForgotPasswordForm,
})

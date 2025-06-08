import { VendorForgotPasswordOTP } from '@/components/vendors/password/forgot-password-otp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/forgot-otp')({
  component: VendorForgotPasswordOTP,
})


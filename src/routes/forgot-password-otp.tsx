import { ForgotPasswordOTP } from '@/components/users/forgot-password-otp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forgot-password-otp')({
    component: ForgotPasswordOTP,
})

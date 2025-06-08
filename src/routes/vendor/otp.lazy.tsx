import OTPVerification from '@/components/vendors/otp'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/vendor/otp')({
    component: OTPVerification,
})

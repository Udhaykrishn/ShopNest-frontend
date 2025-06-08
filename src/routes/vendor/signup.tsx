import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignupPage } from '@/components/vendors/auth/SignupPage'

export const Route = createFileRoute('/vendor/signup')({
    beforeLoad: ({ context }) => {
        const { isAuthenticated } = context.vendor

        if (isAuthenticated) {
            throw redirect({ to: "/vendor" })
        }
    },
    component: SignupPage,
})

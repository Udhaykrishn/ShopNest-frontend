import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '@/components/vendors/auth/LoginPage'
export const Route = createFileRoute('/vendor/login')({
    beforeLoad: ({ context }) => {
        const { isAuthenticated } = context.vendor

        if (isAuthenticated) {
            throw redirect({ to: "/vendor" })
        }
    },
    component: LoginPage,
})

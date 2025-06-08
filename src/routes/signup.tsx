import { SignupIndex } from '@/components/users'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
    beforeLoad: ({ context }) => {
        const { isAuthenticated } = context.auth
        console.log(isAuthenticated)
        if (isAuthenticated) {
            throw redirect({ to: "/shop" })
        }
    },
    component: SignupIndex,
})

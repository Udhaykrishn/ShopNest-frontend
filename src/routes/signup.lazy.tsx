import SignupPage from '@/components/users/Signup'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/signup')({
    component: SignupPage,
})



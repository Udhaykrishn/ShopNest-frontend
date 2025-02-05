import { createLazyFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/components/vendors/LoginPage'
export const Route = createLazyFileRoute('/vendor/login')({
    component: LoginPage,
})



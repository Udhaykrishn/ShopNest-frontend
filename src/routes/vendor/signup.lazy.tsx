import { createLazyFileRoute } from '@tanstack/react-router'
import { SignupPage } from "@/components/vendors/SignupPage"

export const Route = createLazyFileRoute('/vendor/signup')({
    component: SignupPage,
})

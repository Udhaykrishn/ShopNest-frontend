import { createLazyFileRoute } from '@tanstack/react-router'
import { EmailForm } from '@/components/users';

export const Route = createLazyFileRoute('/forgot')({
    component: EmailForm
})


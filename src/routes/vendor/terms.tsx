import { TermsPolicyPage } from '@/components/vendors/terms'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/terms')({
  component: TermsPolicyPage,
})


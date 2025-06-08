import { PrivacyPolicyPage } from '@/components/vendors/privacy'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/privacy')({
  component: PrivacyPolicyPage,
})

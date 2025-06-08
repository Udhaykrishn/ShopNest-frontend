import { VendorEmailForm } from '@/components/vendors/password/email-confirm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/forgot')({
  component: VendorEmailForm,
})



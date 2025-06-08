import { VendorLandingPage } from '@/components/vendors/landing-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor-landing')({
  component: VendorLandingPage,
})



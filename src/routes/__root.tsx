import LoadingSpinner from '@/components/Loader'
import DefaultLayout from '@/layout/defaultLayout'
import { createRootRoute } from '@tanstack/react-router'


export const Route = createRootRoute({
    loader: LoadingSpinner,
    component: DefaultLayout,
})



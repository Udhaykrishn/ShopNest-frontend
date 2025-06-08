import { Navbar } from "@/components/Navbar"
import { ScrollToTop } from "@/components/ScrollToTop"
import { Outlet, useRouter } from "@tanstack/react-router"

const DefaultLayout = () => {
  const {
    state: {
      location: { pathname },
    },
  } = useRouter()

  const isVendorOrAdmin = /^\/(vendor|admin|login|signup|forgot(-password-otp)?|password)/.test(pathname)

  return isVendorOrAdmin ? (
    <Outlet />
  ) : (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container max-w-7xl px-6 flex-grow pt-0">
        <Outlet />
      </main>
      <footer className="w-full pl-3">
        <ScrollToTop />
      </footer>
    </div>
  )
}

export default DefaultLayout

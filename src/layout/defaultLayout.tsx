import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import { ScrollToTop } from "@/components/ScrollToTop"
import { ReactNode } from "react"
import { Outlet } from "@tanstack/react-router"
import { FAQ } from "@/components/FAQ"

const DefaultLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container max-w-7xl px-6 flex-grow pt-0">
                {children}
                <Outlet />
            </main>
            <footer className="w-full pl-3
            ">
                <FAQ />
                <Footer />
                <ScrollToTop />
            </footer>
        </div>
    )
}

export default DefaultLayout

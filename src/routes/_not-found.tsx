// src/routes/$.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from '@tanstack/react-router' // Import useRouter directly

export const Route = createFileRoute('/_not-found')({
  component: NotFoundPage,
})

function NotFoundPage() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter() // Use the useRouter hook here

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const goBack = () => {
    router.history.back() // Access history from the router instance
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="absolute top-20 left-20 w-3 h-3 bg-green-400/30 rounded-full blur-sm animate-bounce"></div>
      <div className="absolute top-40 right-40 w-2 h-2 bg-green-400/30 rounded-full blur-sm animate-ping"></div>
      <div className="absolute bottom-32 left-1/3 w-4 h-4 bg-green-400/30 rounded-full blur-sm animate-pulse"></div>
      <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-green-400/30 rounded-full blur-sm animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-green-400/30 rounded-full blur-sm animate-ping"></div>

      <div
        className={`z-10 transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
      >
        <div className="mb-8 relative">
          <div className="text-9xl font-black text-center tracking-wider text-white relative">
            <div className="relative inline-block">
              <span className="absolute -left-1 -top-1 text-green-500/70">
                4
              </span>
              <span className="absolute -left-0.5 -top-0.5 text-green-400/70">
                4
              </span>
              <span className="relative">4</span>
            </div>
            <div className="relative inline-block">
              <span className="absolute -left-1 -top-1 text-green-500/70">
                0
              </span>
              <span className="absolute -left-0.5 -top-0.5 text-green-400/70">
                0
              </span>
              <span className="relative">0</span>
            </div>
            <div className="relative inline-block">
              <span className="absolute -left-1 -top-1 text-green-500/70">
                4
              </span>
              <span className="absolute -left-0.5 -top-0.5 text-green-400/70">
                4
              </span>
              <span className="relative">4</span>
            </div>
          </div>
          <div className="w-full h-1 mt-4 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"></div>
        </div>

        <div
          className={`text-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="text-4xl font-bold text-green-500 mb-4 animate-pulse">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-300 max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={goBack}
              className="border-green-500 text-green-400 hover:text-green-300 hover:border-green-400 group flex items-center gap-2 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Go Back</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-1/2 w-full h-px bg-green-500/10 overflow-hidden">
        <div className="w-1/2 h-full bg-green-400/50 animate-ping"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-green-900/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-green-900/20 to-transparent"></div>
    </div>
  )
}

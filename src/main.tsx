import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css"
import "./App.css"
import { ThemeProvider } from './components/theme-provider';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from '@/components/ui/toaster'
import { App } from "@/App"

export const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
});

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={client}>
        <ThemeProvider>
          <Toaster />
          <App  />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
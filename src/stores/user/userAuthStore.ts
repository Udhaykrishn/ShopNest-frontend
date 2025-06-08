import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthState {
  isAuthenticated: boolean
  role: string
  id: string
  setAuth: (payload: { isAuthenticated: boolean; role: string; id: string }) => void
  logout: () => void
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: '',
      id: '',
      setAuth: ({ isAuthenticated, role, id }) => {
        set({ isAuthenticated, role, id })
      },
      logout: () => {
        set({ isAuthenticated: false, role: '', id: '' })
      }
    }),
    {
      name: 'user-auth-store',
    }
  )
)

export const useAuthStore = authStore
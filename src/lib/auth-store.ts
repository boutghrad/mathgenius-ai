import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
  plan: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User) => void
  logout: () => void
  demoLogin: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user: User) => {
    set({ user, isAuthenticated: true, isLoading: false })
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },

  demoLogin: () => {
    set({
      user: {
        id: 'demo-user-1',
        email: 'demo@mathgenius.ai',
        name: 'Demo User',
        plan: 'pro',
        avatar: undefined,
      },
      isAuthenticated: true,
    })
  },
}))

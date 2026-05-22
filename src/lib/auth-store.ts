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
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, name: string, password: string) => Promise<void>
  logout: () => void
  demoLogin: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.user) {
        set({ user: data.user, isAuthenticated: true, isLoading: false })
      } else {
        set({ isLoading: false })
        throw new Error(data.error || 'Invalid email or password')
      }
    } catch (error: unknown) {
      set({ isLoading: false })
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Login failed. Please try again.')
    }
  },

  signup: async (email: string, name: string, password: string) => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      })
      const data = await res.json()
      if (res.ok && data.user) {
        set({ user: data.user, isAuthenticated: true, isLoading: false })
      } else {
        set({ isLoading: false })
        throw new Error(data.error || 'Failed to create account')
      }
    } catch (error: unknown) {
      set({ isLoading: false })
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Signup failed. Please try again.')
    }
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

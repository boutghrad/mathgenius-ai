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
        throw new Error(data.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة')
      }
    } catch (error: unknown) {
      set({ isLoading: false })
      if (error instanceof Error) {
        throw error
      }
      throw new Error('فشل تسجيل الدخول. حاول مرة أخرى.')
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
        throw new Error(data.error || 'فشل إنشاء الحساب')
      }
    } catch (error: unknown) {
      set({ isLoading: false })
      if (error instanceof Error) {
        throw error
      }
      throw new Error('فشل إنشاء الحساب. حاول مرة أخرى.')
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

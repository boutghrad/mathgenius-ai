import { create } from 'zustand'

export type PageType = 'landing' | 'pricing' | 'dashboard' | 'solver' | 'history' | 'profile' | 'admin' | 'login' | 'signup'

interface AppState {
  currentPage: PageType
  setCurrentPage: (page: PageType) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  chatOpen: boolean
  setChatOpen: (open: boolean) => void
  toggleChat: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'landing',
  setCurrentPage: (page) => set({ currentPage: page }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  chatOpen: false,
  setChatOpen: (open) => set({ chatOpen: open }),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
}))

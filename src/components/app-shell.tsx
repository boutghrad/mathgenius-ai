'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAppStore, type PageType } from '@/lib/app-store'
import { useAuthStore } from '@/lib/auth-store'
import { LandingPage } from '@/components/landing-page'
import { PricingPage } from '@/components/pricing-page'
import { DashboardPage } from '@/components/dashboard-page'
import { SolverPage } from '@/components/solver-page'
import { HistoryPage } from '@/components/history-page'
import { ProfilePage } from '@/components/profile-page'
import { AdminPage } from '@/components/admin-page'
import { AuthPage } from '@/components/auth-page'
import { AIChat } from '@/components/ai-chat'
import {
  LayoutDashboard, Calculator, Clock, CreditCard, User,
  Shield, Sparkles, PanelLeftClose, PanelLeft, Menu,
  LogOut, ChevronRight, Sun, Moon
} from 'lucide-react'

const navItems = [
  { id: 'dashboard' as PageType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'solver' as PageType, label: 'AI Solver', icon: Calculator },
  { id: 'history' as PageType, label: 'History', icon: Clock },
  { id: 'pricing' as PageType, label: 'Pricing', icon: CreditCard },
  { id: 'profile' as PageType, label: 'Profile', icon: User },
  { id: 'admin' as PageType, label: 'Admin', icon: Shield },
]

function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { currentPage, setCurrentPage } = useAppStore()
  const { user, logout } = useAuthStore()
  const [isDark, setIsDark] = useState(true)

  const navigate = (page: PageType) => {
    setCurrentPage(page)
    onNavigate?.()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 glow-blue">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden"
          >
            <p className="text-sm font-bold tracking-tight whitespace-nowrap">MathGenius AI</p>
          </motion.div>
        )}
      </div>

      <Separator className="bg-white/5 mx-3" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPage === item.id
          const button = (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20 glow-blue'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && !collapsed && (
                <ChevronRight className="w-3 h-3 ml-auto text-blue-400" />
              )}
            </button>
          )

          if (collapsed) {
            return (
              <TooltipProvider key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-900 border-white/10 text-white text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          }

          return button
        })}
      </nav>

      <Separator className="bg-white/5 mx-3" />

      {/* Bottom Section */}
      <div className="px-3 py-4 space-y-2">
        {/* Theme toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] transition-all"
        >
          {isDark ? <Moon className="w-5 h-5 shrink-0 text-gray-500" /> : <Sun className="w-5 h-5 shrink-0 text-gray-500" />}
          {!collapsed && <span className="whitespace-nowrap">{isDark ? 'Dark Mode' : 'Light Mode'}</span>}
        </button>

        {/* User Profile */}
        {user && (
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] ${collapsed ? 'justify-center' : ''}`}>
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.plan} plan</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => { logout(); setCurrentPage('landing') }}
                className="p-1 hover:bg-white/5 rounded text-gray-500 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function AppShell() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, toggleSidebar } = useAppStore()
  const { isAuthenticated } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Public pages (no sidebar)
  const isPublicPage = currentPage === 'landing' || currentPage === 'login' || currentPage === 'signup'

  if (isPublicPage && !isAuthenticated) {
    return (
      <>
        {currentPage === 'login' || currentPage === 'signup' ? (
          <AuthPage />
        ) : currentPage === 'pricing' ? (
          <PricingPage />
        ) : (
          <LandingPage />
        )}
        <AIChat />
      </>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />
      case 'solver': return <SolverPage />
      case 'history': return <HistoryPage />
      case 'pricing': return <PricingPage />
      case 'profile': return <ProfilePage />
      case 'admin': return <AdminPage />
      case 'landing': return <LandingPage />
      default: return <DashboardPage />
    }
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden md:flex flex-col border-r border-white/5 bg-black/50 backdrop-blur-xl shrink-0"
      >
        <SidebarContent collapsed={!sidebarOpen} />
        <div className="px-3 pb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="w-full h-8 text-gray-500 hover:text-white hover:bg-white/5"
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </Button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 bg-black/95 backdrop-blur-xl border-white/10 p-0">
          <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5 bg-black/30 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-sm font-medium text-gray-300 capitalize">
              {currentPage === 'landing' ? 'Home' : currentPage}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage('solver')}
              className="text-gray-400 hover:text-white text-xs hidden sm:flex"
            >
              <Calculator className="w-4 h-4 mr-1" />
              Quick Solve
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* AI Chat */}
      <AIChat />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/lib/app-store'
import { useAuthStore } from '@/lib/auth-store'
import { Sparkles, ArrowLeft, Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { setCurrentPage } = useAppStore()
  const { setUser } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Client-side validation
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email (e.g. you@example.com)')
      return
    }

    if (!password || password.length < 3) {
      setError('Password must be at least 3 characters')
      return
    }

    if (!isLogin && (!name || name.trim().length < 2)) {
      setError('Please enter your name (at least 2 characters)')
      return
    }

    setIsLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const body = isLogin
        ? { email: email.trim().toLowerCase(), password }
        : { email: email.trim().toLowerCase(), name: name.trim(), password }

      console.log('[Auth] Sending request to:', endpoint, 'with:', { ...body, password: '***' })

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      console.log('[Auth] Response:', res.status, data)

      if (res.ok && data.user) {
        setSuccess(isLogin ? 'Login successful!' : 'Account created successfully!')
        setUser(data.user)
        setTimeout(() => setCurrentPage('dashboard'), 500)
      } else {
        setError(data.error || (isLogin ? 'Invalid email or password' : 'Failed to create account'))
      }
    } catch (err) {
      console.error('[Auth] Network error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemo = () => {
    useAuthStore.getState().demoLogin()
    setCurrentPage('dashboard')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="fixed inset-0 grid-pattern opacity-50" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <button
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <Card className="glass-card">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 glow-blue">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {isLogin ? 'Sign in to your MathGenius AI account' : 'Start solving math with AI today'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {success}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="pl-10 bg-white/[0.03] border-white/10 focus:border-blue-500/50 text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 bg-white/[0.03] border-white/10 focus:border-blue-500/50 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 3 characters"
                    className="pl-10 bg-white/[0.03] border-white/10 focus:border-blue-500/50 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 py-5"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            {/* Help tips */}
            {isLogin ? (
              <p className="text-xs text-gray-600 mt-3 text-center">
                No account yet? Create one first, then sign in.
              </p>
            ) : (
              <p className="text-xs text-gray-600 mt-3 text-center">
                Your email and password will be saved securely.
              </p>
            )}

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <Button
              onClick={handleDemo}
              variant="outline"
              className="w-full border-white/10 text-gray-300 hover:bg-white/5 py-5"
            >
              <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
              Try Demo Account (Instant Access)
            </Button>

            <p className="text-center text-sm text-gray-500 mt-6">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null) }}
                className="text-blue-400 hover:underline font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

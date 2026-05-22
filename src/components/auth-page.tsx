'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/lib/app-store'
import { useAuthStore } from '@/lib/auth-store'
import { Sparkles, ArrowLeft, Loader2, Mail, Lock, User, AlertCircle, CheckCircle2, Github } from 'lucide-react'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { setCurrentPage } = useAppStore()
  const { setUser } = useAuthStore()

  // Handle GitHub OAuth callback on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authStatus = params.get('auth')

    if (authStatus === 'success') {
      const userData = params.get('user')
      if (userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData))
          setUser(user)
          setSuccess('GitHub login successful!')
          // Clean URL
          window.history.replaceState({}, '', '/')
          setTimeout(() => setCurrentPage('dashboard'), 500)
        } catch {
          setError('Failed to process GitHub login data')
        }
      }
    } else if (authStatus === 'error') {
      const message = params.get('message') || 'GitHub authentication failed'
      setError(message.replace(/\+/g, ' '))
      // Clean URL
      window.history.replaceState({}, '', '/')
    }
  }, [setUser, setCurrentPage])

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

  const handleGitHubLogin = () => {
    setGithubLoading(true)
    setError(null)
    // Redirect to GitHub OAuth flow
    window.location.href = '/api/auth/github'
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

            {/* GitHub Login Button */}
            <Button
              onClick={handleGitHubLogin}
              disabled={githubLoading}
              variant="outline"
              className="w-full border-white/20 bg-white/[0.05] hover:bg-white/[0.1] text-white py-5 mb-4 text-base font-medium"
            >
              {githubLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Continue with GitHub
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

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
              <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
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

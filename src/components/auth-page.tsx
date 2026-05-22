'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/lib/auth-store'
import { useAppStore } from '@/lib/app-store'
import { Sparkles, ArrowLeft, Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { login, signup, demoLogin } = useAuthStore()
  const { setCurrentPage } = useAppStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
        setSuccess('تم تسجيل الدخول بنجاح!')
        setTimeout(() => setCurrentPage('dashboard'), 500)
      } else {
        if (password.length < 3) {
          setError('كلمة المرور يجب أن تكون 3 أحرف على الأقل')
          setIsLoading(false)
          return
        }
        await signup(email, name, password)
        setSuccess('تم إنشاء الحساب بنجاح!')
        setTimeout(() => setCurrentPage('dashboard'), 500)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(isLogin ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'فشل إنشاء الحساب')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemo = () => {
    demoLogin()
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
          العودة للرئيسية
        </button>

        <Card className="glass-card">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 glow-blue">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">
                {isLogin ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {isLogin ? 'سجّل الدخول إلى حسابك في MathGenius AI' : 'ابدأ حل المسائل الرياضية بالذكاء الاصطناعي'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
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
                  <Label className="text-gray-400 text-xs">الاسم الكامل</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك"
                      className="pl-10 bg-white/[0.03] border-white/10 focus:border-blue-500/50 text-white placeholder:text-gray-600"
                      required={!isLogin}
                      minLength={2}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 bg-white/[0.03] border-white/10 focus:border-blue-500/50 text-white placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400 text-xs">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-white/[0.03] border-white/10 focus:border-blue-500/50 text-white placeholder:text-gray-600"
                    required
                    minLength={3}
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
                  isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'
                )}
              </Button>
            </form>

            {/* Tip for login */}
            {isLogin && (
              <p className="text-xs text-gray-600 mt-3 text-center">
                💡 يجب إنشاء حساب أولاً ثم تسجيل الدخول به
              </p>
            )}

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">أو</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <Button
              onClick={handleDemo}
              variant="outline"
              className="w-full border-white/10 text-gray-300 hover:bg-white/5 py-5"
            >
              <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
              تجربة الحساب التجريبي
            </Button>

            <p className="text-center text-sm text-gray-500 mt-6">
              {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null) }}
                className="text-blue-400 hover:underline"
              >
                {isLogin ? 'إنشاء حساب' : 'تسجيل الدخول'}
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

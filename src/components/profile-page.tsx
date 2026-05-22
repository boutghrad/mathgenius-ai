'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/lib/auth-store'
import { useAppStore } from '@/lib/app-store'
import {
  User, Mail, Globe, Palette, Shield, CreditCard,
  Calculator, Brain, Flame, Target, CheckCircle2, Crown
} from 'lucide-react'

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
]

export function ProfilePage() {
  const { user } = useAuthStore()
  const { setCurrentPage } = useAppStore()
  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')
  const [language, setLanguage] = useState('en')
  const [isDark, setIsDark] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save delay
    await new Promise((r) => setTimeout(r, 1000))
    setIsSaving(false)
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <User className="w-7 h-7 text-blue-400" />
          Profile Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white glow-blue">
                {name[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Full Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/[0.03] border-white/10 focus:border-blue-500/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Email</Label>
                    <Input
                      value={email}
                      disabled
                      className="bg-white/[0.02] border-white/10 text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-gray-500">Toggle between dark and light theme</p>
              </div>
              <Switch checked={isDark} onCheckedChange={setIsDark} />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-xs text-gray-500">Choose your preferred language</p>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40 bg-white/[0.03] border-white/10 text-gray-300">
                  <Globe className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive updates about your solutions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscription */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-400" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center glow-blue">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {user?.plan === 'pro' ? 'Pro Plan' : user?.plan === 'enterprise' ? 'Enterprise Plan' : 'Free Plan'}
                    <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/20 text-xs capitalize">
                      {user?.plan || 'free'}
                    </Badge>
                  </p>
                  <p className="text-xs text-gray-500">Current billing period</p>
                </div>
              </div>
              {user?.plan !== 'pro' && (
                <Button
                  size="sm"
                  onClick={() => setCurrentPage('pricing')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                >
                  Upgrade
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { icon: Calculator, label: 'Solved', value: '247' },
                { icon: Brain, label: 'AI Gens', value: '1,892' },
                { icon: Flame, label: 'Streak', value: '14 days' },
                { icon: Target, label: 'Accuracy', value: '97.3%' },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <stat.icon className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-sm font-semibold">{stat.value}</p>
                  <p className="text-[10px] text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Change Password</p>
                <p className="text-xs text-gray-500">Update your account password</p>
              </div>
              <Button variant="outline" size="sm" className="border-white/10 text-gray-300">
                Change
              </Button>
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Add extra security to your account</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Enabled
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 glow-blue px-8"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </motion.div>
    </div>
  )
}

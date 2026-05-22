'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useAppStore } from '@/lib/app-store'
import { useAuthStore } from '@/lib/auth-store'
import { CheckCircle2, Sparkles, Zap, Building2 } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    icon: Sparkles,
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started with AI math solving',
    features: [
      '10 solutions per day',
      'Basic step-by-step explanations',
      'Algebra & Geometry support',
      'Text input only',
      'Community support',
    ],
    gradient: 'from-gray-500 to-gray-600',
    glowClass: '',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Zap,
    price: { monthly: 19, yearly: 15 },
    description: 'For serious students who need unlimited access',
    features: [
      'Unlimited solutions',
      'Detailed step-by-step explanations',
      'All subjects including Calculus & Physics',
      'Image upload & LaTeX editor',
      'Graph visualization',
      'Export to PDF',
      'Priority AI processing',
      'Email support',
    ],
    gradient: 'from-blue-600 to-purple-600',
    glowClass: 'glow-blue',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: { monthly: 49, yearly: 39 },
    description: 'For teams and educational institutions',
    features: [
      'Everything in Pro',
      'Team collaboration workspace',
      'Admin dashboard & analytics',
      'Custom AI model fine-tuning',
      'API access',
      'SSO authentication',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
    gradient: 'from-purple-600 to-cyan-600',
    glowClass: 'glow-purple',
    popular: false,
  },
]

export function PricingPage() {
  const [yearly, setYearly] = useState(false)
  const { setCurrentPage } = useAppStore()
  const { demoLogin } = useAuthStore()

  const handleSelectPlan = (planName: string) => {
    demoLogin()
    setCurrentPage('dashboard')
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 grid-pattern opacity-50" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[128px]" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${!yearly ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <Switch checked={yearly} onCheckedChange={setYearly} />
            <span className={`text-sm ${yearly ? 'text-white' : 'text-gray-500'}`}>
              Yearly
              <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                Save 20%
              </Badge>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className={`glass-card transition-all duration-300 h-full relative ${plan.popular ? 'border-blue-500/30 ' + plan.glowClass : 'glass-card-hover'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-3">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4 pt-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 ${plan.popular ? 'glow-blue' : ''}`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${yearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-gray-500 text-sm">/month</span>
                    {yearly && plan.price.yearly > 0 && (
                      <p className="text-xs text-green-400 mt-1">Billed annually</p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <Button
                    className={`w-full mb-6 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 glow-blue'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                    onClick={() => handleSelectPlan(plan.name)}
                  >
                    {plan.price.monthly === 0 ? 'Get Started Free' : 'Start Free Trial'}
                  </Button>
                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 text-sm">
            Have questions? <button className="text-blue-400 hover:underline">Contact our sales team</button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

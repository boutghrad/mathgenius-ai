'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/lib/app-store'
import { useAuthStore } from '@/lib/auth-store'
import {
  Brain, Calculator, SquareFunction, TrendingUp, Grid3X3, Atom,
  ArrowRight, Sparkles, CheckCircle2, Star, Zap, Globe,
  Upload, MessageCircle, BarChart3, ChevronRight
} from 'lucide-react'

const features = [
  { icon: Brain, title: 'AI-Powered Solver', description: 'Advanced AI understands and solves complex math problems across multiple disciplines with high accuracy.', color: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' },
  { icon: SquareFunction, title: 'Step-by-Step Solutions', description: 'Every solution comes with detailed step-by-step explanations so you learn the methodology, not just the answer.', color: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]' },
  { icon: Calculator, title: 'LaTeX Editor', description: 'Full LaTeX math editor with live preview, symbol toolbar, and smart autocompletion for efficient input.', color: 'text-cyan-400', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]' },
  { icon: TrendingUp, title: 'Graph Visualization', description: 'Real-time function plotting with interactive zoom, pan, and multi-graph overlay for visual understanding.', color: 'text-green-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
  { icon: Upload, title: 'Image Recognition', description: 'Upload photos of equations from textbooks or handwritten notes and get instant solutions with OCR recognition.', color: 'text-amber-400', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
  { icon: Globe, title: 'Multi-Language', description: 'Full support for multiple languages making math accessible to students worldwide in their native language.', color: 'text-pink-400', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]' },
]

const subjects = ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Linear Algebra', 'Physics']

const testimonials = [
  { name: 'Sarah Chen', role: 'Math PhD Student', content: 'MathGenius AI has transformed how I approach complex calculus problems. The step-by-step solutions are incredibly detailed and help me verify my work.', rating: 5 },
  { name: 'James Rodriguez', role: 'High School Teacher', content: 'I recommend this to all my students. The explanations are pedagogically sound and the AI tutor feature provides personalized help.', rating: 5 },
  { name: 'Emily Watson', role: 'Engineering Student', content: 'The LaTeX editor and graph visualization are game-changers. I use it daily for my engineering coursework and research projects.', rating: 5 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function LandingPage() {
  const { setCurrentPage } = useAppStore()
  const { demoLogin } = useAuthStore()

  const handleGetStarted = () => {
    demoLogin()
    setCurrentPage('dashboard')
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 grid-pattern opacity-50" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-50 flex items-center justify-between px-6 md:px-12 py-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">MathGenius AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => setCurrentPage('pricing')} className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</button>
          <button onClick={() => setCurrentPage('solver')} className="text-sm text-gray-400 hover:text-white transition-colors">Solver</button>
          <button onClick={() => setCurrentPage('dashboard')} className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => setCurrentPage('signup')}>
            Log in
          </Button>
          <Button size="sm" onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0">
            Get Started
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            Powered by Advanced AI
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Solve Any Math Problem
            <br />
            <span className="gradient-text">with AI Precision</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get instant, accurate step-by-step solutions for algebra, calculus, geometry, statistics, and more. Powered by advanced AI that understands mathematics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 px-8 py-6 text-base glow-blue hover:scale-105 transition-transform"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setCurrentPage('pricing')}
              className="border-white/10 text-white hover:bg-white/5 px-8 py-6 text-base"
            >
              View Pricing
            </Button>
          </div>

          {/* Subject pills */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-3 mt-12"
          >
            {subjects.map((subject) => (
              <motion.span
                key={subject}
                variants={itemVariants}
                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-blue-500/30 hover:text-blue-300 transition-all cursor-default"
              >
                {subject}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 relative"
        >
          <div className="glass-card p-1 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-gradient-to-br from-gray-900/90 to-black/90 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-sm text-gray-500 font-mono">MathGenius AI Workspace</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 font-mono text-sm">&gt;</span>
                  <span className="text-gray-300 font-mono text-sm">Solve: ∫(3x² + 2x - 5)dx</span>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="text-sm text-gray-400">
                    <span className="text-purple-400">Step 1:</span> Apply the power rule to each term
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="text-purple-400">Step 2:</span> ∫3x²dx = x³, ∫2xdx = x², ∫(-5)dx = -5x
                  </div>
                  <div className="text-sm text-cyan-400 font-mono">
                    Answer: x³ + x² - 5x + C
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-2xl" />
        </motion.div>
      </section>

      {/* Features Section */}
      <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="gradient-text">Master Math</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From basic algebra to advanced calculus, our AI-powered platform provides comprehensive tools for every mathematical challenge.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="glass-card glass-card-hover transition-all duration-300 group cursor-default">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${feature.glow} transition-all duration-300 group-hover:scale-110`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-gray-400 text-lg">Three simple steps to solve any math problem</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Enter Your Problem', description: 'Type your equation using LaTeX, plain text, or upload an image of your math problem from a textbook or notes.', icon: Calculator },
            { step: '02', title: 'AI Processes It', description: 'Our advanced AI analyzes your problem, identifies the mathematical concepts involved, and generates a detailed solution pathway.', icon: Brain },
            { step: '03', title: 'Learn & Understand', description: 'Review the step-by-step solution with explanations, view the graph visualization, and save it for future reference.', icon: Sparkles },
          ].map((item) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center mb-6 glow-blue">
                <item.icon className="w-8 h-8 text-blue-400" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  {item.step}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by <span className="gradient-text">Students & Educators</span>
          </h2>
          <p className="text-gray-400 text-lg">Join thousands who have transformed their math journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="glass-card glass-card-hover transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Solve <span className="gradient-text">Smarter</span>?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of students and professionals who trust MathGenius AI for accurate, step-by-step solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 px-8 py-6 text-base glow-blue hover:scale-105 transition-transform"
              >
                Start Solving for Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentPage('pricing')}
                className="border-white/10 text-white hover:bg-white/5 px-8 py-6 text-base"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Compare Plans
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Free forever plan</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> No credit card required</span>
              <span className="flex items-center gap-1.5 hidden sm:flex"><CheckCircle2 className="w-4 h-4 text-green-400" /> Cancel anytime</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold">MathGenius AI</span>
          </div>
          <p className="text-xs text-gray-500">© 2025 MathGenius AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy</button>
            <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms</button>
            <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Support</button>
          </div>
        </div>
      </footer>
    </div>
  )
}

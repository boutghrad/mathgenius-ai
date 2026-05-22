'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/app-store'
import { useAuthStore } from '@/lib/auth-store'
import {
  Calculator, Brain, Flame, Target, ArrowUpRight, ArrowDownRight,
  Plus, Clock, BookOpen, TrendingUp
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

// Demo data for the dashboard
const weeklyData = [
  { day: 'Mon', equations: 8, accuracy: 96 },
  { day: 'Tue', equations: 12, accuracy: 98 },
  { day: 'Wed', equations: 6, accuracy: 94 },
  { day: 'Thu', equations: 15, accuracy: 97 },
  { day: 'Fri', equations: 10, accuracy: 95 },
  { day: 'Sat', equations: 4, accuracy: 99 },
  { day: 'Sun', equations: 7, accuracy: 97 },
]

const categoryData = [
  { name: 'Algebra', value: 35, color: '#3B82F6' },
  { name: 'Calculus', value: 25, color: '#8B5CF6' },
  { name: 'Geometry', value: 15, color: '#06B6D4' },
  { name: 'Statistics', value: 12, color: '#10B981' },
  { name: 'Physics', value: 8, color: '#F59E0B' },
  { name: 'Linear Alg', value: 5, color: '#EC4899' },
]

const recentSolutions = [
  { id: 1, expression: '∫(3x² + 2x - 5)dx', category: 'Calculus', time: '2 min ago', status: 'solved' },
  { id: 2, expression: '2x² - 4x + 3 = 0', category: 'Algebra', time: '15 min ago', status: 'solved' },
  { id: 3, expression: 'A = πr² for r=5', category: 'Geometry', time: '1 hr ago', status: 'solved' },
  { id: 4, expression: 'det([[1,2],[3,4]])', category: 'Linear Alg', time: '2 hrs ago', status: 'solved' },
  { id: 5, expression: 'P(A|B) = P(B|A)P(A)/P(B)', category: 'Statistics', time: '3 hrs ago', status: 'solved' },
]

const stats = [
  { title: 'Equations Solved', value: '247', change: '+12%', up: true, icon: Calculator, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { title: 'AI Generations', value: '1,892', change: '+8%', up: true, icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { title: 'Day Streak', value: '14', change: '+2', up: true, icon: Flame, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { title: 'Accuracy Rate', value: '97.3%', change: '-0.2%', up: false, icon: Target, color: 'text-green-400', bg: 'bg-green-500/10' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export function DashboardPage() {
  const { setCurrentPage } = useAppStore()
  const { user } = useAuthStore()

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here&apos;s what&apos;s happening with your math journey</p>
        </div>
        <Button
          onClick={() => setCurrentPage('solver')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 glow-blue"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Solution
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="glass-card glass-card-hover transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Activity Chart */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorEquations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="equations" stroke="#3B82F6" fillOpacity={1} fill="url(#colorEquations)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Pie Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryData.slice(0, 4).map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-gray-400">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Solutions & Quick Solve */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Recent Solutions */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Recent Solutions
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-gray-400 text-xs" onClick={() => setCurrentPage('history')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSolutions.map((sol) => (
                <div
                  key={sol.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all cursor-pointer group"
                  onClick={() => setCurrentPage('solver')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium font-mono group-hover:text-blue-300 transition-colors">{sol.expression}</p>
                      <p className="text-xs text-gray-500">{sol.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/5 text-gray-300 border-white/10 text-xs">
                      {sol.category}
                    </Badge>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                      {sol.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Solve */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Quick Solve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">Type an equation to solve instantly</p>
            <div className="space-y-3">
              <textarea
                className="w-full h-24 rounded-xl bg-white/5 border border-white/10 p-3 text-sm font-mono text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 resize-none outline-none transition-all"
                placeholder="Enter equation...&#10;e.g. x² - 5x + 6 = 0"
              />
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0"
                onClick={() => setCurrentPage('solver')}
              >
                Solve Now
              </Button>
            </div>

            {/* Popular categories */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-3">Popular Categories</p>
              <div className="flex flex-wrap gap-2">
                {['Algebra', 'Calculus', 'Geometry', 'Stats'].map((cat) => (
                  <button
                    key={cat}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:border-blue-500/30 hover:text-blue-300 transition-all"
                    onClick={() => setCurrentPage('solver')}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function Zap({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  )
}

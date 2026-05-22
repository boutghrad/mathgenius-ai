'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users, Brain, DollarSign, Activity, TrendingUp,
  TrendingDown, Server, Cpu
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 4200, users: 180 },
  { month: 'Feb', revenue: 5800, users: 240 },
  { month: 'Mar', revenue: 7200, users: 310 },
  { month: 'Apr', revenue: 6900, users: 290 },
  { month: 'May', revenue: 8400, users: 380 },
  { month: 'Jun', revenue: 9600, users: 420 },
]

const generationData = [
  { day: 'Mon', count: 320 },
  { day: 'Tue', count: 450 },
  { day: 'Wed', count: 280 },
  { day: 'Thu', count: 520 },
  { day: 'Fri', count: 390 },
  { day: 'Sat', count: 180 },
  { day: 'Sun', count: 210 },
]

const topUsers = [
  { name: 'Sarah Chen', email: 'sarah@university.edu', plan: 'pro', solutions: 342, joined: 'Jan 2025' },
  { name: 'James Rodriguez', email: 'james@school.org', plan: 'enterprise', solutions: 289, joined: 'Feb 2025' },
  { name: 'Emily Watson', email: 'emily@college.edu', plan: 'pro', solutions: 256, joined: 'Mar 2025' },
  { name: 'Alex Kim', email: 'alex@tech.com', plan: 'pro', solutions: 198, joined: 'Mar 2025' },
  { name: 'Maria Lopez', email: 'maria@uni.es', plan: 'free', solutions: 156, joined: 'Apr 2025' },
]

const systemStats = [
  { label: 'Total Users', value: '12,847', change: '+14.2%', up: true, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'AI Generations', value: '892,156', change: '+22.8%', up: true, icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Monthly Revenue', value: '$9,600', change: '+18.4%', up: true, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'System Uptime', value: '99.97%', change: '-0.01%', up: false, icon: Server, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
]

const planColors: Record<string, string> = {
  free: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  pro: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  enterprise: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
}

export function AdminPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Activity className="w-7 h-7 text-green-400" />
          Admin Panel
        </h1>
        <p className="text-gray-400 text-sm mt-1">System overview and management</p>
      </motion.div>

      {/* System Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {systemStats.map((stat) => (
          <Card key={stat.label} className="glass-card glass-card-hover transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                Revenue & User Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                AI Generations This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* User Management Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Top Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Solutions</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((user) => (
                    <tr key={user.email} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-xs font-semibold text-blue-300">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={`${planColors[user.plan]} text-xs capitalize`}>{user.plan}</Badge>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-300">{user.solutions}</td>
                      <td className="py-3 px-2 text-sm text-gray-500 hidden sm:table-cell">{user.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'API Response', value: '48ms', status: 'healthy' },
                { label: 'CPU Usage', value: '23%', status: 'healthy' },
                { label: 'Memory', value: '4.2 GB / 16 GB', status: 'healthy' },
                { label: 'DB Connections', value: '12 / 100', status: 'healthy' },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <p className="text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search, Filter, Clock, Trash2, Download, Bookmark,
  BookmarkCheck, ChevronDown, ChevronRight, Calculator,
  BookOpen, TrendingUp
} from 'lucide-react'

interface HistoryItem {
  id: string
  expression: string
  category: string
  solution: string
  steps: string
  createdAt: string
  isFavorite: boolean
}

const demoHistory: HistoryItem[] = [
  {
    id: '1',
    expression: '∫(3x² + 2x - 5)dx',
    category: 'calculus',
    solution: 'x³ + x² - 5x + C',
    steps: '[{"number":1,"title":"Apply power rule","description":"Integrate each term separately using the power rule: ∫xⁿdx = xⁿ⁺¹/(n+1)","latex":"\\int 3x^2 dx = x^3"},{"number":2,"title":"Integrate middle term","description":"Apply power rule to 2x","latex":"\\int 2x dx = x^2"},{"number":3,"title":"Integrate constant","description":"The integral of a constant -5 is -5x","latex":"\\int -5 dx = -5x"},{"number":4,"title":"Add constant of integration","description":"Don\'t forget the constant C for indefinite integrals","latex":"x^3 + x^2 - 5x + C"}]',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    isFavorite: true,
  },
  {
    id: '2',
    expression: '2x² - 4x + 3 = 0',
    category: 'algebra',
    solution: 'x = (4 ± √(16-24))/4 → No real solutions',
    steps: '[{"number":1,"title":"Identify coefficients","description":"a=2, b=-4, c=3","latex":"a=2, b=-4, c=3"},{"number":2,"title":"Calculate discriminant","description":"Δ = b² - 4ac = 16 - 24 = -8","latex":"\\Delta = (-4)^2 - 4(2)(3) = -8"},{"number":3,"title":"Analyze discriminant","description":"Since Δ < 0, there are no real solutions","latex":"\\Delta < 0 \\Rightarrow \\text{no real solutions}"}]',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isFavorite: false,
  },
  {
    id: '3',
    expression: 'A = πr² where r = 5',
    category: 'geometry',
    solution: 'A = 25π ≈ 78.54',
    steps: '[{"number":1,"title":"Substitute r=5","description":"A = π(5)² = 25π","latex":"A = \\pi r^2 = \\pi(5)^2 = 25\\pi"},{"number":2,"title":"Calculate numerical value","description":"25π ≈ 78.54","latex":"25\\pi \\approx 78.54"}]',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    isFavorite: true,
  },
  {
    id: '4',
    expression: 'det([[1,2],[3,4]])',
    category: 'linear-algebra',
    solution: 'det = -2',
    steps: '[{"number":1,"title":"Apply determinant formula","description":"For a 2x2 matrix, det = ad - bc","latex":"\\det = (1)(4) - (2)(3) = 4 - 6 = -2"}]',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
  },
  {
    id: '5',
    expression: 'P(A|B) = P(B|A)P(A)/P(B)',
    category: 'statistics',
    solution: "Bayes' theorem verified",
    steps: '[{"number":1,"title":"Bayes theorem","description":"This is the definition of Bayes theorem","latex":"P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}"}]',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
  },
  {
    id: '6',
    expression: 'F = ma where m=10kg, a=9.8m/s²',
    category: 'physics',
    solution: 'F = 98 N',
    steps: '[{"number":1,"title":"Apply Newtons second law","description":"F = ma","latex":"F = ma = 10 \\times 9.8 = 98\\text{N}"}]',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
  },
  {
    id: '7',
    expression: 'lim(x→0) sin(x)/x',
    category: 'calculus',
    solution: '1',
    steps: '[{"number":1,"title":"Standard limit","description":"This is a well-known limit in calculus","latex":"\\lim_{x\\to 0} \\frac{\\sin x}{x} = 1"}]',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
  },
]

const categoryColors: Record<string, string> = {
  algebra: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  calculus: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  geometry: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  statistics: 'text-green-400 bg-green-500/10 border-green-500/20',
  'linear-algebra': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  physics: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showFavorites, setShowFavorites] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>(demoHistory)

  const filtered = history.filter((item) => {
    const matchesSearch = item.expression.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.solution.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesFavorite = !showFavorites || item.isFavorite
    return matchesSearch && matchesCategory && matchesFavorite
  })

  const toggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    )
  }

  const deleteItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Clock className="w-7 h-7 text-cyan-400" />
            Solution History
          </h1>
          <p className="text-gray-400 text-sm mt-1">{history.length} solved equations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`border-white/10 ${showFavorites ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'text-gray-400'}`}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            {showFavorites ? <BookmarkCheck className="w-4 h-4 mr-1" /> : <Bookmark className="w-4 h-4 mr-1" />}
            Favorites
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 text-gray-400">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equations..."
            className="pl-10 bg-white/[0.03] border-white/10 focus:border-blue-500/50 text-white placeholder:text-gray-600"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-44 bg-white/[0.03] border-white/10 text-gray-300">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-white/10">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="algebra">Algebra</SelectItem>
            <SelectItem value="calculus">Calculus</SelectItem>
            <SelectItem value="geometry">Geometry</SelectItem>
            <SelectItem value="statistics">Statistics</SelectItem>
            <SelectItem value="linear-algebra">Linear Algebra</SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* History List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <AnimatePresence>
          {filtered.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No solutions found</p>
                <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                layout
              >
                <Card className="glass-card glass-card-hover transition-all duration-300">
                  <CardContent className="p-4">
                    <button
                      className="w-full text-left"
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            <Calculator className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium font-mono truncate">{item.expression}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{timeAgo(item.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={`${categoryColors[item.category] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'} text-xs`}>
                            {item.category}
                          </Badge>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id) }}
                            className="p-1 hover:bg-white/5 rounded"
                          >
                            {item.isFavorite ? (
                              <BookmarkCheck className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Bookmark className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteItem(item.id) }}
                            className="p-1 hover:bg-red-500/10 rounded text-gray-600 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {expandedId === item.id ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedId === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Answer</p>
                              <p className="text-sm font-mono text-cyan-300">{item.solution}</p>
                            </div>
                            {(() => {
                              try {
                                const steps = JSON.parse(item.steps)
                                return steps.length > 0 ? (
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Steps</p>
                                    <div className="space-y-2">
                                      {steps.map((step: { number: number; title?: string; description: string; latex?: string }) => (
                                        <div key={step.number} className="flex items-start gap-2">
                                          <div className="w-5 h-5 rounded-full bg-blue-500/15 flex items-center justify-center text-[10px] font-bold text-blue-300 shrink-0 mt-0.5">
                                            {step.number}
                                          </div>
                                          <div>
                                            {step.title && <p className="text-xs font-medium text-gray-300">{step.title}</p>}
                                            <p className="text-xs text-gray-400">{step.description}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null
                              } catch {
                                return null
                              }
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

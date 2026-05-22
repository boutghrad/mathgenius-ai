'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/lib/auth-store'
import {
  Calculator, Upload, Sparkles, ChevronDown, ChevronRight,
  Bookmark, Download, Share2, Loader2, X, ImagePlus,
  Sigma, Pi, Sqrt, Infinity, ArrowRightLeft, Type
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'

const categories = [
  { id: 'algebra', label: 'Algebra', icon: 'x²' },
  { id: 'calculus', label: 'Calculus', icon: '∫' },
  { id: 'geometry', label: 'Geometry', icon: '△' },
  { id: 'statistics', label: 'Statistics', icon: 'σ' },
  { id: 'linear-algebra', label: 'Linear Algebra', icon: '[A]' },
  { id: 'physics', label: 'Physics', icon: 'F=ma' },
]

const latexButtons = [
  { label: '∫', insert: '\\int' },
  { label: '∑', insert: '\\sum' },
  { label: '√', insert: '\\sqrt{}' },
  { label: 'π', insert: '\\pi' },
  { label: '∞', insert: '\\infty' },
  { label: '÷', insert: '\\frac{}{}' },
  { label: '×', insert: '\\times' },
  { label: '±', insert: '\\pm' },
  { label: '²', insert: '^2' },
  { label: '³', insert: '^3' },
  { label: '→', insert: '\\rightarrow' },
  { label: '≤', insert: '\\leq' },
  { label: '≥', insert: '\\geq' },
  { label: '≠', insert: '\\neq' },
  { label: 'θ', insert: '\\theta' },
  { label: 'α', insert: '\\alpha' },
]

interface Step {
  number: number
  title: string
  description: string
  latex: string
}

interface GraphSuggestion {
  type: string
  equation: string
  label: string
  xMin: number
  xMax: number
}

interface Solution {
  answer: string
  answerLatex: string
  steps: Step[]
  graphSuggestion: GraphSuggestion | null
}

function generateGraphData(equation: string, xMin: number, xMax: number) {
  const points = []
  const step = (xMax - xMin) / 100
  for (let x = xMin; x <= xMax; x += step) {
    let y = 0
    try {
      const expr = equation
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/log/g, 'Math.log')
        .replace(/exp/g, 'Math.exp')
        .replace(/pi/g, 'Math.PI')
      y = new Function('x', `return ${expr}`)(x)
      if (isFinite(y) && Math.abs(y) < 100) {
        points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(4)) })
      }
    } catch {
      // skip invalid points
    }
  }
  return points
}

export function SolverPage() {
  const [expression, setExpression] = useState('')
  const [category, setCategory] = useState('algebra')
  const [isSolving, setIsSolving] = useState(false)
  const [solution, setSolution] = useState<Solution | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1])
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('editor')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { user } = useAuthStore()

  const insertLatex = useCallback((insert: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const text = expression
      const newExpression = text.substring(0, start) + insert + text.substring(end)
      setExpression(newExpression)
      setTimeout(() => {
        textareaRef.current?.focus()
        textareaRef.current?.setSelectionRange(start + insert.length, start + insert.length)
      }, 0)
    } else {
      setExpression((prev) => prev + insert)
    }
  }, [expression])

  const handleSolve = async () => {
    if (!expression.trim()) return

    setIsSolving(true)
    setError(null)
    setSolution(null)

    try {
      const res = await fetch('/api/math/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expression: expression.trim(),
          category,
          userId: user?.id || 'demo-user-1',
        }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else if (data.solution) {
        setSolution(data.solution)
        setExpandedSteps(data.solution.steps?.map((_: Step, i: number) => i + 1) || [1])
      }
    } catch {
      setError('Failed to connect to AI service. Please try again.')
    } finally {
      setIsSolving(false)
    }
  }

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((n) => n !== stepNumber)
        : [...prev, stepNumber]
    )
  }

  const graphData = solution?.graphSuggestion
    ? generateGraphData(
        solution.graphSuggestion.equation,
        solution.graphSuggestion.xMin || -10,
        solution.graphSuggestion.xMax || 10
      )
    : null

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-400" />
              AI Solver
            </h1>
            <p className="text-gray-400 text-sm mt-1">Enter your math problem and get step-by-step solutions</p>
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                category === cat.id
                  ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300 glow-blue'
                  : 'bg-white/[0.03] border border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'
              }`}
            >
              <span className="font-mono text-xs">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Content - Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          {/* Editor Panel */}
          <div className="flex flex-col min-h-0">
            <Card className="glass-card flex-1 flex flex-col min-h-0">
              <CardContent className="p-4 flex-1 flex flex-col min-h-0">
                {/* LaTeX Toolbar */}
                <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b border-white/5">
                  {latexButtons.map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => insertLatex(btn.insert)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-mono flex items-center justify-center transition-all"
                      title={btn.insert}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Editor Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                  <TabsList className="bg-white/5 border border-white/10 mb-3">
                    <TabsTrigger value="editor" className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                      <Type className="w-3 h-3 mr-1" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="image" className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                      <ImagePlus className="w-3 h-3 mr-1" />
                      Image
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor" className="flex-1 min-h-0 mt-0">
                    <textarea
                      ref={textareaRef}
                      value={expression}
                      onChange={(e) => setExpression(e.target.value)}
                      placeholder="Enter your equation here...&#10;&#10;Examples:&#10;• x² - 5x + 6 = 0&#10;• ∫(3x² + 2x)dx&#10;• sin(x) + cos(x) = 1&#10;• A = πr² where r = 5"
                      className="w-full h-full min-h-[200px] rounded-xl bg-white/[0.02] border border-white/10 p-4 text-sm font-mono text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 resize-none outline-none transition-all"
                    />
                  </TabsContent>

                  <TabsContent value="image" className="flex-1 min-h-0 mt-0">
                    <div className="h-full min-h-[200px] rounded-xl border-2 border-dashed border-white/10 hover:border-blue-500/30 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-600" />
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Drag & drop an image or click to upload</p>
                        <p className="text-xs text-gray-600 mt-1">Supports PNG, JPG, WEBP</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-white/10 text-gray-300">
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Solve Button */}
                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={handleSolve}
                    disabled={isSolving || !expression.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 glow-blue py-5 text-base font-semibold disabled:opacity-50"
                  >
                    {isSolving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Solving...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Solve with AI
                      </>
                    )}
                  </Button>
                  {expression && (
                    <Button variant="ghost" size="icon" onClick={() => { setExpression(''); setSolution(null); setError(null) }} className="text-gray-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Solution Panel */}
          <div className="flex flex-col min-h-0 overflow-y-auto">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="glass-card border-red-500/20">
                    <CardContent className="p-6 text-center">
                      <p className="text-red-400">{error}</p>
                      <Button variant="outline" size="sm" className="mt-4 border-white/10 text-gray-300" onClick={handleSolve}>
                        Try Again
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {solution && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Answer Card */}
                  <Card className="glass-card border-blue-500/20 glow-blue">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/20">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Solution
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className={`h-8 w-8 ${isFavorite ? 'text-amber-400' : 'text-gray-500'}`} onClick={() => setIsFavorite(!isFavorite)}>
                            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Answer</p>
                      <p className="text-xl font-semibold font-mono text-cyan-300">{solution.answer}</p>
                    </CardContent>
                  </Card>

                  {/* Steps */}
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Step-by-Step Solution</p>
                      <div className="space-y-2">
                        {solution.steps?.map((step, index) => (
                          <div key={step.number} className="relative">
                            <button
                              onClick={() => toggleStep(step.number)}
                              className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all text-left group"
                            >
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                                {step.number}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                                    {step.title || `Step ${step.number}`}
                                  </p>
                                  {expandedSteps.includes(step.number) ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                  )}
                                </div>
                                <AnimatePresence>
                                  {expandedSteps.includes(step.number) && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <p className="text-sm text-gray-400 mt-2 leading-relaxed">{step.description}</p>
                                      {step.latex && (
                                        <div className="mt-2 p-3 rounded-lg bg-white/[0.03] font-mono text-sm text-cyan-300">
                                          {step.latex}
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </button>
                            {index < solution.steps.length - 1 && (
                              <div className="absolute left-[13px] top-[38px] bottom-0 w-px bg-gradient-to-b from-blue-500/30 to-transparent" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Graph */}
                  {graphData && graphData.length > 0 && (
                    <Card className="glass-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Graph Visualization</p>
                          <Badge variant="secondary" className="bg-white/5 text-gray-300 border-white/10 text-xs">
                            {solution.graphSuggestion?.label || 'f(x)'}
                          </Badge>
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={graphData}>
                              <defs>
                                <linearGradient id="colorGraph" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="x" stroke="#64748b" fontSize={10} />
                              <YAxis dataKey="y" stroke="#64748b" fontSize={10} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'rgba(0,0,0,0.9)',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                }}
                              />
                              <Area type="monotone" dataKey="y" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorGraph)" strokeWidth={2} dot={false} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}

              {!solution && !error && !isSolving && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Card className="glass-card h-full">
                    <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4 glow-blue">
                        <Calculator className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Ready to Solve</h3>
                      <p className="text-gray-400 text-sm max-w-sm">
                        Enter your math problem in the editor and click &quot;Solve with AI&quot; to get a detailed step-by-step solution.
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {['x² + 3x - 4 = 0', '∫sin(x)dx', '2x + 5 = 15'].map((ex) => (
                          <button
                            key={ex}
                            onClick={() => setExpression(ex)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-mono hover:border-blue-500/30 hover:text-blue-300 transition-all"
                          >
                            {ex}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import React, { useMemo } from 'react'
import katex from 'katex'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const mathSymbols = [
  { label: 'Fraction', symbol: '\\frac{}{}', display: 'a/b' },
  { label: 'Square Root', symbol: '\\sqrt{}', display: '√' },
  { label: 'Integral', symbol: '\\int_{}^{}', display: '∫' },
  { label: 'Summation', symbol: '\\sum_{}^{}', display: 'Σ' },
  { label: 'Pi Product', symbol: '\\prod_{}^{}', display: 'Π' },
  { label: 'Limit', symbol: '\\lim_{x \\to }', display: 'lim' },
  { label: 'Power', symbol: '^{}', display: 'xⁿ' },
  { label: 'Subscript', symbol: '_{}', display: 'xₙ' },
  { label: 'Infinity', symbol: '\\infty', display: '∞' },
  { label: 'Partial', symbol: '\\partial', display: '∂' },
  { label: 'Alpha', symbol: '\\alpha', display: 'α' },
  { label: 'Beta', symbol: '\\beta', display: 'β' },
  { label: 'Gamma', symbol: '\\gamma', display: 'γ' },
  { label: 'Theta', symbol: '\\theta', display: 'θ' },
  { label: 'Lambda', symbol: '\\lambda', display: 'λ' },
  { label: 'Pi', symbol: '\\pi', display: 'π' },
  { label: 'Sigma', symbol: '\\sigma', display: 'σ' },
  { label: 'Delta', symbol: '\\Delta', display: 'Δ' },
  { label: 'Nabla', symbol: '\\nabla', display: '∇' },
  { label: 'Dot Product', symbol: '\\cdot', display: '·' },
  { label: 'Times', symbol: '\\times', display: '×' },
  { label: 'Approx', symbol: '\\approx', display: '≈' },
  { label: 'Not Equal', symbol: '\\neq', display: '≠' },
  { label: 'Less Eq', symbol: '\\leq', display: '≤' },
]

export function MathEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}) {
  const latexHtml = useMemo(() => {
    if (!value.trim()) return ''
    try {
      // Simple LaTeX to display - just render the raw LaTeX with some basic formatting
      // In production, we'd use KaTeX here
      return value
    } catch {
      return value
    }
  }, [value])

  const insertSymbol = (symbol: string) => {
    const textarea = document.querySelector<HTMLTextAreaElement>('[data-math-editor]')
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + symbol + value.substring(end)
      onChange(newValue)
      // Set cursor position after the inserted symbol
      setTimeout(() => {
        textarea.focus()
        const newPos = start + symbol.length
        textarea.setSelectionRange(newPos, newPos)
      }, 0)
    } else {
      onChange(value + symbol)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Symbol Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 glass rounded-xl">
        <TooltipProvider delayDuration={200}>
          {mathSymbols.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertSymbol(item.symbol)}
                  className="h-8 px-2 text-xs font-mono text-muted-foreground hover:text-white hover:bg-white/10"
                >
                  {item.display}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black/90 border-white/10 text-white text-xs">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* LaTeX Input */}
      <Textarea
        data-math-editor
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Enter your equation using LaTeX or natural language...\n\nExamples:\n- x^2 + 3x - 4 = 0\n- \\int_0^1 x^2 dx\n- Solve for x: 2x + 5 = 13'}
        className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 font-mono text-sm resize-none focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl"
      />

      {/* Live Preview */}
      {latexHtml && (
        <div className="p-4 glass rounded-xl">
          <p className="text-xs text-muted-foreground mb-2">LaTeX Preview</p>
          <div className="text-white font-mono text-sm overflow-x-auto">
            <LaTeXPreview latex={value} />
          </div>
        </div>
      )}
    </div>
  )
}

function LaTeXPreview({ latex }: { latex: string }) {
  const renderedHtml = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
        trust: true,
      })
    } catch {
      return `<span class="text-red-400">Invalid LaTeX: ${latex}</span>`
    }
  }, [latex])

  return (
    <div
      className="overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  )
}

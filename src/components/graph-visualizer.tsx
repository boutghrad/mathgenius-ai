'use client'

import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

export interface GraphSuggestion {
  type: 'line' | 'parabola' | 'sine' | 'cosine' | 'exponential'
  equation: string
  range?: [number, number]
}

interface GraphVisualizerProps {
  suggestion?: GraphSuggestion | null
  equation?: string
}

function generateData(type: string, range: [number, number] = [-5, 5]): { x: number; y: number }[] {
  const data: { x: number; y: number }[] = []
  const step = (range[1] - range[0]) / 50

  for (let x = range[0]; x <= range[1]; x += step) {
    let y = 0
    switch (type) {
      case 'line':
        y = 2 * x + 1
        break
      case 'parabola':
        y = x * x - 2
        break
      case 'sine':
        y = Math.sin(x)
        break
      case 'cosine':
        y = Math.cos(x)
        break
      case 'exponential':
        y = Math.exp(x / 3)
        break
      default:
        y = x * x
    }
    data.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 })
  }
  return data
}

export function GraphVisualizer({ suggestion }: GraphVisualizerProps) {
  const data = useMemo(() => {
    if (!suggestion) return []
    const range = suggestion.range || [-5, 5]
    return generateData(suggestion.type, range as [number, number])
  }, [suggestion])

  if (!suggestion || data.length === 0) return null

  const colorMap: Record<string, string> = {
    line: '#3B82F6',
    parabola: '#8B5CF6',
    sine: '#10B981',
    cosine: '#F59E0B',
    exponential: '#EF4444',
  }

  const color = colorMap[suggestion.type] || '#3B82F6'

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white">Graph Visualization</h3>
        <span className="text-xs text-muted-foreground font-mono">{suggestion.equation}</span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${suggestion.type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="x"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="y"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${suggestion.type})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Simple standalone chart for dashboard usage
export function SimpleGraph({
  data,
  dataKey,
  color = '#3B82F6',
  height = 200,
}: {
  data: Record<string, number>[]
  dataKey: string
  color?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="name"
          stroke="rgba(255,255,255,0.2)"
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <YAxis
          stroke="rgba(255,255,255,0.2)"
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '12px',
          }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 3 }}
          activeDot={{ r: 5, fill: color, stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

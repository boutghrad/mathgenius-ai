import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const [totalEquations, equationsByCategory, recentEquations, aiGenerations] = await Promise.all([
      db.equation.count({ where: { userId } }),
      db.equation.groupBy({
        by: ['category'],
        where: { userId },
        _count: { category: true },
      }),
      db.equation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      db.aIGeneration.count({ where: { userId } }),
    ])

    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weekEquations = await db.equation.count({
      where: { userId, createdAt: { gte: weekAgo } },
    })

    // Build weekly data
    const weeklyData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
      const count = await db.equation.count({
        where: { userId, createdAt: { gte: dayStart, lt: dayEnd } },
      })
      weeklyData.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        equations: count,
      })
    }

    const categoryData = equationsByCategory.map((item) => ({
      category: item.category,
      count: item._count.category,
    }))

    return NextResponse.json({
      totalEquations,
      aiGenerations,
      weekEquations,
      weeklyData,
      categoryData,
      recentEquations,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

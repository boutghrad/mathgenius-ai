import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
    }

    if (!password || password.length < 3) {
      return NextResponse.json({ error: 'Password must be at least 3 characters' }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) {
      return NextResponse.json({ error: 'This email is already registered. Try signing in instead.' }, { status: 409 })
    }

    const user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        password,
        plan: 'free',
      },
    })

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, password } = body

    // Validate all fields present
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Please enter your email address' }, { status: 400 })
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your name (at least 2 characters)' }, { status: 400 })
    }

    if (!password || typeof password !== 'string' || password.length < 3) {
      return NextResponse.json({ error: 'Password must be at least 3 characters' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address (e.g. you@example.com)' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    // Check if email already exists
    const existing = await db.user.findUnique({ where: { email: cleanEmail } })
    if (existing) {
      return NextResponse.json({ error: 'This email is already registered. Please sign in instead.' }, { status: 409 })
    }

    // Create the user
    const user = await db.user.create({
      data: {
        email: cleanEmail,
        name: name.trim(),
        password: password,
        plan: 'free',
      },
    })

    console.log(`[Auth] New user created: ${user.email} (${user.id})`)

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
    })
  } catch (error) {
    console.error('[Auth] Signup error:', error)
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 })
  }
}

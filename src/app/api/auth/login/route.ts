import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    // Validate fields
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Please enter your email address' }, { status: 400 })
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Please enter your password' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    // Find user
    const user = await db.user.findUnique({ where: { email: cleanEmail } })

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email. Please sign up first.' }, { status: 401 })
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json({ error: 'Incorrect password. Please try again or create a new account.' }, { status: 401 })
    }

    console.log(`[Auth] User logged in: ${user.email} (${user.id})`)

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
    })
  } catch (error) {
    console.error('[Auth] Login error:', error)
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 })
  }
}

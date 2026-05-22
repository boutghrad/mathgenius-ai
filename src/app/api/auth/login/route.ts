import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: 'Please enter your password' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } })

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email. Please sign up first.' }, { status: 401 })
    }

    if (user.password && user.password !== password) {
      return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 })
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}

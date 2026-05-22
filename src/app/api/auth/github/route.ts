import { NextResponse } from 'next/server'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || ''

export async function GET() {
  if (!GITHUB_CLIENT_ID) {
    return NextResponse.json(
      { error: 'GitHub OAuth is not configured. Please add GITHUB_CLIENT_ID to .env' },
      { status: 500 }
    )
  }

  // Generate a random state for CSRF protection
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize')
  githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID)
  githubAuthUrl.searchParams.set('scope', 'user:email')
  githubAuthUrl.searchParams.set('state', state)

  // Store state in a cookie for verification
  const response = NextResponse.redirect(githubAuthUrl.toString())
  response.cookies.set('github_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  })

  return response
}

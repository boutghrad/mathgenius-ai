import { NextResponse } from 'next/server'

export async function GET() {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID

  if (!GITHUB_CLIENT_ID) {
    console.error('[GitHub Auth] GITHUB_CLIENT_ID is not set in environment variables')
    // Redirect back to auth page with error message instead of returning JSON
    return NextResponse.redirect(
      new URL('/?auth=error&message=GitHub+OAuth+is+not+configured.+Please+add+GITHUB_CLIENT_ID+to+.env', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
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

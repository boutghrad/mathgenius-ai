import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function GET(request: Request) {
  try {
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      console.error('[GitHub Auth] GitHub OAuth credentials not configured')
      return NextResponse.redirect(new URL('/?auth=error&message=GitHub+OAuth+not+configured', BASE_URL))
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
      return NextResponse.redirect(new URL('/?auth=error&message=Missing+authorization+code', BASE_URL))
    }

    // Verify state for CSRF protection
    const cookieState = request.headers.get('cookie')
      ?.split(';')
      .find(c => c.trim().startsWith('github_oauth_state='))
      ?.split('=')[1]

    if (state !== cookieState) {
      console.warn('[GitHub Auth] State mismatch - possible CSRF attack')
      return NextResponse.redirect(new URL('/?auth=error&message=Invalid+state+parameter', BASE_URL))
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error || !tokenData.access_token) {
      console.error('[GitHub Auth] Token exchange error:', tokenData.error || 'No access token received')
      return NextResponse.redirect(new URL('/?auth=error&message=GitHub+authentication+failed', BASE_URL))
    }

    const accessToken = tokenData.access_token

    // Get GitHub user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    const githubUser = await userResponse.json()

    if (!githubUser.id) {
      console.error('[GitHub Auth] Failed to get GitHub user profile')
      return NextResponse.redirect(new URL('/?auth=error&message=Failed+to+get+GitHub+profile', BASE_URL))
    }

    // Get GitHub user emails (primary email might be private)
    let primaryEmail = githubUser.email
    try {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      const emails = await emailResponse.json()
      if (Array.isArray(emails)) {
        primaryEmail = emails.find((e: { primary: boolean; verified: boolean }) => e.primary && e.verified)?.email
          || githubUser.email
          || `${githubUser.id}@github.com`
      }
    } catch {
      // If email fetch fails, use fallback
      primaryEmail = primaryEmail || `${githubUser.id}@github.com`
    }

    const githubId = String(githubUser.id)
    const avatarUrl = githubUser.avatar_url || null
    const userName = githubUser.name || githubUser.login || 'GitHub User'

    // Find or create user in database
    let user = await db.user.findUnique({
      where: { githubId },
    })

    if (user) {
      // Update existing user's info
      user = await db.user.update({
        where: { id: user.id },
        data: {
          name: userName,
          avatar: avatarUrl,
          email: primaryEmail,
        },
      })
      console.log(`[GitHub Auth] Existing user logged in: ${user.email} (${user.id})`)
    } else {
      // Check if a user with this email already exists (linked via email/password)
      user = await db.user.findUnique({
        where: { email: primaryEmail },
      })

      if (user) {
        // Link GitHub account to existing user
        user = await db.user.update({
          where: { id: user.id },
          data: {
            githubId,
            name: userName,
            avatar: avatarUrl,
          },
        })
        console.log(`[GitHub Auth] Linked GitHub account to existing user: ${user.email} (${user.id})`)
      } else {
        // Create new user with GitHub info
        user = await db.user.create({
          data: {
            email: primaryEmail,
            name: userName,
            avatar: avatarUrl,
            githubId,
            plan: 'free',
          },
        })
        console.log(`[GitHub Auth] New user created via GitHub: ${user.email} (${user.id})`)
      }
    }

    // Build user data for the client
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      avatar: user.avatar,
    }

    // Encode user data and redirect to frontend with it
    const encodedUser = encodeURIComponent(JSON.stringify(userData))
    const response = NextResponse.redirect(
      new URL(`/?auth=success&user=${encodedUser}`, BASE_URL)
    )

    // Clear the state cookie
    response.cookies.set('github_oauth_state', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[GitHub Auth] Callback error:', error)
    return NextResponse.redirect(new URL('/?auth=error&message=Server+error+during+authentication', BASE_URL))
  }
}

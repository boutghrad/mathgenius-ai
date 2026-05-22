#!/usr/bin/env node
// Startup script that loads .env before starting the Next.js standalone server
// This is needed because Next.js standalone mode does NOT auto-load .env files
//
// Usage:
//   From project root:    node start.js
//   From standalone dir:  node start.js  (also works)

const path = require('path')
const fs = require('fs')

// Determine if we're in the standalone directory or project root
const isStandalone = fs.existsSync(path.join(__dirname, 'server.js')) &&
                     fs.existsSync(path.join(__dirname, '.next'))

// Find .env file
const envPaths = [
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '..', '..', '.env'),
]

let envLoaded = false
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    // Try dotenv first
    try {
      require('dotenv').config({ path: envPath })
      envLoaded = true
      console.log(`[Startup] Loaded .env from ${envPath} (dotenv)`)
    } catch {
      // dotenv not available, manually parse .env
      const content = fs.readFileSync(envPath, 'utf8')
      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const match = trimmed.match(/^([^=]+)="?(.*)"?$/)
        if (match) {
          const key = match[1].trim()
          const value = match[2].replace(/"$/, '')
          if (!process.env[key]) {
            process.env[key] = value
          }
        }
      }
      envLoaded = true
      console.log(`[Startup] Loaded .env from ${envPath} (manual parser)`)
    }
    break
  }
}

if (!envLoaded) {
  console.warn('[Startup] Warning: No .env file found. Using environment variables only.')
}

// Log critical env vars (without exposing secrets)
console.log('[Startup] Environment check:')
console.log('  GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID ? '✓ Set' : '✗ Missing')
console.log('  GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET ? '✓ Set' : '✗ Missing')
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Missing')
console.log('  NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '(default: http://localhost:3000)')

// Start the standalone server from the correct location
if (isStandalone) {
  // Running from standalone directory directly
  require('./server.js')
} else {
  // Running from project root
  require('./.next/standalone/server.js')
}

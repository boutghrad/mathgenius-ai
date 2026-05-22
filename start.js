#!/usr/bin/env node
// Startup script that loads .env before starting the standalone server
// This is needed because Next.js standalone mode does NOT auto-load .env files

const path = require('path')
const fs = require('fs')

// Try to load dotenv
try {
  require('dotenv').config({ path: path.resolve(__dirname, '.env') })
} catch {
  // dotenv not available, manually parse .env
  const envPath = path.resolve(__dirname, '.env')
  if (fs.existsSync(envPath)) {
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
    console.log('[Startup] Loaded .env manually (dotenv not available)')
  } else {
    console.warn('[Startup] Warning: No .env file found at', envPath)
  }
}

// Log critical env vars (without exposing secrets)
console.log('[Startup] Environment check:')
console.log('  GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID ? '✓ Set' : '✗ Missing')
console.log('  GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET ? '✓ Set' : '✗ Missing')
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Missing')
console.log('  NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '(default: http://localhost:3000)')

// Start the standalone server
require('./.next/standalone/server.js')

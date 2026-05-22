#!/bin/bash
# MathGenius AI - Complete Setup Script
# This script helps you configure Neon PostgreSQL and GitHub OAuth

echo "🚀 MathGenius AI - Setup"
echo "========================"
echo ""

# Check if .env has placeholder values
if grep -q "npg_xxxxx" .env 2>/dev/null; then
  echo "⚠️  Step 1: Neon PostgreSQL Setup"
  echo "   You need to update .env with your Neon connection strings."
  echo ""
  echo "   1. Go to https://console.neon.tech"
  echo "   2. Create a new project called 'mathgenius-ai'"
  echo "   3. Copy the connection strings to .env:"
  echo "      DATABASE_URL=\"postgresql://neondb_owner:npg_YOUR_KEY@...\""
  echo "      DIRECT_URL=\"postgresql://neondb_owner:npg_YOUR_KEY@...\""
  echo ""
fi

if grep -q 'GITHUB_CLIENT_ID=""' .env 2>/dev/null; then
  echo "⚠️  Step 2: GitHub OAuth Setup"
  echo "   You need to create a GitHub OAuth App and add credentials to .env."
  echo ""
  echo "   1. Go to https://github.com/settings/developers"
  echo "   2. Click 'New OAuth App'"
  echo "   3. Fill in:"
  echo "      - Application name: MathGenius AI"
  echo "      - Homepage URL: http://localhost:3000"
  echo "      - Authorization callback URL: http://localhost:3000/api/auth/github/callback"
  echo "   4. Click 'Register application'"
  echo "   5. Copy the Client ID to .env: GITHUB_CLIENT_ID=\"your_id\""
  echo "   6. Click 'Generate a new client secret'"
  echo "   7. Copy the Client Secret to .env: GITHUB_CLIENT_SECRET=\"your_secret\""
  echo ""
fi

# Check if all values are filled in
if ! grep -q "npg_xxxxx" .env 2>/dev/null && ! grep -q 'GITHUB_CLIENT_ID=""' .env 2>/dev/null; then
  echo "✅ All configuration values are set!"
  echo ""
  echo "📦 Generating Prisma client..."
  npx prisma generate

  echo ""
  echo "🗄️  Pushing database schema to Neon..."
  npx prisma db push

  echo ""
  echo "✅ Setup complete! Run 'npm run dev' to start the development server."
  exit 0
fi

echo "After updating .env, run this script again to set up the database."

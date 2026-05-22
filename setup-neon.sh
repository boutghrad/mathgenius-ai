#!/bin/bash
# MathGenius AI - Neon Database Setup Script
# Run this script after setting up your Neon project at https://console.neon.tech

echo "🚀 MathGenius AI - Neon Database Setup"
echo "========================================"
echo ""

# Check if .env has placeholder values
if grep -q "npg_xxxxx" .env 2>/dev/null; then
  echo "⚠️  You need to update .env with your Neon connection strings."
  echo ""
  echo "Steps:"
  echo "  1. Go to https://console.neon.tech"
  echo "  2. Create a new project called 'mathgenius-ai'"
  echo "  3. Copy the connection string"
  echo "  4. Update .env file:"
  echo ""
  echo "     DATABASE_URL=\"postgresql://neondb_owner:npg_YOUR_KEY@ep-YOUR-ID.us-east-2.aws.neon.tech/neondb?sslmode=require\""
  echo "     DIRECT_URL=\"postgresql://neondb_owner:npg_YOUR_KEY@ep-YOUR-ID.us-east-2.aws.neon.tech/neondb?sslmode=require\""
  echo ""
  echo "  5. Run this script again"
  exit 1
fi

echo "📦 Generating Prisma client..."
npx prisma generate

echo ""
echo "🗄️  Pushing database schema to Neon..."
npx prisma db push

echo ""
echo "✅ Database setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"

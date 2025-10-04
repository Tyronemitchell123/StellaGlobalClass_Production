#!/bin/bash

echo "Fix Vercel 404 Script"
echo "======================"
echo ""
echo "This script provides instructions to fix Vercel 404 errors."
echo ""
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo ""
echo "2. Select your project: StellaGlobalClass_Production"
echo ""
echo "3. Go to Settings > General"
echo ""
echo "4. Set Root Directory to: domains/newdomain"
echo ""
echo "5. Save and redeploy"
echo ""
echo "Alternative: Create separate Vercel project for Next.js app"
echo "- Import repo again"
echo "- Set root directory to: domains/newdomain"
echo ""
echo "If using monorepo config, ensure vercel.json is correct:"
echo '{
  "builds": [
    {
      "src": "domains/newdomain/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "domains/newdomain/$1"
    }
  ]
}'
echo ""
echo "Run: vercel --prod"
echo ""
echo "Note: Requires Vercel CLI installed (npm i -g vercel)"

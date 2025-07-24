#!/bin/bash

# 🚀 CycleConnect Quick CLI Deploy
# Minimal interaction deployment script

set -e

echo "🚀 CycleConnect Quick Deploy"
echo "==========================="
echo ""

# Check if we have the tools we need
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Build locally first
echo "🔨 Building project..."
npm install --silent
cd client && npm install --silent && npm run build && cd ..
cd server && npm install --silent && npm run build && cd ..

echo "✅ Build successful!"
echo ""

# Get MongoDB URI
echo "🍃 MongoDB Atlas connection required"
echo "If you don't have MongoDB Atlas set up yet:"
echo "1. Go to https://cloud.mongodb.com/"
echo "2. Create free M0 cluster" 
echo "3. Add database user and whitelist 0.0.0.0/0"
echo ""
read -p "Enter MongoDB URI: " MONGODB_URI

# Generate secrets
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo ""
echo "🚂 Deploying backend to Railway..."

# Railway deployment
if ! railway whoami &> /dev/null; then
    echo "Please login to Railway:"
    railway login
fi

# Create/link project
if ! railway status &> /dev/null; then
    railway new --name "cycleconnect-backend"
fi

# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set MONGODB_URI="$MONGODB_URI"
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
railway variables set CLIENT_URL="https://temp-url.vercel.app"

# Deploy backend
railway up --detach

echo "⏳ Waiting for Railway deployment..."
sleep 15

# Get Railway URL
RAILWAY_URL=$(railway status --json 2>/dev/null | grep -o '"url":"[^"]*"' | cut -d'"' -f4 || echo "")
if [ -z "$RAILWAY_URL" ]; then
    echo "Please enter your Railway URL (check Railway dashboard):"
    read -p "Railway URL: " RAILWAY_URL
fi

echo "✅ Backend deployed: $RAILWAY_URL"
echo ""

echo "🌐 Deploying frontend to Vercel..."

# Vercel deployment
cd client

if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

# Deploy with environment variables
VERCEL_URL=$(vercel --prod --confirm \
    --env VITE_API_URL="$RAILWAY_URL" \
    --env VITE_SOCKET_URL="$RAILWAY_URL" \
    --yes 2>&1 | grep -o 'https://[^[:space:]]*\.vercel\.app' | tail -1)

cd ..

if [ -z "$VERCEL_URL" ]; then
    echo "Please enter your Vercel URL (check Vercel dashboard):"
    read -p "Vercel URL: " VERCEL_URL
fi

echo "✅ Frontend deployed: $VERCEL_URL"
echo ""

# Update backend CORS
echo "🔄 Updating backend CORS..."
railway variables set CLIENT_URL="$VERCEL_URL"
railway up --detach

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "📱 Frontend: $VERCEL_URL"
echo "🚂 Backend:  $RAILWAY_URL"
echo ""
echo "🧪 Test your app:"
echo "1. Visit: $VERCEL_URL"
echo "2. Register a new account"
echo "3. Start cycling!"
echo ""

# Quick test
echo "🔍 Quick health check..."
if curl -s "$RAILWAY_URL/health" > /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "⚠️ Backend might still be starting up"
fi

echo ""
echo "🚴‍♂️ Happy cycling! 🚴‍♀️"

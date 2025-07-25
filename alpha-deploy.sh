#!/bin/bash

# 🚀 Alpha Test Deployment - Get Live in 5 Minutes!
echo "🚀 CycleConnect Alpha Deployment"
echo "================================"
echo ""

echo "🎯 Goal: Get your app live for alpha testing ASAP!"
echo ""

# Check if tools are installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "Option 1: Frontend-Only Deploy (Instant)"
echo "========================================"
echo "Deploy just the frontend with mock data for testing UI/UX"
echo ""

echo "Option 2: Full Stack with MongoDB Atlas"
echo "======================================="
echo "Deploy everything with a fresh MongoDB Atlas setup"
echo ""

echo "Option 3: Use Free MongoDB Service"
echo "=================================="
echo "Use MongoDB Atlas free tier with simplified setup"
echo ""

read -p "Choose option (1, 2, or 3): " choice

case $choice in
    1)
        echo "🌐 Deploying Frontend Only..."
        echo "This will deploy the React app with mock data"
        
        cd client
        
        # Create mock API configuration
        cat > .env.production << 'EOF'
VITE_API_URL=https://jsonplaceholder.typicode.com
VITE_SOCKET_URL=https://jsonplaceholder.typicode.com
EOF
        
        # Deploy to Vercel
        vercel --prod --yes
        
        echo ""
        echo "✅ Frontend deployed!"
        echo "🎉 Your alpha testers can now test the UI at the Vercel URL"
        echo "💡 Note: This uses mock data - implement real backend later"
        ;;
        
    2)
        echo "🔧 Setting up MongoDB Atlas..."
        echo ""
        echo "Quick Atlas Setup:"
        echo "1. Go to https://cloud.mongodb.com/"
        echo "2. Create account/login"
        echo "3. Create new project: 'CycleConnect'"
        echo "4. Create cluster (free M0)"
        echo "5. Add user: cycleconnect / [auto-generate password]"
        echo "6. Whitelist IP: 0.0.0.0/0"
        echo ""
        
        read -p "Enter MongoDB Atlas connection string: " MONGO_URI
        
        if [ -n "$MONGO_URI" ]; then
            echo "🚂 Deploying to Railway..."
            railway login
            railway new cycleconnect-alpha
            railway variables --set "NODE_ENV=production"
            railway variables --set "MONGODB_URI=$MONGO_URI"
            railway variables --set "JWT_SECRET=$(openssl rand -hex 32)"
            railway up --detach
            
            echo "🌐 Deploying frontend..."
            cd client
            BACKEND_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
            vercel --prod --env VITE_API_URL="$BACKEND_URL" --env VITE_SOCKET_URL="$BACKEND_URL"
            
            echo "✅ Full stack deployed!"
        else
            echo "❌ No MongoDB URI provided"
        fi
        ;;
        
    3)
        echo "🆓 Using Free MongoDB Service..."
        echo ""
        echo "Let's use MongoDB Atlas with a super simple setup:"
        echo ""
        
        # Open MongoDB Atlas
        open "https://account.mongodb.com/account/register"
        
        echo "Follow these exact steps:"
        echo "1. Sign up with Google (fastest)"
        echo "2. Create organization: 'Personal'"
        echo "3. Create project: 'CycleConnect'"
        echo "4. Build database → M0 FREE"
        echo "5. Username: admin, Password: password123"
        echo "6. IP Access: 0.0.0.0/0"
        echo "7. Connect → Application → Copy string"
        echo ""
        
        echo "Your connection string will look like:"
        echo "mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/cycleconnect"
        echo ""
        
        read -p "Paste your connection string here: " SIMPLE_MONGO_URI
        
        if [ -n "$SIMPLE_MONGO_URI" ]; then
            echo "🚀 Deploying with simple setup..."
            ./quick-deploy.sh
        fi
        ;;
        
    *)
        echo "❌ Invalid choice"
        ;;
esac

#!/bin/bash

# 🚀 Individual CLI Deployment Commands
# Use these for step-by-step deployment

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 CycleConnect CLI Deployment Commands${NC}"
echo "========================================"
echo ""

echo "Choose deployment method:"
echo ""
echo "1. 🚂 Deploy Backend Only (Railway)"
echo "2. 🌐 Deploy Frontend Only (Vercel)"  
echo "3. 🍃 MongoDB Atlas Setup Guide"
echo "4. 📦 Install CLI Tools"
echo "5. 🔨 Build Project Locally"
echo "6. 🧪 Test Deployed Services"
echo ""
read -p "Enter choice (1-6): " choice

case $choice in
    1)
        echo -e "${BLUE}🚂 Deploying Backend to Railway${NC}"
        echo "================================"
        echo ""
        
        # Install Railway CLI if needed
        if ! command -v railway &> /dev/null; then
            npm install -g @railway/cli
        fi
        
        # Login
        railway login
        
        # Create project if needed
        if ! railway status &> /dev/null; then
            railway new --name "cycleconnect-backend"
        fi
        
        # Prompt for environment variables
        echo "Setting up environment variables..."
        read -p "MongoDB URI: " MONGODB_URI
        
        # Generate secrets
        JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
        JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
        
        # Set variables
        railway variables set NODE_ENV=production
        railway variables set PORT=5000
        railway variables set MONGODB_URI="$MONGODB_URI"
        railway variables set JWT_SECRET="$JWT_SECRET"
        railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
        railway variables set CLIENT_URL="https://your-app.vercel.app"
        
        # Deploy
        railway up
        
        echo -e "${GREEN}✅ Backend deployed!${NC}"
        echo "Update CLIENT_URL after frontend deployment"
        ;;
        
    2)
        echo -e "${BLUE}🌐 Deploying Frontend to Vercel${NC}"
        echo "================================="
        echo ""
        
        # Install Vercel CLI if needed
        if ! command -v vercel &> /dev/null; then
            npm install -g vercel
        fi
        
        # Login
        vercel login
        
        # Get backend URL
        read -p "Railway Backend URL: " BACKEND_URL
        
        # Deploy
        cd client
        vercel --prod \
            --env VITE_API_URL="$BACKEND_URL" \
            --env VITE_SOCKET_URL="$BACKEND_URL"
        cd ..
        
        echo -e "${GREEN}✅ Frontend deployed!${NC}"
        echo "Don't forget to update Railway CLIENT_URL"
        ;;
        
    3)
        echo -e "${BLUE}🍃 MongoDB Atlas Setup Guide${NC}"
        echo "============================="
        echo ""
        echo "1. Go to https://cloud.mongodb.com/"
        echo "2. Create account or sign in"
        echo "3. Create new cluster (M0 Free)"
        echo "4. Database Access → Add User:"
        echo "   - Username: cycleconnect"
        echo "   - Password: [secure password]"
        echo "5. Network Access → Add IP:"
        echo "   - IP Address: 0.0.0.0/0"
        echo "6. Clusters → Connect → Connect Application"
        echo "7. Copy connection string"
        echo ""
        echo "Example connection string:"
        echo "mongodb+srv://cycleconnect:PASSWORD@cluster.mongodb.net/cycleconnect"
        ;;
        
    4)
        echo -e "${BLUE}📦 Installing CLI Tools${NC}"
        echo "======================="
        echo ""
        
        echo "Installing Vercel CLI..."
        npm install -g vercel
        
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
        
        echo -e "${GREEN}✅ CLI tools installed!${NC}"
        ;;
        
    5)
        echo -e "${BLUE}🔨 Building Project Locally${NC}"
        echo "==========================="
        echo ""
        
        echo "Installing dependencies..."
        npm install
        cd client && npm install && cd ..
        cd server && npm install && cd ..
        
        echo "Building client..."
        cd client && npm run build && cd ..
        
        echo "Building server..."
        cd server && npm run build && cd ..
        
        echo -e "${GREEN}✅ Build successful!${NC}"
        ;;
        
    6)
        echo -e "${BLUE}🧪 Testing Deployed Services${NC}"
        echo "============================="
        echo ""
        
        read -p "Backend URL: " BACKEND_URL
        read -p "Frontend URL: " FRONTEND_URL
        
        echo "Testing backend health..."
        if curl -s "$BACKEND_URL/health" > /dev/null; then
            echo -e "${GREEN}✅ Backend healthy${NC}"
        else
            echo -e "${YELLOW}⚠️ Backend not responding${NC}"
        fi
        
        echo "Testing frontend..."
        if curl -s "$FRONTEND_URL" > /dev/null; then
            echo -e "${GREEN}✅ Frontend accessible${NC}"
        else
            echo -e "${YELLOW}⚠️ Frontend not responding${NC}"
        fi
        
        echo "Testing API..."
        curl -X POST "$BACKEND_URL/api/auth/register" \
            -H "Content-Type: application/json" \
            -d '{"email":"test@test.com","password":"test123","profile":{"firstName":"Test","lastName":"User"}}'
        ;;
        
    *)
        echo "Invalid choice"
        ;;
esac

#!/bin/bash

# 🚀 CycleConnect Deployment Script
# This script helps you deploy CycleConnect to Vercel (frontend) and Railway (backend)

set -e  # Exit on any error

echo "🚀 CycleConnect Deployment Helper"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_tools() {
    echo "🔍 Checking required tools..."
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All required tools are installed${NC}"
    echo ""
}

# Install Vercel CLI if needed
install_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
        echo -e "${GREEN}✅ Vercel CLI installed${NC}"
    else
        echo -e "${GREEN}✅ Vercel CLI already installed${NC}"
    fi
    echo ""
}

# Install Railway CLI if needed
install_railway_cli() {
    if ! command -v railway &> /dev/null; then
        echo "📦 Installing Railway CLI..."
        npm install -g @railway/cli
        echo -e "${GREEN}✅ Railway CLI installed${NC}"
    else
        echo -e "${GREEN}✅ Railway CLI already installed${NC}"
    fi
    echo ""
}

# Build and test locally before deployment
build_and_test() {
    echo "🔨 Building and testing locally..."
    
    echo "  📦 Installing dependencies..."
    npm install
    cd client && npm install && cd ..
    cd server && npm install && cd ..
    
    echo "  🏗️ Building client..."
    cd client && npm run build && cd ..
    
    echo "  🏗️ Building server..."
    cd server && npm run build && cd ..
    
    echo -e "${GREEN}✅ Local build successful${NC}"
    echo ""
}

# Deploy frontend to Vercel
deploy_frontend() {
    echo "🌐 Deploying frontend to Vercel..."
    echo ""
    echo -e "${YELLOW}Please follow these steps:${NC}"
    echo "1. Run: vercel"
    echo "2. Link to existing project or create new one"
    echo "3. Set environment variables in Vercel dashboard:"
    echo "   - VITE_API_URL (your Railway backend URL)"
    echo "   - VITE_SOCKET_URL (same as API URL)"
    echo ""
    echo -e "${BLUE}Ready to deploy frontend? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        vercel --prod
        echo -e "${GREEN}✅ Frontend deployed to Vercel${NC}"
    fi
    echo ""
}

# Deploy backend to Railway
deploy_backend() {
    echo "🚂 Deploying backend to Railway..."
    echo ""
    echo -e "${YELLOW}Please follow these steps:${NC}"
    echo "1. Go to https://railway.app"
    echo "2. Connect your GitHub account"
    echo "3. Create new project from GitHub repo"
    echo "4. Select CycleConnect repository"
    echo "5. Set environment variables:"
    echo "   - NODE_ENV=production"
    echo "   - MONGODB_URI=your-mongodb-atlas-connection-string"
    echo "   - JWT_SECRET=your-secure-jwt-secret"
    echo "   - JWT_REFRESH_SECRET=your-secure-refresh-secret"
    echo "   - CLIENT_URL=your-vercel-frontend-url"
    echo ""
    echo -e "${BLUE}Alternative: Use Railway CLI? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        railway login
        railway link
        railway up
        echo -e "${GREEN}✅ Backend deployed to Railway${NC}"
    fi
    echo ""
}

# Setup MongoDB Atlas
setup_mongodb() {
    echo "🍃 MongoDB Atlas Setup Instructions"
    echo "=================================="
    echo ""
    echo "1. Go to https://cloud.mongodb.com/"
    echo "2. Create free account or sign in"
    echo "3. Create new cluster (M0 Free tier)"
    echo "4. Create database user:"
    echo "   - Username: cycleconnect"
    echo "   - Password: [generate secure password]"
    echo "5. Add IP whitelist: 0.0.0.0/0 (allow from anywhere)"
    echo "6. Get connection string and update environment variables"
    echo ""
    echo -e "${YELLOW}💡 Don't forget to replace <password> in connection string!${NC}"
    echo ""
}

# Main deployment flow
main() {
    echo "What would you like to do?"
    echo ""
    echo "1. 🔧 Setup deployment tools"
    echo "2. 🏗️ Build and test locally"
    echo "3. 🍃 MongoDB Atlas setup guide"
    echo "4. 🌐 Deploy frontend (Vercel)"
    echo "5. 🚂 Deploy backend (Railway)"
    echo "6. 🚀 Full deployment (all steps)"
    echo "7. 📋 Show deployment checklist"
    echo ""
    echo -n "Enter your choice (1-7): "
    read -r choice
    echo ""
    
    case $choice in
        1)
            check_tools
            install_vercel_cli
            install_railway_cli
            ;;
        2)
            check_tools
            build_and_test
            ;;
        3)
            setup_mongodb
            ;;
        4)
            check_tools
            install_vercel_cli
            deploy_frontend
            ;;
        5)
            check_tools
            install_railway_cli
            deploy_backend
            ;;
        6)
            check_tools
            install_vercel_cli
            install_railway_cli
            build_and_test
            setup_mongodb
            deploy_backend
            deploy_frontend
            ;;
        7)
            show_checklist
            ;;
        *)
            echo -e "${RED}❌ Invalid choice${NC}"
            exit 1
            ;;
    esac
}

# Show deployment checklist
show_checklist() {
    echo "📋 Deployment Checklist"
    echo "======================"
    echo ""
    echo "✅ Pre-deployment:"
    echo "  □ MongoDB Atlas cluster created"
    echo "  □ Database user created"
    echo "  □ IP whitelist configured"
    echo "  □ Connection string obtained"
    echo "  □ JWT secrets generated"
    echo ""
    echo "✅ Backend (Railway/Render):"
    echo "  □ Repository connected"
    echo "  □ Environment variables set"
    echo "  □ Deployment successful"
    echo "  □ Health check endpoint working"
    echo ""
    echo "✅ Frontend (Vercel):"
    echo "  □ Project created/linked"
    echo "  □ Environment variables set"
    echo "  □ Build successful"
    echo "  □ Domain assigned"
    echo ""
    echo "✅ Testing:"
    echo "  □ Authentication flows working"
    echo "  □ API endpoints responding"
    echo "  □ Socket.IO connections working"
    echo "  □ Database operations successful"
    echo ""
}

# Run main function
main

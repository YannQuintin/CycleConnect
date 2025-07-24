#!/bin/bash

# 🚀 CycleConnect CLI Deployment Script
# Deploys the entire stack from command line

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "🚀 CycleConnect Full CLI Deployment"
echo "===================================="
echo -e "${NC}"

# Check if all required tools are installed
check_dependencies() {
    echo -e "${BLUE}📋 Checking dependencies...${NC}"
    
    local missing_tools=()
    
    if ! command -v node &> /dev/null; then
        missing_tools+=("Node.js")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_tools+=("npm")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_tools+=("Git")
    fi
    
    if ! command -v curl &> /dev/null; then
        missing_tools+=("curl")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing required tools: ${missing_tools[*]}${NC}"
        echo "Please install the missing tools and run again."
        exit 1
    fi
    
    echo -e "${GREEN}✅ All dependencies satisfied${NC}"
    echo ""
}

# Install CLI tools
install_cli_tools() {
    echo -e "${BLUE}📦 Installing deployment tools...${NC}"
    
    # Check and install Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo "  🌐 Installing Vercel CLI..."
        npm install -g vercel
        echo -e "${GREEN}  ✅ Vercel CLI installed${NC}"
    else
        echo -e "${GREEN}  ✅ Vercel CLI already installed${NC}"
    fi
    
    # Check and install Railway CLI
    if ! command -v railway &> /dev/null; then
        echo "  🚂 Installing Railway CLI..."
        npm install -g @railway/cli
        echo -e "${GREEN}  ✅ Railway CLI installed${NC}"
    else
        echo -e "${GREEN}  ✅ Railway CLI already installed${NC}"
    fi
    
    echo ""
}

# Build project locally to verify everything works
build_project() {
    echo -e "${BLUE}🔨 Building project locally...${NC}"
    
    echo "  📦 Installing root dependencies..."
    npm install --silent
    
    echo "  📦 Installing client dependencies..."
    cd client && npm install --silent && cd ..
    
    echo "  📦 Installing server dependencies..."
    cd server && npm install --silent && cd ..
    
    echo "  🏗️ Building client..."
    cd client && npm run build && cd ..
    
    echo "  🏗️ Building server..."
    cd server && npm run build && cd ..
    
    echo -e "${GREEN}✅ Local build successful${NC}"
    echo ""
}

# Generate secure secrets
generate_secrets() {
    echo -e "${BLUE}🔐 Generating secure secrets...${NC}"
    
    # Generate JWT secrets using openssl or node
    if command -v openssl &> /dev/null; then
        JWT_SECRET=$(openssl rand -hex 32)
        JWT_REFRESH_SECRET=$(openssl rand -hex 32)
    else
        JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
        JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    fi
    
    echo -e "${GREEN}✅ Secrets generated${NC}"
    echo ""
}

# Deploy backend to Railway
deploy_backend() {
    echo -e "${BLUE}🚂 Deploying backend to Railway...${NC}"
    
    # Login to Railway
    echo "  🔑 Logging into Railway..."
    if ! railway whoami &> /dev/null; then
        echo "Please login to Railway when prompted:"
        railway login
    else
        echo -e "${GREEN}  ✅ Already logged into Railway${NC}"
    fi
    
    # Initialize Railway project
    echo "  🚀 Setting up Railway project..."
    
    # Check if already linked
    if ! railway status &> /dev/null; then
        echo "Creating new Railway project..."
        railway new --name "cycleconnect-backend"
        echo "Railway project created!"
    else
        echo -e "${GREEN}  ✅ Railway project already linked${NC}"
    fi
    
    # Set environment variables
    echo "  ⚙️ Setting environment variables..."
    
    # Prompt for MongoDB URI
    echo ""
    echo -e "${YELLOW}📊 MongoDB Atlas Setup Required${NC}"
    echo "Please provide your MongoDB Atlas connection string:"
    echo "Format: mongodb+srv://username:password@cluster.mongodb.net/cycleconnect"
    echo ""
    read -p "MongoDB URI: " MONGODB_URI
    
    # Set all environment variables
    railway variables set NODE_ENV=production
    railway variables set PORT=5000
    railway variables set MONGODB_URI="$MONGODB_URI"
    railway variables set JWT_SECRET="$JWT_SECRET"
    railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
    railway variables set CLIENT_URL="https://temp-url.vercel.app"  # Will update later
    
    # Deploy
    echo "  🚀 Deploying to Railway..."
    railway up --detach
    
    # Get the deployment URL
    echo "  🔗 Getting deployment URL..."
    sleep 10  # Wait for deployment to start
    RAILWAY_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    
    if [ -z "$RAILWAY_URL" ]; then
        echo -e "${YELLOW}⚠️ Could not automatically get Railway URL${NC}"
        echo "Please check your Railway dashboard for the URL"
        read -p "Enter your Railway URL: " RAILWAY_URL
    fi
    
    echo -e "${GREEN}✅ Backend deployed to: $RAILWAY_URL${NC}"
    echo ""
    
    # Export for frontend use
    export BACKEND_URL="$RAILWAY_URL"
}

# Deploy frontend to Vercel
deploy_frontend() {
    echo -e "${BLUE}🌐 Deploying frontend to Vercel...${NC}"
    
    # Change to client directory
    cd client
    
    # Login to Vercel
    echo "  🔑 Logging into Vercel..."
    if ! vercel whoami &> /dev/null; then
        echo "Please login to Vercel when prompted:"
        vercel login
    else
        echo -e "${GREEN}  ✅ Already logged into Vercel${NC}"
    fi
    
    # Set environment variables for build
    echo "  ⚙️ Setting environment variables..."
    
    # Create temporary .env file for build
    cat > .env.production << EOF
VITE_API_URL=$BACKEND_URL
VITE_SOCKET_URL=$BACKEND_URL
EOF
    
    # Deploy to Vercel
    echo "  🚀 Deploying to Vercel..."
    
    # Deploy with environment variables
    VERCEL_URL=$(vercel --prod --confirm \
        --env VITE_API_URL="$BACKEND_URL" \
        --env VITE_SOCKET_URL="$BACKEND_URL" \
        --yes 2>&1 | grep -o 'https://[^[:space:]]*\.vercel\.app' | tail -1)
    
    # Clean up temporary env file
    rm -f .env.production
    
    if [ -z "$VERCEL_URL" ]; then
        echo -e "${YELLOW}⚠️ Could not automatically get Vercel URL${NC}"
        echo "Please check your Vercel dashboard for the URL"
        read -p "Enter your Vercel URL: " VERCEL_URL
    fi
    
    echo -e "${GREEN}✅ Frontend deployed to: $VERCEL_URL${NC}"
    
    cd ..
    echo ""
    
    # Export for backend update
    export FRONTEND_URL="$VERCEL_URL"
}

# Update backend with frontend URL
update_backend_cors() {
    echo -e "${BLUE}🔄 Updating backend CORS settings...${NC}"
    
    # Update CLIENT_URL in Railway
    railway variables set CLIENT_URL="$FRONTEND_URL"
    
    # Trigger redeploy
    echo "  🚀 Redeploying backend with updated CORS..."
    railway up --detach
    
    echo -e "${GREEN}✅ Backend updated with frontend URL${NC}"
    echo ""
}

# Test deployment
test_deployment() {
    echo -e "${BLUE}🧪 Testing deployment...${NC}"
    
    # Wait for services to be ready
    echo "  ⏳ Waiting for services to be ready..."
    sleep 20
    
    # Test backend health
    echo "  🏥 Testing backend health..."
    if curl -s "$BACKEND_URL/health" > /dev/null; then
        echo -e "${GREEN}  ✅ Backend is healthy${NC}"
    else
        echo -e "${YELLOW}  ⚠️ Backend health check failed${NC}"
    fi
    
    # Test frontend
    echo "  🌐 Testing frontend..."
    if curl -s "$FRONTEND_URL" > /dev/null; then
        echo -e "${GREEN}  ✅ Frontend is accessible${NC}"
    else
        echo -e "${YELLOW}  ⚠️ Frontend test failed${NC}"
    fi
    
    # Test API registration
    echo "  🔐 Testing API registration..."
    REGISTER_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test-deployment@example.com",
            "password": "TestPassword123!",
            "profile": {
                "firstName": "Test",
                "lastName": "User"
            }
        }' || echo "error")
    
    if echo "$REGISTER_RESPONSE" | grep -q "token"; then
        echo -e "${GREEN}  ✅ API registration working${NC}"
    else
        echo -e "${YELLOW}  ⚠️ API registration test failed${NC}"
        echo "  Response: $REGISTER_RESPONSE"
    fi
    
    echo ""
}

# Display deployment summary
show_summary() {
    echo -e "${CYAN}"
    echo "🎉 Deployment Complete!"
    echo "======================"
    echo -e "${NC}"
    
    echo -e "${GREEN}✅ CycleConnect is now live in production!${NC}"
    echo ""
    echo -e "${BLUE}📱 Frontend (Vercel):${NC}"
    echo "   $FRONTEND_URL"
    echo ""
    echo -e "${BLUE}🚂 Backend (Railway):${NC}"
    echo "   $BACKEND_URL"
    echo ""
    echo -e "${BLUE}🧪 Test your deployment:${NC}"
    echo "   1. Visit: $FRONTEND_URL"
    echo "   2. Register a new account"
    echo "   3. Login and explore features"
    echo ""
    echo -e "${BLUE}🔧 Manage your deployments:${NC}"
    echo "   • Vercel Dashboard: https://vercel.com/dashboard"
    echo "   • Railway Dashboard: https://railway.app/dashboard"
    echo ""
    echo -e "${BLUE}📚 Next steps:${NC}"
    echo "   • Set up custom domain"
    echo "   • Configure monitoring"
    echo "   • Set up CI/CD pipelines"
    echo "   • Add error tracking"
    echo ""
    echo -e "${GREEN}Happy cycling! 🚴‍♂️🚴‍♀️${NC}"
}

# MongoDB Atlas setup guide
show_mongodb_guide() {
    echo -e "${YELLOW}"
    echo "🍃 MongoDB Atlas Setup Required"
    echo "==============================="
    echo -e "${NC}"
    echo "If you haven't set up MongoDB Atlas yet:"
    echo ""
    echo "1. Go to: https://cloud.mongodb.com/"
    echo "2. Create free account"
    echo "3. Create M0 cluster (free tier)"
    echo "4. Database Access → Add user"
    echo "   • Username: cycleconnect"
    echo "   • Password: [generate secure password]"
    echo "5. Network Access → Add IP"
    echo "   • IP: 0.0.0.0/0 (allow from anywhere)"
    echo "6. Connect → Connect your application"
    echo "   • Copy connection string"
    echo ""
    echo -e "${YELLOW}💡 Replace <password> in connection string with your actual password${NC}"
    echo ""
}

# Error handling
handle_error() {
    echo -e "${RED}"
    echo "❌ Deployment failed!"
    echo "===================="
    echo -e "${NC}"
    echo "Error occurred in: $1"
    echo ""
    echo "Common solutions:"
    echo "• Check internet connection"
    echo "• Verify CLI tool authentication"
    echo "• Check MongoDB Atlas connection string"
    echo "• Review service dashboards for errors"
    echo ""
    echo "For help, check the logs above or contact support."
    exit 1
}

# Main deployment flow
main() {
    # Show intro
    echo -e "${PURPLE}This script will deploy CycleConnect to production using:${NC}"
    echo "• 🌐 Vercel (Frontend)"
    echo "• 🚂 Railway (Backend)"
    echo "• 🍃 MongoDB Atlas (Database - you'll need to set this up)"
    echo ""
    
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 0
    fi
    
    echo ""
    
    # Show MongoDB guide
    show_mongodb_guide
    read -p "Press Enter when MongoDB Atlas is ready..."
    echo ""
    
    # Run deployment steps
    trap 'handle_error "Unknown step"' ERR
    
    (trap 'handle_error "Dependency check"' ERR; check_dependencies)
    (trap 'handle_error "CLI tool installation"' ERR; install_cli_tools)
    (trap 'handle_error "Project build"' ERR; build_project)
    (trap 'handle_error "Secret generation"' ERR; generate_secrets)
    (trap 'handle_error "Backend deployment"' ERR; deploy_backend)
    (trap 'handle_error "Frontend deployment"' ERR; deploy_frontend)
    (trap 'handle_error "Backend CORS update"' ERR; update_backend_cors)
    (trap 'handle_error "Deployment testing"' ERR; test_deployment)
    
    # Show success summary
    show_summary
}

# Run the deployment
main "$@"

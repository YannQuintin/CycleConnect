# 🚀 CLI Deployment One-Liners

## Quick Deploy (All-in-One)
```bash
./quick-deploy.sh
# or
npm run deploy:quick
```

## Full Deploy (Step-by-Step)
```bash
./deploy-cli.sh  
# or
npm run deploy
```

## Individual Commands

### Setup Tools
```bash
npm install -g vercel @railway/cli
# or
npm run deploy:setup
```

### Backend Only (Railway)
```bash
# Install CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway new --name "cycleconnect-backend"
railway variables set NODE_ENV=production PORT=5000 MONGODB_URI="your-mongo-uri" JWT_SECRET="$(openssl rand -hex 32)" JWT_REFRESH_SECRET="$(openssl rand -hex 32)"
railway up
```

### Frontend Only (Vercel)
```bash
# Install CLI
npm install -g vercel

# Login and deploy
vercel login
cd client
vercel --prod --env VITE_API_URL="your-railway-url" --env VITE_SOCKET_URL="your-railway-url"
```

### MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com/
2. Create M0 cluster (free)
3. Add user: `cycleconnect` / `[password]`
4. Whitelist IP: `0.0.0.0/0`
5. Get connection string

## Environment Variables

### Backend (Railway)
```bash
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/db"
railway variables set JWT_SECRET="$(openssl rand -hex 32)"
railway variables set JWT_REFRESH_SECRET="$(openssl rand -hex 32)"
railway variables set CLIENT_URL="https://your-app.vercel.app"
```

### Frontend (Vercel)
```bash
vercel env add VITE_API_URL production
vercel env add VITE_SOCKET_URL production
```

## Test Deployment
```bash
# Health check
curl https://your-backend.railway.app/health

# API test
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","profile":{"firstName":"Test","lastName":"User"}}'
```

## Update After Deployment
```bash
# Update backend with frontend URL
railway variables set CLIENT_URL="https://your-frontend.vercel.app"
railway up --detach
```

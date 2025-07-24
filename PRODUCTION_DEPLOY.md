# 🚀 CycleConnect Production Deployment Guide

## Quick Deploy (5 minutes!)

### Prerequisites
- GitHub account with CycleConnect repository
- Node.js 18+ installed
- Git configured

### Step 1: MongoDB Atlas (Database) 🍃
1. **Sign up**: Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Create Cluster**: Choose M0 (Free tier)
3. **Database Access**: Create user `cycleconnect` with password
4. **Network Access**: Add IP `0.0.0.0/0` (allow from anywhere)
5. **Connect**: Copy connection string

### Step 2: Railway (Backend) 🚂
1. **Sign up**: Go to [Railway](https://railway.app/)
2. **New Project**: Deploy from GitHub repo
3. **Select**: Your CycleConnect repository
4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://cycleconnect:YOUR_PASSWORD@cluster.mongodb.net/cycleconnect
   JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long
   JWT_REFRESH_SECRET=your-super-secure-refresh-secret-at-least-32-characters
   CLIENT_URL=https://your-app.vercel.app
   ```
5. **Deploy**: Railway will auto-deploy
6. **Copy URL**: Save your Railway app URL

### Step 3: Vercel (Frontend) 🌐
1. **Sign up**: Go to [Vercel](https://vercel.com/)
2. **Import**: Connect GitHub and import CycleConnect
3. **Configure**: 
   - Framework: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-railway-app.railway.app
   VITE_SOCKET_URL=https://your-railway-app.railway.app
   ```
5. **Deploy**: Vercel will build and deploy

### Step 4: Update Railway with Vercel URL 🔄
1. **Go back to Railway**
2. **Update** `CLIENT_URL` environment variable
3. **Set to**: Your Vercel app URL
4. **Redeploy**: Railway will restart with new settings

## Automated Deployment

Run our deployment helper:
```bash
./deploy.sh
```

## Manual CLI Deployment

### Install CLIs
```bash
npm install -g vercel @railway/cli
```

### Deploy Backend (Railway)
```bash
railway login
railway link
railway up
```

### Deploy Frontend (Vercel)
```bash
cd client
vercel --prod
```

## Environment Variables Cheat Sheet

### Backend (Railway)
| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | production | production |
| `PORT` | 5000 | 5000 |
| `MONGODB_URI` | MongoDB Atlas connection string | mongodb+srv://... |
| `JWT_SECRET` | 32+ character secret | your-secret-key |
| `JWT_REFRESH_SECRET` | 32+ character secret | your-refresh-secret |
| `CLIENT_URL` | Vercel app URL | https://app.vercel.app |

### Frontend (Vercel)
| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Railway app URL | https://app.railway.app |
| `VITE_SOCKET_URL` | Railway app URL | https://app.railway.app |

## Testing Your Deployment

### 1. Health Check
```bash
curl https://your-railway-app.railway.app/health
```

### 2. Authentication Test
```bash
curl -X POST https://your-railway-app.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "password123", "profile": {"firstName": "Test", "lastName": "User"}}'
```

### 3. Frontend Test
Visit your Vercel URL and try:
- Registration
- Login
- Creating a ride
- Chat functionality

## Troubleshooting

### Common Issues

#### "Cannot connect to database"
- ✅ Check MongoDB Atlas IP whitelist
- ✅ Verify connection string in Railway
- ✅ Ensure database user has correct permissions

#### "CORS errors"
- ✅ Verify `CLIENT_URL` in Railway matches Vercel URL
- ✅ Check both URLs are HTTPS in production

#### "Build failed"
- ✅ Check Node.js version (should be 18+)
- ✅ Verify all dependencies are in package.json
- ✅ Check build logs for specific errors

#### "Authentication not working"
- ✅ Verify JWT secrets are set in Railway
- ✅ Check API URL in Vercel environment variables
- ✅ Test endpoints directly with curl

### Debug Commands

#### Check Railway logs
```bash
railway logs
```

#### Check Vercel logs
```bash
vercel logs
```

#### Local production build test
```bash
# Test backend
cd server
npm run build
npm start

# Test frontend  
cd client
npm run build
npm run preview
```

## Performance Optimization

### Backend Optimizations
- Enable compression middleware
- Add response caching
- Optimize MongoDB indexes
- Use connection pooling

### Frontend Optimizations
- Enable Vercel Edge Functions
- Implement code splitting
- Optimize images and assets
- Use service workers

## Security Checklist

- ✅ Strong JWT secrets (32+ characters)
- ✅ HTTPS enforced (automatic with Vercel/Railway)
- ✅ CORS properly configured
- ✅ Environment variables secured
- ✅ Database connection secured
- ✅ Input validation enabled
- ✅ Rate limiting implemented

## Monitoring and Analytics

### Add Error Tracking
1. **Sentry**: Add error tracking
2. **LogRocket**: Session replay
3. **DataDog**: Application monitoring

### Add Analytics
1. **Google Analytics**: User tracking
2. **Mixpanel**: Event tracking
3. **Hotjar**: User behavior

## Scaling Considerations

### Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas for read-heavy workloads
- Sharding for large datasets

### Application Scaling
- Railway auto-scaling
- CDN optimization via Vercel
- Database connection pooling

## Custom Domain Setup

### Vercel Custom Domain
1. Go to Vercel dashboard
2. Project Settings → Domains
3. Add your domain
4. Update DNS records

### Railway Custom Domain
1. Go to Railway dashboard  
2. Settings → Domains
3. Add custom domain
4. Update DNS records

## Backup Strategy

### Database Backups
- MongoDB Atlas automated backups
- Point-in-time recovery
- Cross-region backup replication

### Code Backups
- GitHub repository (primary)
- Multiple deployment environments
- Tagged releases

## Cost Optimization

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month
- **Railway**: 500 hours/month
- **MongoDB Atlas**: 512MB storage

### Monitoring Usage
- Check dashboards regularly
- Set up usage alerts
- Optimize based on metrics

## Next Steps After Deployment

1. **Set up monitoring** 📊
2. **Configure alerts** 🚨  
3. **Add custom domain** 🌐
4. **Implement analytics** 📈
5. **Set up CI/CD** 🔄
6. **Add error tracking** 🐛
7. **Performance optimization** ⚡
8. **Security hardening** 🔒

---

🎉 **Congratulations!** Your CycleConnect app is now live in production!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app
- **Database**: MongoDB Atlas cluster

Happy cycling! 🚴‍♂️🚴‍♀️

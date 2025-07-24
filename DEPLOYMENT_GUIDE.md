# CycleConnect Deployment Guide 🚀

## Recommended Hosting Architecture

### Frontend: Vercel
- **Cost**: Free tier (perfect for your needs)
- **Features**: Automatic deployments, global CDN, zero config
- **URL**: Will get a custom domain like `cycleconnect.vercel.app`

### Backend: Railway or Render
- **Cost**: Free tier available
- **Features**: Easy GitHub integration, environment variables
- **Database**: Can connect to MongoDB Atlas

### Database: MongoDB Atlas
- **Cost**: Free 512MB cluster
- **Features**: Managed MongoDB, global deployment

## Environment Variables Needed

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cycleconnect
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.railway.app
VITE_SOCKET_URL=https://your-backend-domain.railway.app
```

## Deployment Steps

### 1. MongoDB Atlas Setup
1. Create account at mongodb.com/atlas
2. Create free cluster
3. Setup database user
4. Get connection string
5. Whitelist IP addresses (0.0.0.0/0 for development)

### 2. Backend Deployment (Railway)
1. Go to railway.app
2. Connect GitHub account
3. Deploy from CycleConnect repo
4. Set environment variables
5. Deploy server folder

### 3. Frontend Deployment (Vercel)
1. Go to vercel.com
2. Connect GitHub account
3. Import CycleConnect repo
4. Set build command: `cd client && npm run build`
5. Set output directory: `client/dist`
6. Add environment variables

### 4. Domain Configuration
- Update CORS settings in backend
- Update API URLs in frontend
- Test all functionality

## Production Checklist
- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Railway/Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Socket.io connections working
- [ ] Authentication flow tested
- [ ] Real-time chat functional

## Estimated Costs
- **Development/Demo**: $0/month (all free tiers)
- **Small Production**: $5-15/month
- **Scaling**: $20-50/month

## Security Notes
- Use strong JWT secrets in production
- Enable HTTPS everywhere
- Implement rate limiting
- Monitor for unusual activity

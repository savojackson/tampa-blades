# 🚀 Deployment Guide for Tampa Blades

This guide provides step-by-step instructions for deploying Tampa Blades to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database schema migrated
- [ ] API keys obtained and tested
- [ ] Build process tested locally
- [ ] Security review completed

## 🌐 Frontend Deployment (Vercel)

### Option 1: Git Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Deploy with Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Vercel will automatically detect it's a React app
   - Set environment variables in Vercel dashboard

3. **Environment Variables in Vercel:**
   ```
   REACT_APP_API_URL=https://your-backend-api.vercel.app
   REACT_APP_ENVIRONMENT=production
   REACT_APP_SITE_NAME=Tampa Blades
   ```

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add REACT_APP_API_URL
vercel env add REACT_APP_ENVIRONMENT
```

## 🖥️ Backend Deployment Options

### Option 1: Vercel (Serverless)

**Pros:** Easy integration, automatic scaling
**Cons:** Cold starts, function limitations

1. **Prepare for Serverless:**
   ```bash
   cd backend
   
   # Create vercel.json if not exists
   cat > vercel.json << EOF
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ]
   }
   EOF
   ```

2. **Deploy Backend:**
   ```bash
   vercel
   ```

3. **Set Environment Variables:**
   ```bash
   vercel env add NODE_ENV production
   vercel env add JWT_SECRET
   vercel env add DATABASE_URL
   vercel env add GOOGLE_PLACES_API_KEY
   vercel env add OPENWEATHER_API_KEY
   ```

### Option 2: Railway (Recommended for Backend)

**Pros:** Persistent storage, better for databases
**Cons:** Not free tier

1. **Connect to Railway:**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the backend folder

2. **Configure Build:**
   ```
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=your_secure_jwt_secret
   DATABASE_URL=your_postgres_connection_string
   GOOGLE_PLACES_API_KEY=your_api_key
   OPENWEATHER_API_KEY=your_api_key
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

### Option 3: Render

**Pros:** Free tier available, good for small apps
**Cons:** Slower than paid options

1. **Connect Repository:**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository

2. **Configure Service:**
   ```
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```

## 🗄️ Database Setup for Production

### Option 1: Vercel Postgres (Recommended)

```bash
# Create Vercel Postgres database
vercel postgres create

# Get connection string
vercel env ls

# Add to your backend environment variables
vercel env add DATABASE_URL
```

### Option 2: Supabase

1. **Create Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project

2. **Get Connection String:**
   ```
   postgresql://postgres:[password]@[host]:5432/[database]
   ```

3. **Run Migrations:**
   ```bash
   DATABASE_URL="your_connection_string" npm run migrate
   ```

### Option 3: PlanetScale

1. **Create Database:**
   - Go to [planetscale.com](https://planetscale.com)
   - Create new database

2. **Get Connection String:**
   ```bash
   # Install PlanetScale CLI
   brew install planetscale/tap/pscale

   # Connect and get URL
   pscale connect your-database
   ```

## 🔧 Environment Variables Guide

### Backend (.env)
```env
# Production Backend Environment Variables
NODE_ENV=production
PORT=4000

# Security
JWT_SECRET=your_very_secure_jwt_secret_min_32_chars

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# API Keys
GOOGLE_PLACES_API_KEY=your_google_places_api_key
OPENWEATHER_API_KEY=your_openweather_api_key

# CORS
FRONTEND_URL=https://your-frontend-domain.vercel.app

# File Uploads
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Frontend (.env)
```env
# Production Frontend Environment Variables
REACT_APP_API_URL=https://your-backend-api.railway.app
REACT_APP_ENVIRONMENT=production
REACT_APP_SITE_NAME=Tampa Blades
REACT_APP_SITE_DESCRIPTION=Skate Community Platform
```

## 🔒 Security Checklist

### Backend Security
- [ ] JWT secret is cryptographically secure (32+ characters)
- [ ] Environment variables are not committed to Git
- [ ] Database connection uses SSL
- [ ] API rate limiting is enabled
- [ ] File upload validation is in place
- [ ] CORS is properly configured

### Frontend Security
- [ ] No sensitive data in environment variables
- [ ] HTTPS is enabled
- [ ] Content Security Policy is configured
- [ ] XSS protection is enabled

## 📊 Performance Optimization

### Frontend Optimizations
```bash
# Analyze bundle size
npm run build
npm install -g serve
serve -s build

# Check performance
npm install -g lighthouse
lighthouse http://localhost:5000
```

### Backend Optimizations
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Tampa Blades

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
          REACT_APP_ENVIRONMENT: production
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE }}
```

## 🐛 Troubleshooting Deployment

### Common Issues

1. **Build Failures:**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variable Issues:**
   ```bash
   # Check environment variables
   vercel env ls
   
   # Update environment variables
   vercel env rm VARIABLE_NAME
   vercel env add VARIABLE_NAME
   ```

3. **Database Connection Issues:**
   ```bash
   # Test database connection
   node -e "
   const db = require('./backend/database/connection');
   db.connect().then(() => console.log('Connected')).catch(console.error);
   "
   ```

4. **CORS Issues:**
   - Ensure `FRONTEND_URL` is set correctly in backend
   - Check that frontend URL matches exactly (no trailing slash)

### Performance Issues

1. **Slow Load Times:**
   - Enable gzip compression
   - Optimize images
   - Use CDN for assets

2. **Cold Starts (Serverless):**
   - Consider using Railway/Render for backend
   - Implement health check endpoints
   - Use serverless-friendly optimizations

## 📈 Monitoring and Analytics

### Error Tracking
- Integrate Sentry for error tracking
- Set up log aggregation
- Monitor API response times

### Analytics
- Google Analytics for user tracking
- Custom events for skate spot interactions
- Performance monitoring with Core Web Vitals

## 🔄 Update Process

### Frontend Updates
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel deploys automatically
```

### Backend Updates
```bash
cd backend
git add .
git commit -m "Update backend"
git push origin main
# Railway/Render deploys automatically
```

### Database Updates
```bash
# Run migrations on production
DATABASE_URL="production_url" npm run migrate
```

## 📞 Support

If you encounter deployment issues:

1. Check the platform-specific documentation
2. Review logs in deployment platform dashboard
3. Test locally with production environment variables
4. Create an issue in the repository with:
   - Platform being used
   - Error messages
   - Steps to reproduce

---

**Happy deploying! 🚀**
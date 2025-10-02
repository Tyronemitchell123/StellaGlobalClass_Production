# Vercel Deployment Guide
## Stella Global Class Production Server

**Status:** 🚀 Ready for Deployment
**Last Updated:** January 2025

---

## Prerequisites

1. **GitHub Account** - Create at https://github.com
2. **Vercel Account** - Create at https://vercel.com (sign in with GitHub)
3. **Git Installed** - Download from https://git-scm.com
4. **Node.js Installed** - v16+ required

---

## Step 1: Clean Up Repository

Run the cleanup script to remove backup files:

```bash
cleanup-backups.bat
```

This will remove 24 backup files and keep only the essential project files.

---

## Step 2: Initialize Git Repository

```bash
cd SuggestlyG4Plus_Projects-1
git init
git add .
git commit -m "Initial commit: Stella Global Class Production Server with testing and security"
```

---

## Step 3: Create GitHub Repository

### Option A: Using GitHub CLI (Recommended)

```bash
# Install GitHub CLI if not installed
# Download from: https://cli.github.com

# Login to GitHub
gh auth login

# Create repository
gh repo create stella-global-class-production --public --source=. --remote=origin --push

# Or for private repository
gh repo create stella-global-class-production --private --source=. --remote=origin --push
```

### Option B: Using GitHub Website

1. Go to https://github.com/new
2. Repository name: `stella-global-class-production`
3. Description: "Stella Global Class Production Server with Premium Features"
4. Choose Public or Private
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

Then connect your local repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/stella-global-class-production.git
git branch -M main
git push -u origin main
```

---

## Step 4: Set Up Vercel Project

### Method 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (this will create the project)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? stella-global-class-production
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Method 2: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** ./
   - **Build Command:** (leave empty)
   - **Output Directory:** public
   - **Install Command:** npm install

5. Add Environment Variables (if needed):
   - `NODE_ENV` = `production`
   - `ALLOWED_ORIGINS` = `https://yourdomain.com`

6. Click "Deploy"

---

## Step 5: Configure GitHub Secrets

For automatic deployments via GitHub Actions, add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"

Add these secrets:

### VERCEL_TOKEN
1. Go to https://vercel.com/account/tokens
2. Create new token
3. Copy and paste as `VERCEL_TOKEN`

### VERCEL_ORG_ID
1. Go to https://vercel.com/account
2. Copy your Team/User ID
3. Paste as `VERCEL_ORG_ID`

### VERCEL_PROJECT_ID
1. Go to your Vercel project settings
2. Copy the Project ID
3. Paste as `VERCEL_PROJECT_ID`

---

## Step 6: Enable Automatic Deployments

Once GitHub secrets are configured, every push to `main` or `master` will:

1. ✅ Run tests automatically
2. ✅ Deploy to Vercel
3. ✅ Update production site
4. ✅ Generate deployment URL

---

## Step 7: Verify Deployment

After deployment, verify:

```bash
# Check health endpoint
curl https://your-project.vercel.app/health

# Check metrics
curl https://your-project.vercel.app/api/metrics

# Check security status
curl https://your-project.vercel.app/api/security-status
```

---

## Features Enabled

### ✅ Live Data Features
- Click "Server Running" badge to see live metrics
- Click "View Live" buttons to see real-time API data
- Auto-updating metrics every 5 seconds
- Real-time server health monitoring

### ✅ Access Request System
- Click "Request Access" button
- Fill out the form
- Requests are logged and stored
- View all requests at `/api/access-requests`

### ✅ Security Features Active
- **Rate Limiting:** 100 requests/15min (general), 50 requests/15min (API)
- **Helmet.js:** Security headers configured
- **CORS:** Cross-origin requests controlled
- **Compression:** Response compression enabled
- **Input Validation:** Email and required fields validated
- **Error Handling:** Graceful error responses

### ✅ Monitoring Endpoints
- `/health` - Server health check
- `/api/metrics` - Performance metrics
- `/api/security-status` - Security configuration
- `/api/access-requests` - Access request log

---

## Deployment Commands

### Deploy to Production
```bash
# Using Vercel CLI
vercel --prod

# Or push to GitHub (auto-deploys)
git add .
git commit -m "Update: description of changes"
git push origin main
```

### Deploy Preview
```bash
# Using Vercel CLI
vercel

# Or create pull request on GitHub
```

### Rollback Deployment
```bash
# List deployments
vercel ls

# Promote a previous deployment
vercel promote [deployment-url]
```

---

## Environment Variables

Create `.env.production` file (DO NOT commit this):

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Add these to Vercel dashboard under Project Settings → Environment Variables.

---

## Custom Domain Setup

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

---

## Monitoring & Logs

### View Logs
```bash
# Vercel CLI
vercel logs

# Or view in Vercel dashboard
# Project → Deployments → Click deployment → Logs
```

### Monitor Performance
- Vercel Analytics (enable in project settings)
- Custom monitoring at `/api/metrics`
- Health checks at `/health`

---

## Troubleshooting

### Build Fails
- Check `vercel.json` configuration
- Verify `package.json` scripts
- Check Node.js version compatibility

### Deployment Fails
- Verify GitHub secrets are set correctly
- Check Vercel token permissions
- Review deployment logs

### Site Not Loading
- Check DNS configuration
- Verify deployment status
- Check error logs

---

## Continuous Deployment Workflow

```
1. Make changes locally
   ↓
2. Test locally (npm test)
   ↓
3. Commit changes (git commit)
   ↓
4. Push to GitHub (git push)
   ↓
5. GitHub Actions runs tests
   ↓
6. Auto-deploy to Vercel
   ↓
7. Site updated automatically
```

---

## Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use environment variables for secrets
3. ✅ Enable HTTPS (automatic on Vercel)
4. ✅ Configure CORS properly
5. ✅ Use rate limiting
6. ✅ Keep dependencies updated
7. ✅ Monitor access logs
8. ✅ Regular security audits

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **GitHub Actions:** https://docs.github.com/actions
- **Project Protection:** See PROJECT-PROTECTION-README.md
- **Testing Guide:** See COMPREHENSIVE-TESTING-PLAN.md

---

## Quick Reference

### Important URLs
- **Local:** http://localhost:3000
- **Vercel:** https://your-project.vercel.app
- **GitHub:** https://github.com/YOUR_USERNAME/stella-global-class-production

### Important Commands
```bash
# Start locally
npm start

# Run tests
npm test

# Deploy to Vercel
vercel --prod

# View logs
vercel logs

# Check deployment status
vercel ls
```

---

**Status:** ✅ Ready for Deployment
**Last Updated:** January 2025

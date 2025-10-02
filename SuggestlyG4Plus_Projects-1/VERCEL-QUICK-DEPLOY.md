# Quick Vercel Deployment Guide
## Stella Global Class Production Server

**Your Vercel Account:** https://vercel.com/tyrone-mitchell-s-projects

---

## 🚀 Quick Deploy Steps

### Option 1: Deploy from Current Directory (Recommended)

```bash
# Navigate to project directory
cd SuggestlyG4Plus_Projects-1

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? tyrone-mitchell-s-projects
# - Link to existing project? No (first time) or Yes (if exists)
# - Project name? stella-global-class (or your choice)
# - Directory? ./ (current directory)
# - Override settings? No

# After deployment, set environment variables:
vercel env add OPENAI_API_KEY
# Paste your API key when prompted
# Select: Production

vercel env add NODE_ENV
# Enter: production
# Select: Production

vercel env add ALLOWED_ORIGINS
# Enter: https://your-domain.vercel.app
# Select: Production

# Redeploy with environment variables:
vercel --prod
```

### Option 2: Deploy Specific Server File

```bash
cd SuggestlyG4Plus_Projects-1
vercel --prod
```

---

## 📋 Pre-Deployment Checklist

### Required Files (All Present ✅)
- [x] `auto-start-production-enhanced.js` - Main server file
- [x] `package.json` - Dependencies
- [x] `vercel.json` - Vercel configuration
- [x] `.env.example` - Environment template
- [x] `public/index.html` - Landing page

### Environment Variables to Set
1. **OPENAI_API_KEY** - Your OpenAI API key
2. **NODE_ENV** - Set to "production"
3. **ALLOWED_ORIGINS** - Your Vercel domain
4. **PORT** - Vercel sets this automatically

---

## 🔧 Vercel Configuration

Your `vercel.json` is already configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "auto-start-production-enhanced.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "auto-start-production-enhanced.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## 🌐 After Deployment

### Your Deployment URL
After deployment, you'll get a URL like:
- `https://stella-global-class.vercel.app`
- Or: `https://your-project-name.vercel.app`

### Test Your Deployment
```bash
# Health check
curl https://your-project-name.vercel.app/health

# Metrics
curl https://your-project-name.vercel.app/api/metrics

# Open in browser
vercel open
```

### View Deployment Dashboard
```bash
# Open project in Vercel dashboard
vercel open

# View deployment logs
vercel logs
```

---

## 🔐 Setting Environment Variables

### Via CLI (Recommended)
```bash
# Add environment variable
vercel env add VARIABLE_NAME

# List all environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME
```

### Via Dashboard
1. Go to https://vercel.com/tyrone-mitchell-s-projects
2. Select your project
3. Go to Settings → Environment Variables
4. Add your variables:
   - `OPENAI_API_KEY` = your-api-key
   - `NODE_ENV` = production
   - `ALLOWED_ORIGINS` = https://your-domain.vercel.app

---

## 📊 Monitoring Your Deployment

### View Logs
```bash
# Real-time logs
vercel logs --follow

# Recent logs
vercel logs
```

### View Analytics
```bash
# Open analytics dashboard
vercel open
# Then click on "Analytics" tab
```

### Check Deployment Status
```bash
# List all deployments
vercel ls

# Get deployment info
vercel inspect
```

---

## 🔄 Redeployment

### After Making Changes
```bash
# Commit changes to Git
git add .
git commit -m "Update: description"
git push

# Redeploy to Vercel
vercel --prod
```

### Automatic Deployments
If you connected to GitHub:
- Every push to main branch = automatic deployment
- Pull requests = preview deployments

---

## 🐛 Troubleshooting

### Issue: Build Failed
**Solution:**
```bash
# Check build logs
vercel logs

# Test locally first
npm install
node auto-start-production-enhanced.js
```

### Issue: Environment Variables Not Working
**Solution:**
```bash
# List current env vars
vercel env ls

# Re-add missing variables
vercel env add VARIABLE_NAME

# Redeploy
vercel --prod
```

### Issue: 404 Errors
**Solution:**
- Check `vercel.json` routes configuration
- Ensure all files are included in deployment
- Check `.vercelignore` file

---

## 📱 Custom Domain (Optional)

### Add Custom Domain
```bash
# Add domain via CLI
vercel domains add yourdomain.com

# Or via dashboard:
# 1. Go to project settings
# 2. Click "Domains"
# 3. Add your domain
# 4. Follow DNS configuration instructions
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:
- [ ] Landing page loads: `https://your-domain.vercel.app`
- [ ] Health check works: `/health`
- [ ] API endpoints respond: `/api/metrics`, `/api/premium`
- [ ] Access request form works
- [ ] Live data features work
- [ ] No console errors
- [ ] Environment variables set correctly
- [ ] SSL certificate active (automatic)

---

## 🎯 Quick Commands Reference

```bash
# Deploy
vercel

# Deploy to production
vercel --prod

# Open in browser
vercel open

# View logs
vercel logs

# List deployments
vercel ls

# Add environment variable
vercel env add VAR_NAME

# List environment variables
vercel env ls

# Remove deployment
vercel rm deployment-url
```

---

## 📞 Support

### Vercel Documentation
- https://vercel.com/docs
- https://vercel.com/docs/cli

### Your Vercel Dashboard
- https://vercel.com/tyrone-mitchell-s-projects

### Project Documentation
- `VERCEL-DEPLOYMENT-GUIDE.md` - Detailed guide
- `TESTING-COMPLETE-SUMMARY.md` - Testing results
- `OPENAI-API-SETUP.md` - API key setup

---

**Ready to Deploy?** Run: `vercel --prod` 🚀

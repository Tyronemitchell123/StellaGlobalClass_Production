# 🚀 Stella Global Class Production - Automated Deployment Guide

## Overview
This repository contains a comprehensive web application deployment setup with both static and dynamic components, featuring automated deployment scripts for Windows.

## Architecture

### Static Landing Page (GitHub Pages)
- **Branch:** `main`
- **Technology:** HTML/CSS/JavaScript
- **Deployment:** GitHub Pages
- **URL:** https://tyronemitchell123.github.io/StellaGlobalClass_Production/

### Next.js Application (Vercel)
- **Branch:** `nextjs-app`
- **Technology:** Next.js 13 with App Router
- **Deployment:** Vercel
- **URL:** https://stella-global-class-production.vercel.app

## Automated Deployment Scripts

### Quick Deploy (All Components)
```batch
deploy-all.bat
```

### Individual Deployments
```batch
REM Static site only
deploy-github-pages.bat

REM Next.js app only
deploy-vercel.bat
```

### CI/CD Pipeline
- **Trigger:** Push to `main` or `nextjs-app` branches
- **Static Site:** Automatic GitHub Pages deployment
- **Next.js App:** Automatic Vercel deployment

## Configuration

### Environment Variables
Create `.env.local` for local development:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=your-database-url
```

### Vercel Configuration
Set these in Vercel project settings:
- `NEXTAUTH_URL` - Production URL
- `NEXTAUTH_SECRET` - Secure random string
- `DATABASE_URL` - PostgreSQL connection string

## Monitoring & Analytics

### Vercel Analytics (Automatic)
- Real-time traffic metrics
- Performance monitoring
- Core Web Vitals
- Error tracking

### Performance Targets
- **Load Time:** < 2 seconds
- **Lighthouse Score:** > 95
- **Uptime:** 99.9%
- **Global Reach:** 35+ CDN locations

## Security

### Automatic Security Features
- SSL/TLS certificates
- Security headers
- XSS protection
- CSRF protection

## Troubleshooting

### Build Failures
1. Check Vercel deployment logs
2. Verify environment variables
3. Ensure all dependencies are installed

### Performance Issues
1. Check Core Web Vitals in Vercel dashboard
2. Run Lighthouse audit
3. Optimize images and assets

### Deployment Issues
1. Verify GitHub/Vercel permissions
2. Check branch names match
3. Ensure build commands are correct

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Pages:** https://docs.github.com/en/pages

## Deployment Checklist

### Pre-Deployment
- [ ] Code committed and tested
- [ ] Environment variables configured
- [ ] Domain settings verified
- [ ] SSL certificates ready

### Deployment
- [ ] Static site deployed to GitHub Pages
- [ ] Next.js app deployed to Vercel
- [ ] Both URLs accessible
- [ ] Mobile responsiveness verified

### Post-Deployment
- [ ] Analytics configured
- [ ] Monitoring alerts set up
- [ ] Performance metrics reviewed
- [ ] Backup strategy implemented

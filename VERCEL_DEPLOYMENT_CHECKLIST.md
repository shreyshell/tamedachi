# Vercel Deployment Checklist for Tamedachi

Use this checklist to ensure a smooth deployment to Vercel.

## Pre-Deployment Checklist

### 1. Code Preparation
- [x] All code committed to Git
- [x] Build passes locally (`npm run build`)
- [x] Tests pass (`npm run test`)
- [x] No TypeScript errors
- [x] `.env.local` is in `.gitignore`
- [x] `.env.local.example` is up to date

### 2. Database Setup
- [ ] Supabase project is created
- [ ] Database migrations are applied
- [ ] Row Level Security (RLS) is enabled on all tables
- [ ] RLS policies are configured correctly
- [ ] Database indexes are created

### 3. API Keys Ready
- [ ] Supabase URL and keys available
- [ ] OpenAI API key available and has credits
- [ ] All keys are valid and tested locally

### 4. GitHub Repository
- [ ] Code pushed to GitHub
- [ ] Repository is accessible
- [ ] Main branch is up to date

## Vercel Deployment Steps

### Step 1: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** next to your GitHub repository
4. If repository not visible:
   - Click **"Adjust GitHub App Permissions"**
   - Grant access to your repository

### Step 2: Configure Project Settings

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `./` (leave as default)

**Build Settings**:
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

**Node.js Version**: 20.x (recommended)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add each variable:

#### For All Environments (Production, Preview, Development)

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Your Supabase project URL
   - Example: `https://xxxxx.supabase.co`
   - Environments: ✓ Production, ✓ Preview, ✓ Development

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Your Supabase anonymous key
   - Environments: ✓ Production, ✓ Preview, ✓ Development

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Value: Your Supabase service role key
   - ⚠️ KEEP SECRET - Server-side only
   - Environments: ✓ Production, ✓ Preview, ✓ Development

4. **OPENAI_API_KEY**
   - Value: Your OpenAI API key
   - ⚠️ KEEP SECRET - Server-side only
   - Environments: ✓ Production, ✓ Preview, ✓ Development

#### Environment-Specific Variables

5. **NEXT_PUBLIC_APP_URL**
   - Production: `https://your-app.vercel.app` (or custom domain)
   - Preview: `https://your-app-git-main.vercel.app`
   - Development: `http://localhost:3000`

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (usually 1-2 minutes)
3. Vercel will show deployment status and logs

### Step 5: Verify Deployment

Once deployed, click **"Visit"** to open your app.

#### Test Checklist

- [ ] App loads without errors
- [ ] Login page displays correctly
- [ ] Can create new account
- [ ] Can log in with credentials
- [ ] Egg displays for new users
- [ ] Egg hatching animation works (3 taps)
- [ ] Pet is created and displays
- [ ] Three navigation buttons appear
- [ ] URL input modal opens (center button)
- [ ] Can submit a URL for analysis
- [ ] OpenAI analysis completes successfully
- [ ] Score displays with correct color (green ≥50, red <50)
- [ ] Pet health updates after submission
- [ ] Health status modal works (left button)
- [ ] Growth timeline modal works (right button)
- [ ] Responsive design works on mobile
- [ ] No console errors in browser DevTools

## Post-Deployment Configuration

### 1. Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records:
   - Type: `A` or `CNAME`
   - Follow Vercel's instructions
4. Wait for DNS propagation (can take up to 48 hours)
5. Update `NEXT_PUBLIC_APP_URL` to your custom domain

### 2. Enable Analytics

1. Go to **Analytics** tab
2. Enable **Web Analytics**
3. Monitor:
   - Page views
   - Performance metrics
   - Core Web Vitals

### 3. Configure Deployment Protection (Optional)

1. Go to **Settings** → **Deployment Protection**
2. Options:
   - Password protection for preview deployments
   - Vercel Authentication
   - Custom authentication

### 4. Set Up Monitoring

1. Go to **Settings** → **Integrations**
2. Consider adding:
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

## Continuous Deployment

Vercel automatically deploys:

### Production Deployments
- **Trigger**: Push to `main` branch
- **URL**: Your production domain
- **Environment**: Production variables

### Preview Deployments
- **Trigger**: Push to any branch or open PR
- **URL**: Unique preview URL per branch
- **Environment**: Preview variables
- **Use case**: Test changes before merging

### Deployment Settings

Go to **Settings** → **Git** to configure:
- [ ] Auto-deploy on push (recommended: ✓)
- [ ] Deploy preview for all branches (recommended: ✓)
- [ ] Ignored build step (leave empty)

## Troubleshooting

### Build Fails

**Check build logs:**
1. Go to **Deployments**
2. Click on failed deployment
3. View **Build Logs**

**Common issues:**
- Missing environment variables → Add in Settings
- TypeScript errors → Fix and push again
- Dependency issues → Check `package.json`

### Runtime Errors

**Check function logs:**
1. Go to **Deployments** → Click deployment
2. View **Functions** tab
3. Check logs for API routes

**Common issues:**
- Supabase connection errors → Verify credentials
- OpenAI API errors → Check API key and credits
- Database errors → Verify RLS policies

### Environment Variable Issues

**Symptoms:**
- "undefined" errors in console
- API connection failures
- Authentication not working

**Solutions:**
1. Go to **Settings** → **Environment Variables**
2. Verify all variables are set
3. Check for typos in variable names
4. Redeploy after adding/updating variables

### Performance Issues

**Check metrics:**
1. Go to **Analytics** tab
2. Review Core Web Vitals
3. Check function execution times

**Optimization tips:**
- Enable Vercel Edge Network
- Optimize images with Next.js Image
- Review API route performance
- Consider caching strategies

## Rollback Procedure

If deployment has critical issues:

1. Go to **Deployments**
2. Find last working deployment
3. Click **⋯** (three dots)
4. Select **"Promote to Production"**
5. Confirm promotion

## Security Checklist

- [ ] All secrets are in environment variables (not in code)
- [ ] `.env.local` is not committed to Git
- [ ] Service role key is only used server-side
- [ ] OpenAI API key is only used in API routes
- [ ] RLS is enabled on all Supabase tables
- [ ] HTTPS is enforced (automatic with Vercel)
- [ ] Security headers are configured (see `vercel.json`)

## Monitoring Checklist

- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] OpenAI API usage monitored
- [ ] Supabase database usage monitored
- [ ] Set up alerts for critical errors

## Next Steps After Deployment

1. **Test thoroughly** - Go through all user flows
2. **Monitor logs** - Watch for errors in first 24 hours
3. **Check performance** - Review analytics and metrics
4. **Gather feedback** - Share with test users
5. **Plan improvements** - Based on real usage data

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs

---

## Quick Reference: Vercel CLI (Optional)

Install Vercel CLI:
```bash
npm i -g vercel
```

Deploy from command line:
```bash
vercel                    # Deploy to preview
vercel --prod            # Deploy to production
vercel env ls            # List environment variables
vercel logs              # View deployment logs
```

---

**Your Tamedachi is ready to thrive in production! 🐾✨**

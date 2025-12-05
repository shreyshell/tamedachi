# Tamedachi Deployment Guide

This guide covers deploying Tamedachi to Vercel with proper environment variable configuration.

## Prerequisites

- GitHub account with repository access
- Vercel account (free tier works)
- Supabase project (already configured)
- OpenAI API key (already configured)

## Environment Variables

### Required Variables

All environment variables follow the naming conventions specified in the design document:

#### Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### OpenAI Configuration
```bash
OPENAI_API_KEY=your_openai_api_key
```

#### App Configuration
```bash
NEXT_PUBLIC_APP_URL=https://your-production-domain.vercel.app
```

### Development Setup

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your actual values in `.env.local`

3. **Never commit `.env.local`** - it's already in `.gitignore`

### Production Setup (Vercel)

Environment variables for production are configured in the Vercel dashboard. See the "Vercel Deployment" section below.

## Local Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Vercel Deployment

### Step 1: Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository containing Tamedachi

### Step 2: Configure Build Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)
- **Development Command**: `npm run dev` (default)

### Step 3: Configure Environment Variables

In the Vercel project settings, add these environment variables:

1. Go to **Settings** → **Environment Variables**

2. Add each variable for **Production**, **Preview**, and **Development** environments:

   | Variable Name | Value | Environments |
   |--------------|-------|--------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Production, Preview, Development |
   | `OPENAI_API_KEY` | Your OpenAI API key | Production, Preview, Development |
   | `NEXT_PUBLIC_APP_URL` | Your production URL (e.g., `https://tamedachi.vercel.app`) | Production |
   | `NEXT_PUBLIC_APP_URL` | Your preview URL (e.g., `https://tamedachi-git-main.vercel.app`) | Preview |
   | `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Development |

3. Click "Save" after adding each variable

### Step 4: Deploy

1. Click "Deploy" to start the initial deployment
2. Vercel will:
   - Install dependencies
   - Run the build command
   - Deploy to production
   - Provide a production URL

### Step 5: Verify Deployment

After deployment completes:

1. Visit your production URL
2. Test the authentication flow:
   - Sign up with a new account
   - Verify email/password login works
3. Test the egg hatching:
   - Tap the egg 3 times
   - Verify pet creation
4. Test URL submission:
   - Submit a test URL
   - Verify OpenAI analysis works
   - Check pet health updates
5. Test all three modals:
   - Health Status (left button)
   - URL Input (center button)
   - Growth Timeline (right button)

## Post-Deployment Checklist

- [ ] Authentication works (sign up, login, logout)
- [ ] Egg hatching animation plays correctly
- [ ] Pet displays with correct health state
- [ ] URL submission and analysis works
- [ ] OpenAI API integration functions
- [ ] Database operations succeed (pet creation, submissions)
- [ ] All three navigation buttons work
- [ ] Modals open and close properly
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] No console errors in browser
- [ ] Environment variables are properly set

## Continuous Deployment

Vercel automatically deploys:

- **Production**: When you push to `main` branch
- **Preview**: When you push to any other branch or open a PR

### Preview Deployments

Every pull request gets a unique preview URL for testing before merging.

## Troubleshooting

### Build Failures

**Error: Missing environment variables**
- Solution: Add all required environment variables in Vercel dashboard

**Error: TypeScript compilation errors**
- Solution: Run `npm run build` locally to catch errors before deploying

**Error: Module not found**
- Solution: Ensure all dependencies are in `package.json`, not just `devDependencies`

### Runtime Errors

**Error: Supabase connection failed**
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Verify Supabase project is active and accessible

**Error: OpenAI API errors**
- Verify `OPENAI_API_KEY` is valid and has credits
- Check OpenAI API status page

**Error: Database operations fail**
- Verify Row Level Security (RLS) policies are enabled
- Check that migrations have been applied to production database

### Performance Issues

**Slow page loads**
- Check Vercel Analytics for performance metrics
- Verify images are optimized
- Check OpenAI API response times

**High API costs**
- Monitor OpenAI API usage
- Implement caching for repeated URL analyses (future enhancement)

## Monitoring

### Vercel Analytics

Enable Vercel Analytics to monitor:
- Page load times
- Core Web Vitals
- Error rates
- Traffic patterns

### Error Tracking

Check Vercel logs for:
- API route errors
- Build errors
- Runtime errors

Access logs: **Vercel Dashboard** → **Your Project** → **Logs**

## Security Best Practices

1. **Never commit secrets**: Keep `.env.local` in `.gitignore`
2. **Rotate keys regularly**: Update API keys periodically
3. **Use service role key carefully**: Only use in server-side code
4. **Enable RLS**: Ensure Row Level Security is enabled on all Supabase tables
5. **Monitor API usage**: Watch for unusual OpenAI API usage patterns

## Rollback

If a deployment has issues:

1. Go to **Vercel Dashboard** → **Deployments**
2. Find the last working deployment
3. Click the three dots → **Promote to Production**

## Custom Domain (Optional)

To use a custom domain:

1. Go to **Settings** → **Domains**
2. Add your domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs

## Next Steps

After successful deployment:

1. Set up monitoring and alerts
2. Configure custom domain (optional)
3. Enable Vercel Analytics
4. Plan for Phase 2 features (see design.md)
5. Gather user feedback
6. Monitor pet health calculations and user engagement

---

**Your Tamedachi is ready to help users navigate their media consumption! 🎉**

# 🚀 Deploy Tamedachi Now!

**Ready to launch your Tamedachi? Follow these 5 simple steps.**

---

## Step 1: Run Pre-Deployment Check ✅

```bash
npm run pre-deploy
```

This verifies everything is ready. If it passes, continue!

---

## Step 2: Push to GitHub 📤

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

---

## Step 3: Import to Vercel 🔗

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Import Git Repository"**
3. Select your Tamedachi repository
4. Click **"Import"**

---

## Step 4: Add Environment Variables 🔐

In Vercel, go to **Settings** → **Environment Variables** and add these **5 variables**:

### Copy from your `.env.local` file:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Paste your Supabase URL
   - ✓ Production, ✓ Preview, ✓ Development

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Paste your Supabase anon key
   - ✓ Production, ✓ Preview, ✓ Development

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Paste your Supabase service role key
   - ✓ Production, ✓ Preview, ✓ Development

4. **OPENAI_API_KEY**
   - Paste your OpenAI API key
   - ✓ Production, ✓ Preview, ✓ Development

5. **NEXT_PUBLIC_APP_URL**
   - For Production: `https://your-app.vercel.app` (you'll get this after first deploy)
   - For Preview: `https://your-app-git-main.vercel.app`
   - For Development: `http://localhost:3000`

**Tip**: Add the first 4 variables to all environments, then come back and update `NEXT_PUBLIC_APP_URL` after your first deployment.

---

## Step 5: Deploy! 🎉

1. Click **"Deploy"** in Vercel
2. Wait 1-2 minutes for build to complete
3. Click **"Visit"** to see your live Tamedachi!

---

## Post-Deployment: Test Your App ✨

Visit your Vercel URL and test:

- [ ] **Sign up** with a new account
- [ ] **Tap the egg** 3 times to hatch your pet
- [ ] **Submit a URL** for analysis
- [ ] **Check pet health** (left button)
- [ ] **View growth timeline** (right button)

If everything works, **congratulations!** 🎊 Your Tamedachi is live!

---

## Update Production URL

After first deployment:

1. Copy your Vercel URL (e.g., `https://tamedachi.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_APP_URL` for **Production**
4. Paste your Vercel URL
5. **Redeploy** (Deployments → ⋯ → Redeploy)

---

## Need Help? 🆘

- **Detailed Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Checklist**: See [VERCEL_DEPLOYMENT_CHECKLIST.md](./VERCEL_DEPLOYMENT_CHECKLIST.md)
- **Troubleshooting**: See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

---

## Continuous Deployment 🔄

From now on, every time you push to `main`:
- Vercel automatically deploys to production
- You get a deployment notification
- Your changes go live in ~2 minutes

For testing changes before production:
- Push to a different branch (e.g., `develop`)
- Vercel creates a preview deployment
- Test on the preview URL
- Merge to `main` when ready

---

## Quick Commands

```bash
# Before deploying
npm run pre-deploy      # Verify everything is ready

# Deploy
git push origin main    # Triggers automatic deployment

# Monitor
vercel logs            # View deployment logs (requires Vercel CLI)
```

---

**Your Tamedachi is ready to help users build better media literacy! 🐾✨**

**Next**: Share your app and watch your users' pets grow! 🌱

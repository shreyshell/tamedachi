# GitHub Repository Setup

Your Tamedachi project needs to be connected to GitHub before deploying to Vercel.

## Quick Setup (5 minutes)

### Step 1: Create GitHub Repository

1. Go to **[github.com/new](https://github.com/new)**
2. Fill in the details:
   - **Repository name**: `tamedachi` (or your preferred name)
   - **Description**: "A gamified media health tracker with virtual pet"
   - **Visibility**: Choose Private or Public
   - **Important**: Do NOT check any of these boxes:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
   
   (You already have these files locally)

3. Click **"Create repository"**

### Step 2: Connect Your Local Repository

After creating the repository, GitHub will show you commands. Copy your repository URL and run:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/tamedachi.git

# Ensure you're on main branch
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Example:**
If your GitHub username is `johndoe`, the command would be:
```bash
git remote add origin https://github.com/johndoe/tamedachi.git
```

### Step 3: Verify Connection

```bash
# Check that remote is configured
git remote -v

# You should see:
# origin  https://github.com/YOUR_USERNAME/tamedachi.git (fetch)
# origin  https://github.com/YOUR_USERNAME/tamedachi.git (push)
```

### Step 4: Push Your Code

```bash
git push -u origin main
```

You may be prompted to authenticate with GitHub. Use one of these methods:
- **Personal Access Token** (recommended)
- **GitHub CLI** (`gh auth login`)
- **SSH key**

---

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Login to GitHub (if not already)
gh auth login

# Create repository and push in one command
gh repo create tamedachi --private --source=. --remote=origin --push
```

---

## Troubleshooting

### "Authentication failed"

**Solution 1: Use Personal Access Token**
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Generate and copy the token
5. Use the token as your password when pushing

**Solution 2: Use GitHub CLI**
```bash
gh auth login
```

**Solution 3: Use SSH**
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add to GitHub: [github.com/settings/keys](https://github.com/settings/keys)
3. Use SSH URL: `git remote set-url origin git@github.com:YOUR_USERNAME/tamedachi.git`

### "Repository already exists"

If you already have a repository with this name:

**Option A: Use existing repository**
```bash
git remote add origin https://github.com/YOUR_USERNAME/tamedachi.git
git push -u origin main
```

**Option B: Use different name**
Create a new repository with a different name (e.g., `tamedachi-app`)

### "Updates were rejected"

If the remote has commits you don't have locally:

```bash
# Pull and merge
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

---

## After Successful Push

Once your code is on GitHub, you can:

1. ✅ **Deploy to Vercel** - Import your GitHub repository
2. ✅ **Enable CI/CD** - GitHub Actions will run automatically
3. ✅ **Collaborate** - Share repository with team members
4. ✅ **Track changes** - Full version history on GitHub

---

## Next Steps

After pushing to GitHub:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your `tamedachi` repository
4. Follow the deployment steps in **DEPLOY_NOW.md**

---

## Quick Reference

```bash
# Check current remote
git remote -v

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/tamedachi.git

# Change remote URL
git remote set-url origin https://github.com/YOUR_USERNAME/tamedachi.git

# Remove remote
git remote remove origin

# Push to GitHub
git push -u origin main

# Future pushes (after first push)
git push
```

---

**Need help?** Check GitHub's guide: [Adding a remote](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories)

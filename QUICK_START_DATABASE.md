# 🚀 Quick Start: Database Setup

## Apply Migrations (5 minutes)

### Step 1: Open Supabase
Visit: https://app.supabase.com/project/bjobybzqnkplkraanqbm/editor

### Step 2: Run SQL
Click **SQL Editor** → **New Query**

### Step 3: Copy & Run Migration 1
Copy all of: `supabase/migrations/20241206000001_create_pets_table.sql`
Paste and click **Run**

### Step 4: Copy & Run Migration 2
Copy all of: `supabase/migrations/20241206000002_create_content_submissions_table.sql`
Paste and click **Run**

### Step 5: Verify
```bash
node scripts/verify-database.mjs
```

Should see: ✨ Database setup verified successfully!

## What You Get

✅ `pets` table - stores your Tamedachi
✅ `content_submissions` table - tracks media quality
✅ Row Level Security - data isolation per user
✅ Indexes - fast queries
✅ TypeScript types - type-safe database access

## Files Created

- 📁 `supabase/migrations/` - SQL migration files
- 📁 `lib/types/database.ts` - TypeScript types
- 📁 `lib/supabase/client.ts` - Browser client
- 📁 `lib/supabase/server.ts` - Server client
- 📄 `SUPABASE_SETUP.md` - Detailed guide

## Need Help?

See `SUPABASE_SETUP.md` for detailed instructions and troubleshooting.

---

**Your Tamedachi database is ready to hatch! 🥚✨**

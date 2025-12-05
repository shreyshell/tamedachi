# 🐾 Step-by-Step Database Setup

Having network issues? No worries! Run these smaller SQL files one at a time.

## 📍 Where to Run

Open Supabase SQL Editor: https://app.supabase.com/project/bjobybzqnkplkraanqbm/editor

## 🚀 Run in Order

For each file below:
1. Click **New Query** in SQL Editor
2. Copy the file contents
3. Paste and click **Run**
4. Wait for "Success" message
5. Move to next file

### Pets Table Setup

✅ **01_create_pets_table.sql** - Creates the pets table
✅ **02_create_pets_index.sql** - Adds index for fast queries
✅ **03_enable_pets_rls.sql** - Enables security
✅ **04_create_pets_policies.sql** - Sets up access rules
✅ **05_create_updated_at_function.sql** - Auto-update timestamp
✅ **06_create_pets_trigger.sql** - Connects trigger to table

### Content Submissions Table Setup

✅ **07_create_submissions_table.sql** - Creates submissions table
✅ **08_create_submissions_indexes.sql** - Adds indexes
✅ **09_enable_submissions_rls.sql** - Enables security
✅ **10_create_submissions_policies.sql** - Sets up access rules

## ✨ After All Steps

Run verification:
```bash
node scripts/verify-database.mjs
```

Should see: "✨ Database setup verified successfully!"

## 💡 Tips

- Each file is small and runs quickly
- If one fails, you can retry just that file
- Check off each step as you complete it
- The order matters - don't skip ahead!

## 🆘 Still Having Issues?

Try these:
1. **Refresh your browser** - Sometimes Supabase needs a refresh
2. **Check your internet** - Make sure you're connected
3. **Try incognito mode** - Clear any cached issues
4. **Wait a minute** - Supabase might be rate limiting

Your Tamedachi is almost ready to hatch! 🥚✨

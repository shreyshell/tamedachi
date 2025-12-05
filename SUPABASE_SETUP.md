# Supabase Database Setup Guide for Tamedachi

This guide will walk you through setting up the Tamedachi database schema in your Supabase project.

## Prerequisites

✅ You already have a Supabase project configured in `.env.local`
- Project URL: `https://bjobybzqnkplkraanqbm.supabase.co`

## Quick Setup (Recommended)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://app.supabase.com/project/bjobybzqnkplkraanqbm
2. Click on **SQL Editor** in the left sidebar

### Step 2: Apply Migration 1 - Create Pets Table

1. Click **New Query**
2. Copy the entire contents of `supabase/migrations/20241206000001_create_pets_table.sql`
3. Paste into the SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see: "Success. No rows returned"

### Step 3: Apply Migration 2 - Create Content Submissions Table

1. Click **New Query** again
2. Copy the entire contents of `supabase/migrations/20241206000002_create_content_submissions_table.sql`
3. Paste into the SQL Editor
4. Click **Run**
5. You should see: "Success. No rows returned"

### Step 4: Verify Setup

1. Go to **Table Editor** in the left sidebar
2. You should see two new tables:
   - ✅ `pets`
   - ✅ `content_submissions`
3. Click on each table to verify the columns match the schema

## What Was Created?

### 📊 Tables

#### `pets` Table
- Stores each user's virtual pet
- Tracks health score, age, and good content count
- Automatically updates `updated_at` timestamp

#### `content_submissions` Table
- Stores all URL submissions and their analysis results
- Links to both user and pet
- Tracks credibility scores and quality categories

### 🔒 Security (Row Level Security)

Both tables have RLS enabled with policies that ensure:
- Users can only see their own data
- Users can only modify their own data
- Complete data isolation between users

### ⚡ Performance (Indexes)

Indexes created for fast queries:
- `pets.user_id` - Find user's pet quickly
- `content_submissions.user_id` - Find user's submissions
- `content_submissions.pet_id` - Find pet's submissions
- `content_submissions.submitted_at` - Sort by date efficiently

## Verification Checklist

After setup, verify:

- [ ] Both tables appear in Table Editor
- [ ] RLS is enabled (look for 🔒 icon next to table names)
- [ ] Indexes are created (check in Database → Indexes)
- [ ] Policies are active (check in Authentication → Policies)

## Testing the Setup

You can test the setup with a simple query:

```sql
-- This should return empty (no pets yet)
SELECT * FROM pets;

-- This should also return empty (no submissions yet)
SELECT * FROM content_submissions;
```

If both queries run without errors, your database is ready! 🎉

## Troubleshooting

### Error: "relation already exists"
- This means the table was already created
- You can safely ignore this or drop the table first: `DROP TABLE IF EXISTS table_name CASCADE;`

### Error: "permission denied"
- Make sure you're logged into the correct Supabase project
- Check that your service role key is correct in `.env.local`

### Error: "syntax error"
- Make sure you copied the entire SQL file contents
- Check that no characters were lost during copy/paste

## Next Steps

Once your database is set up:

1. ✅ Database schema is ready
2. 🔜 Implement authentication (Task 4)
3. 🔜 Create PetService for pet management (Task 5)
4. 🔜 Build the UI components

Your Tamedachi is ready to hatch! 🥚✨

# Tamedachi Supabase Database Setup

This directory contains the database schema and migrations for the Tamedachi application.

## Database Schema

### Tables

#### `pets`
Stores virtual pet data for each user.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| name | TEXT | Pet name (default: "Tamedachi") |
| health_score | NUMERIC(5,2) | Health score 0-100 |
| age_years | INTEGER | Pet age in years |
| good_content_count | INTEGER | Count of good content submissions |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- `idx_pets_user_id` on `user_id`

**RLS Policies:**
- Users can only view, insert, update, and delete their own pets

#### `content_submissions`
Stores URL submissions and their analysis results.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| pet_id | UUID | Foreign key to pets |
| url | TEXT | Submitted URL |
| credibility_score | NUMERIC(5,2) | Credibility score 0-100 |
| quality_category | TEXT | Category: excellent, good, questionable, poor |
| is_good_content | BOOLEAN | True if score >= 50 |
| submitted_at | TIMESTAMPTZ | Submission timestamp |

**Indexes:**
- `idx_content_submissions_user_id` on `user_id`
- `idx_content_submissions_pet_id` on `pet_id`
- `idx_content_submissions_submitted_at` on `submitted_at DESC`

**RLS Policies:**
- Users can only view, insert, update, and delete their own submissions

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended for existing projects)

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to the SQL Editor
3. Run the migrations in order:
   - First: `migrations/20241206000001_create_pets_table.sql`
   - Second: `migrations/20241206000002_create_content_submissions_table.sql`

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link to your existing project
supabase link --project-ref bjobybzqnkplkraanqbm

# Push migrations to your database
supabase db push
```

### Option 3: Manual SQL Execution

Copy and paste the SQL from each migration file into your Supabase SQL Editor and execute them in order.

## Verification

After running the migrations, verify the setup:

1. Check that both tables exist in the Table Editor
2. Verify that RLS is enabled on both tables
3. Confirm that indexes are created
4. Test that policies work by trying to query as an authenticated user

## Row Level Security (RLS)

All tables have RLS enabled to ensure data isolation:
- Users can only access their own pets and submissions
- All CRUD operations are restricted to the authenticated user's data
- Foreign key constraints ensure data integrity

## Automatic Timestamps

The `pets` table has an automatic `updated_at` trigger that updates the timestamp whenever a row is modified.

#!/bin/bash

# Tamedachi Database Migration Script
# This script helps you apply database migrations to your Supabase project

echo "🐾 Tamedachi Database Setup"
echo "============================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

# Load environment variables
source .env.local

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL not set in .env.local"
    exit 1
fi

echo "📍 Supabase Project: $NEXT_PUBLIC_SUPABASE_URL"
echo ""
echo "📋 Migrations to apply:"
echo "  1. Create pets table"
echo "  2. Create content_submissions table"
echo ""
echo "⚠️  Please apply these migrations manually:"
echo ""
echo "1. Open your Supabase Dashboard:"
echo "   https://app.supabase.com/project/bjobybzqnkplkraanqbm/editor"
echo ""
echo "2. Go to SQL Editor"
echo ""
echo "3. Copy and run the following files in order:"
echo "   - supabase/migrations/20241206000001_create_pets_table.sql"
echo "   - supabase/migrations/20241206000002_create_content_submissions_table.sql"
echo ""
echo "4. Verify in Table Editor that both tables exist with RLS enabled"
echo ""
echo "✨ After applying migrations, your Tamedachi database will be ready!"

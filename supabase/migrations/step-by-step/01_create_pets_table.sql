-- Step 1: Create pets table
CREATE TABLE IF NOT EXISTS public.pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Tamedachi',
    health_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
    age_years INTEGER NOT NULL DEFAULT 0 CHECK (age_years >= 0),
    good_content_count INTEGER NOT NULL DEFAULT 0 CHECK (good_content_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

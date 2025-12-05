-- Create pets table
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

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON public.pets(user_id);

-- Enable Row Level Security
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own pets
CREATE POLICY "Users can view their own pets"
    ON public.pets
    FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own pets
CREATE POLICY "Users can insert their own pets"
    ON public.pets
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own pets
CREATE POLICY "Users can update their own pets"
    ON public.pets
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own pets
CREATE POLICY "Users can delete their own pets"
    ON public.pets
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on pets table
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.pets
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

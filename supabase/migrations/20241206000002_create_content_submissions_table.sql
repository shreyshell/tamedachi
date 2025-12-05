-- Create content_submissions table
CREATE TABLE IF NOT EXISTS public.content_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    credibility_score NUMERIC(5,2) NOT NULL CHECK (credibility_score >= 0 AND credibility_score <= 100),
    quality_category TEXT NOT NULL CHECK (quality_category IN ('excellent', 'good', 'questionable', 'poor')),
    is_good_content BOOLEAN NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_content_submissions_user_id ON public.content_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_content_submissions_pet_id ON public.content_submissions(pet_id);
CREATE INDEX IF NOT EXISTS idx_content_submissions_submitted_at ON public.content_submissions(submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE public.content_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own submissions
CREATE POLICY "Users can view their own submissions"
    ON public.content_submissions
    FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own submissions
CREATE POLICY "Users can insert their own submissions"
    ON public.content_submissions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own submissions
CREATE POLICY "Users can update their own submissions"
    ON public.content_submissions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own submissions
CREATE POLICY "Users can delete their own submissions"
    ON public.content_submissions
    FOR DELETE
    USING (auth.uid() = user_id);

-- Step 8: Create indexes on content_submissions table
CREATE INDEX IF NOT EXISTS idx_content_submissions_user_id ON public.content_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_content_submissions_pet_id ON public.content_submissions(pet_id);
CREATE INDEX IF NOT EXISTS idx_content_submissions_submitted_at ON public.content_submissions(submitted_at DESC);

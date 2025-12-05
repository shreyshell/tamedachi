-- Step 10: Create RLS policies for content_submissions table

-- Policy: Users can view their own submissions
CREATE POLICY "Users can view their own submissions"
    ON public.content_submissions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own submissions
CREATE POLICY "Users can insert their own submissions"
    ON public.content_submissions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own submissions
CREATE POLICY "Users can update their own submissions"
    ON public.content_submissions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own submissions
CREATE POLICY "Users can delete their own submissions"
    ON public.content_submissions
    FOR DELETE
    USING (auth.uid() = user_id);

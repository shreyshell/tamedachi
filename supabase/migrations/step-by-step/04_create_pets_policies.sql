-- Step 4: Create RLS policies for pets table

-- Policy: Users can view their own pets
CREATE POLICY "Users can view their own pets"
    ON public.pets
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own pets
CREATE POLICY "Users can insert their own pets"
    ON public.pets
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own pets
CREATE POLICY "Users can update their own pets"
    ON public.pets
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own pets
CREATE POLICY "Users can delete their own pets"
    ON public.pets
    FOR DELETE
    USING (auth.uid() = user_id);

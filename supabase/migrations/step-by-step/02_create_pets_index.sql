-- Step 2: Create index on pets table
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON public.pets(user_id);

-- Step 6: Create trigger for automatic updated_at on pets table
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.pets
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

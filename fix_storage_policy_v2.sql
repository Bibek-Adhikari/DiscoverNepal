  -- RUN THIS SCRIPT IN THE SUPABASE SQL EDITOR
-- This script fixes "row-level security policy" errors by ensuring:
-- 1. The 'destinations' and 'articles' buckets exist and are public.
-- 2. Anonymous (unauthenticated) users have permission to use the storage schema.
-- 3. A clear policy allows uploads to these specific buckets.

BEGIN;

-- 1. Grant usage on the storage schema (crucial for some setups)
GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role;

-- 2. Grant access to storage tables (needed for inserts/selects)
GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon, authenticated, service_role;

-- 3. Ensure the 'destinations' bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('destinations', 'destinations', true, 52428800, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/*'];

-- 4. Ensure the 'articles' bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('articles', 'articles', true, 52428800, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/*'];

-- 5. Clean up old policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
DROP POLICY IF EXISTS "Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Destinations" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Articles" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Upload Destinations" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Upload Articles" ON storage.objects;
DROP POLICY IF EXISTS "Anon Upload" ON storage.objects;
DROP POLICY IF EXISTS "Universal Access Destinations" ON storage.objects;
DROP POLICY IF EXISTS "Universal Access Articles" ON storage.objects;
DROP POLICY IF EXISTS "Global Public Read" ON storage.objects;

-- 6. Create a UNIVERSAL policy for 'destinations'
CREATE POLICY "Universal Access Destinations"
ON storage.objects FOR ALL 
TO public
USING (bucket_id = 'destinations')
WITH CHECK (bucket_id = 'destinations');

-- 7. Create a UNIVERSAL policy for 'articles'
CREATE POLICY "Universal Access Articles"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'articles')
WITH CHECK (bucket_id = 'articles');

-- 8. Create a Global Read policy (so images can be viewed)
CREATE POLICY "Global Public Read"
ON storage.objects FOR SELECT
TO public
USING (true);

COMMIT;

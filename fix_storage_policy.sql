-- FORCE FIX for Storage Policies
-- Run this in the Supabase SQL Editor to reset permissions completely.

BEGIN;

-- 1. Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to remove conflicts
-- We drop policies by name we might have created previously
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
DROP POLICY IF EXISTS "Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Destinations" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Articles" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Upload Destinations" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Upload Articles" ON storage.objects;
DROP POLICY IF EXISTS "Anon Upload" ON storage.objects;

-- 3. Create UNIVERSAL access policies for your specific buckets
-- This allows inserts (uploads), selects (viewing), and updates for ANYONE (public/anon)

-- Policy for 'destinations' bucket
CREATE POLICY "Universal Access Destinations"
ON storage.objects FOR ALL 
TO public
USING (bucket_id = 'destinations')
WITH CHECK (bucket_id = 'destinations');

-- Policy for 'articles' bucket
CREATE POLICY "Universal Access Articles"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'articles')
WITH CHECK (bucket_id = 'articles');

-- 4. Ensure public read access is globally enabled for images
CREATE POLICY "Global Public Read"
ON storage.objects FOR SELECT
TO public
USING (true);

COMMIT;

-- ADDITIONAL FIX: Ensure buckets exist and are public
INSERT INTO storage.buckets (id, name, public)
VALUES ('destinations', 'destinations', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO UPDATE SET public = true;


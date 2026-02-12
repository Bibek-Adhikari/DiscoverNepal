-- 1. Create news_articles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT DEFAULT '#',
    published_at TIMESTAMPTZ DEFAULT now(),
    source TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'Community',
    destination_id TEXT REFERENCES public.destinations(id) ON DELETE SET NULL
);

-- 2. Enable Realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE news_articles;
-- Note: destinations table might already be in publication, but safe to run:
-- ALTER PUBLICATION supabase_realtime ADD TABLE destinations; 

-- 3. Set RLS Policies for news_articles
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Insert" ON public.news_articles;
DROP POLICY IF EXISTS "Public Select" ON public.news_articles;
CREATE POLICY "Public Insert" ON public.news_articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select" ON public.news_articles FOR SELECT USING (true);

-- 4. Set RLS Policies for destinations (Allow public contribution)
-- Ensure RLS is enabled
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
-- Create policies for destinations
DROP POLICY IF EXISTS "Public Add Destinations" ON public.destinations;
DROP POLICY IF EXISTS "Public View Destinations" ON public.destinations;
CREATE POLICY "Public Add Destinations" ON public.destinations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public View Destinations" ON public.destinations FOR SELECT USING (true);

-- 5. IMPORTANT: Handle district_id and nullable fields
-- If your destinations table has a strict district_id requirement, 
-- you may need to make it nullable or provide a default.
ALTER TABLE public.destinations ALTER COLUMN district_id DROP NOT NULL;

-- 6. Storage Setup & Policies (For Public Uploads)
-- Note: Create the "destinations" and "articles" buckets first.

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Upload Destinations" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Upload Articles" ON storage.objects;

-- Allow Public SELECT (Read)
CREATE POLICY "Public Read" ON storage.objects FOR SELECT TO anon USING (true);

-- Allow Public INSERT (Upload) to specific buckets
CREATE POLICY "Public Upload Destinations" ON storage.objects FOR INSERT TO anon 
WITH CHECK (bucket_id = 'destinations');

CREATE POLICY "Public Upload Articles" ON storage.objects FOR INSERT TO anon 
WITH CHECK (bucket_id = 'articles');

-- Allow Public UPDATE (In case of replacements)
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE TO anon 
USING (bucket_id IN ('destinations', 'articles'));

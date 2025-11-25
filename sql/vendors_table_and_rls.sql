CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON public.vendors(user_id);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own vendor profile" ON public.vendors;
DROP POLICY IF EXISTS "Users can insert their own vendor profile" ON public.vendors;
DROP POLICY IF EXISTS "Users can update their own vendor profile" ON public.vendors;
DROP POLICY IF EXISTS "Users can delete their own vendor profile" ON public.vendors;
DROP POLICY IF EXISTS "Public can view vendor profiles" ON public.vendors;

CREATE POLICY "Users can view their own vendor profile"
ON public.vendors
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vendor profile"
ON public.vendors
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendor profile"
ON public.vendors
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vendor profile"
ON public.vendors
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Public can view vendor profiles"
ON public.vendors
FOR SELECT
USING (true);

CREATE OR REPLACE FUNCTION update_vendors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_vendors_updated_at_trigger ON public.vendors;
CREATE TRIGGER update_vendors_updated_at_trigger
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_vendors_updated_at();






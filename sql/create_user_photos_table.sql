CREATE TABLE IF NOT EXISTS public.user_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  descripcion TEXT,
  fecha TIMESTAMPTZ DEFAULT NOW(),
  publica BOOLEAN DEFAULT true,
  likes INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_user_photos_user_id ON public.user_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_user_photos_publica ON public.user_photos(publica) WHERE publica = true;

ALTER TABLE public.user_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view public photos" ON public.user_photos;
DROP POLICY IF EXISTS "Users can view their own photos" ON public.user_photos;
DROP POLICY IF EXISTS "Users can insert their own photos" ON public.user_photos;
DROP POLICY IF EXISTS "Users can update their own photos" ON public.user_photos;
DROP POLICY IF EXISTS "Users can delete their own photos" ON public.user_photos;

CREATE POLICY "Users can view public photos"
  ON public.user_photos FOR SELECT
  USING (publica = true);

CREATE POLICY "Users can view their own photos"
  ON public.user_photos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own photos"
  ON public.user_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
  ON public.user_photos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON public.user_photos FOR DELETE
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.photo_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_foto UUID REFERENCES public.user_photos(id) ON DELETE CASCADE NOT NULL,
  id_usuario UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fecha TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(id_foto, id_usuario)
);

CREATE INDEX IF NOT EXISTS idx_photo_likes_id_foto ON public.photo_likes(id_foto);
CREATE INDEX IF NOT EXISTS idx_photo_likes_id_usuario ON public.photo_likes(id_usuario);

ALTER TABLE public.photo_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view photo likes" ON public.photo_likes;
DROP POLICY IF EXISTS "Users can insert their own likes" ON public.photo_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON public.photo_likes;

CREATE POLICY "Users can view photo likes"
  ON public.photo_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own likes"
  ON public.photo_likes FOR INSERT
  WITH CHECK (auth.uid() = id_usuario);

CREATE POLICY "Users can delete their own likes"
  ON public.photo_likes FOR DELETE
  USING (auth.uid() = id_usuario);











-- ============================================
-- SQL para crear tablas de perfil de usuario
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  location_text TEXT,
  description TEXT CHECK (char_length(description) <= 100),
  pet_description TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  banner_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de fotos de mascotas
CREATE TABLE IF NOT EXISTS pet_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_path TEXT,
  bucket_name TEXT,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de likes en fotos de mascotas
CREATE TABLE IF NOT EXISTS pet_photo_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID NOT NULL REFERENCES pet_photos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(photo_id, user_id)
);

-- 4. Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_photos_user_id ON pet_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_photos_created_at ON pet_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pet_photo_likes_photo_id ON pet_photo_likes(photo_id);
CREATE INDEX IF NOT EXISTS idx_pet_photo_likes_user_id ON pet_photo_likes(user_id);

-- 5. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger para actualizar updated_at en profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Políticas RLS (Row Level Security)

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_photo_likes ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para pet_photos
DROP POLICY IF EXISTS "Anyone can view pet photos" ON pet_photos;
CREATE POLICY "Anyone can view pet photos"
  ON pet_photos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own pet photos" ON pet_photos;
CREATE POLICY "Users can insert their own pet photos"
  ON pet_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own pet photos" ON pet_photos;
CREATE POLICY "Users can update their own pet photos"
  ON pet_photos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own pet photos" ON pet_photos;
CREATE POLICY "Users can delete their own pet photos"
  ON pet_photos FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para pet_photo_likes
DROP POLICY IF EXISTS "Anyone can view likes" ON pet_photo_likes;
CREATE POLICY "Anyone can view likes"
  ON pet_photo_likes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own likes" ON pet_photo_likes;
CREATE POLICY "Users can insert their own likes"
  ON pet_photo_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own likes" ON pet_photo_likes;
CREATE POLICY "Users can delete their own likes"
  ON pet_photo_likes FOR DELETE
  USING (auth.uid() = user_id);

-- 8. Comentarios en las tablas
COMMENT ON TABLE profiles IS 'Perfiles de usuario del marketplace';
COMMENT ON TABLE pet_photos IS 'Fotos de mascotas subidas por usuarios';
COMMENT ON TABLE pet_photo_likes IS 'Likes en fotos de mascotas';


-- ============================================
-- Tablas y RLS para verificación de vendedores y soporte
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1) Extender profiles con banderas de vendedor
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_seller BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS seller_verified BOOLEAN DEFAULT false;

-- Opcional: almacenar ubicación estructurada y bio corta
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS location JSONB,
  ADD COLUMN IF NOT EXISTS bio TEXT;

COMMENT ON COLUMN public.profiles.is_seller IS 'Indica si el usuario tiene perfil de vendedor activo';
COMMENT ON COLUMN public.profiles.seller_verified IS 'Indica si el vendedor fue verificado manualmente por el equipo de Mascottaz';
COMMENT ON COLUMN public.profiles.location IS 'Objeto JSON con datos de ubicación {cp, municipio, estado}';
COMMENT ON COLUMN public.profiles.bio IS 'Biografía breve del usuario/vendedor';


-- 2) Tabla de verificación de vendedores
CREATE TABLE IF NOT EXISTS public.seller_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  ine_front_url TEXT,
  ine_back_url TEXT,
  proof_address_url TEXT,
  selfie_url TEXT,
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID,         -- admin user id
  reviewed_at TIMESTAMPTZ
);

COMMENT ON TABLE public.seller_verifications IS 'Solicitudes de verificación de vendedores (documentos y estado).';

CREATE INDEX IF NOT EXISTS idx_seller_verifications_user_id
  ON public.seller_verifications(user_id);

ALTER TABLE public.seller_verifications ENABLE ROW LEVEL SECURITY;

-- Políticas:
-- - El vendedor sólo puede ver/crear/actualizar sus propias solicitudes
-- - Los administradores pueden ver todas y actualizar para aprobar/rechazar

-- Helper para saber si el usuario es admin, basado en custom claim jwt -> raw_app_meta -> role = 'admin'
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  role TEXT;
BEGIN
  BEGIN
    role := current_setting('request.jwt.claims', true)::json->'app_metadata'->>'role';
  EXCEPTION WHEN others THEN
    RETURN FALSE;
  END;

  RETURN role = 'admin';
END;
$$ LANGUAGE plpgsql STABLE;

-- SELECT en seller_verifications
DROP POLICY IF EXISTS "seller_verifications_owner_select" ON public.seller_verifications;
CREATE POLICY "seller_verifications_owner_select"
  ON public.seller_verifications
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- INSERT por el dueño
DROP POLICY IF EXISTS "seller_verifications_owner_insert" ON public.seller_verifications;
CREATE POLICY "seller_verifications_owner_insert"
  ON public.seller_verifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: el dueño puede actualizar mientras esté pending; admin puede actualizar siempre
DROP POLICY IF EXISTS "seller_verifications_update" ON public.seller_verifications;
CREATE POLICY "seller_verifications_update"
  ON public.seller_verifications
  FOR UPDATE
  USING (
    (auth.uid() = user_id AND status = 'pending')
    OR public.is_admin()
  )
  WITH CHECK (
    (auth.uid() = user_id AND status = 'pending')
    OR public.is_admin()
  );

-- DELETE opcional: normalmente sólo admin podría limpiar registros
DROP POLICY IF EXISTS "seller_verifications_delete_admin" ON public.seller_verifications;
CREATE POLICY "seller_verifications_delete_admin"
  ON public.seller_verifications
  FOR DELETE
  USING (public.is_admin());


-- 3) Tabla de tickets de soporte
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', -- open, in_review, closed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

COMMENT ON TABLE public.support_tickets IS 'Tickets de soporte creados por usuarios (compradores y vendedores).';

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id
  ON public.support_tickets(user_id);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- El usuario autenticado puede ver y crear sus propios tickets
DROP POLICY IF EXISTS "support_tickets_owner_select" ON public.support_tickets;
CREATE POLICY "support_tickets_owner_select"
  ON public.support_tickets
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "support_tickets_owner_insert" ON public.support_tickets;
CREATE POLICY "support_tickets_owner_insert"
  ON public.support_tickets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "support_tickets_owner_update" ON public.support_tickets;
CREATE POLICY "support_tickets_owner_update"
  ON public.support_tickets
  FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());


-- 4) Notas sobre buckets de Storage (crear desde el panel de Supabase)
-- Estos buckets no se crean con SQL, pero se listan aquí como referencia:
--  - seller_docs   (privado)       -> Documentos sensibles de verificación (INE, comprobante, selfie).
--  - banners       (lectura pública) -> Banners de perfil/tienda.
--  - avatars       (lectura pública) -> Avatares de usuario/vendedor.
--  - pet_gallery   (lectura pública) -> Fotos de mascotas para la red social.
--
-- Recomendación de política de almacenamiento para seller_docs:
--  - Sin acceso público (no generar publicURL).
--  - Acceso sólo mediante URLs firmadas generadas por el backend/admin.



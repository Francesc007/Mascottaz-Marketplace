-- ============================================
-- Tabla de notificaciones para vendedores
-- Ejecutar en Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'new_order', 'order_status_change', 'new_message', 'new_review', 'low_stock', 'product_update'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID, -- ID del pedido, mensaje, reseña, producto, etc.
  related_type TEXT, -- 'order', 'message', 'review', 'product'
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.notifications IS 'Notificaciones para vendedores sobre pedidos, mensajes, reseñas, etc.';
COMMENT ON COLUMN public.notifications.type IS 'Tipo de notificación: new_order, order_status_change, new_message, new_review, low_stock, product_update';
COMMENT ON COLUMN public.notifications.related_id IS 'ID del recurso relacionado (pedido, mensaje, reseña, producto)';
COMMENT ON COLUMN public.notifications.related_type IS 'Tipo de recurso relacionado: order, message, review, product';

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: el usuario solo puede ver sus propias notificaciones
DROP POLICY IF EXISTS "notifications_owner_select" ON public.notifications;
CREATE POLICY "notifications_owner_select"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_owner_update" ON public.notifications;
CREATE POLICY "notifications_owner_update"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Los admins pueden insertar notificaciones (para notificaciones del sistema)
DROP POLICY IF EXISTS "notifications_insert" ON public.notifications;
CREATE POLICY "notifications_insert"
  ON public.notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());


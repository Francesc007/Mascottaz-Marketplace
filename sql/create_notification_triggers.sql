-- ============================================
-- TRIGGERS Y FUNCIONES PARA NOTIFICACIONES AUTOMÁTICAS
-- Ejecutar en Supabase SQL Editor
-- ============================================
-- Este script crea funciones y triggers para generar notificaciones
-- automáticamente cuando ocurren eventos importantes:
-- - Nueva orden (notificación al vendedor)
-- - Cambio de estado de orden (notificación al comprador y vendedor)
-- - Nuevo mensaje (notificación al receptor)
-- - Nueva reseña (notificación al vendedor)
-- - Stock bajo (notificación al vendedor)
-- ============================================

-- Función para crear notificaciones
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_related_id UUID DEFAULT NULL,
  p_related_type TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    related_id,
    related_type
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_related_id,
    p_related_type
  ) RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.create_notification IS 'Función para crear notificaciones. Ejecuta con permisos de definidor para poder insertar notificaciones para cualquier usuario.';

-- ============================================
-- TRIGGERS PARA ÓRDENES
-- ============================================

-- Función trigger: Nueva orden
CREATE OR REPLACE FUNCTION public.notify_new_order() RETURNS TRIGGER AS $$
DECLARE
  v_buyer_name TEXT;
  v_order_summary TEXT;
  v_item_count INTEGER;
BEGIN
  -- Obtener nombre del comprador
  SELECT full_name INTO v_buyer_name
  FROM public.profiles
  WHERE user_id = NEW.buyer_id
  LIMIT 1;
  
  -- Contar items en la orden
  SELECT COUNT(*) INTO v_item_count
  FROM public.order_items
  WHERE order_id = NEW.id;
  
  -- Crear resumen de la orden
  IF v_item_count = 1 THEN
    SELECT 'el producto "' || product_name || '"' INTO v_order_summary
    FROM public.order_items
    WHERE order_id = NEW.id
    LIMIT 1;
  ELSE
    v_order_summary := v_item_count || ' productos';
  END IF;
  
  -- Crear notificación para el vendedor
  PERFORM public.create_notification(
    NEW.seller_id,
    'new_order',
    'Nueva Orden Recibida',
    COALESCE(v_buyer_name, 'Un comprador') || ' ha realizado una orden de ' || COALESCE(v_order_summary, 'productos') || ' por $' || NEW.total_amount || '.',
    NEW.id,
    'order'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Nueva orden
DROP TRIGGER IF EXISTS trigger_notify_new_order ON public.orders;
CREATE TRIGGER trigger_notify_new_order
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_order();

-- Función trigger: Cambio de estado de orden
CREATE OR REPLACE FUNCTION public.notify_order_status_change() RETURNS TRIGGER AS $$
DECLARE
  v_status_text TEXT;
  v_order_number TEXT;
BEGIN
  -- Solo notificar si cambió el estado
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  v_order_number := COALESCE(NEW.order_number, '#' || SUBSTRING(NEW.id::TEXT, 1, 8));
  
  -- Traducir estado
  v_status_text := CASE NEW.status
    WHEN 'pendiente' THEN 'pendiente'
    WHEN 'en_preparacion' THEN 'en preparación'
    WHEN 'enviado' THEN 'enviada'
    WHEN 'entregado' THEN 'entregada'
    WHEN 'cancelado' THEN 'cancelada'
    ELSE NEW.status
  END;
  
  -- Notificar al comprador
  PERFORM public.create_notification(
    NEW.buyer_id,
    'order_status_change',
    'Estado de Orden Actualizado',
    'Tu orden ' || v_order_number || ' está ahora ' || v_status_text || '.',
    NEW.id,
    'order'
  );
  
  -- Notificar al vendedor
  PERFORM public.create_notification(
    NEW.seller_id,
    'order_status_change',
    'Estado de Orden Actualizado',
    'La orden ' || v_order_number || ' está ahora ' || v_status_text || '.',
    NEW.id,
    'order'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Cambio de estado de orden
DROP TRIGGER IF EXISTS trigger_notify_order_status_change ON public.orders;
CREATE TRIGGER trigger_notify_order_status_change
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_status_change();

-- ============================================
-- TRIGGERS PARA MENSAJES
-- ============================================

-- Función trigger: Nuevo mensaje
CREATE OR REPLACE FUNCTION public.notify_new_message() RETURNS TRIGGER AS $$
DECLARE
  v_sender_name TEXT;
  v_message_preview TEXT;
BEGIN
  -- No notificar si el mensaje es del mismo usuario (no debería pasar, pero por seguridad)
  IF NEW.from_user = NEW.to_user THEN
    RETURN NEW;
  END IF;
  
  -- Obtener nombre del remitente
  SELECT full_name INTO v_sender_name
  FROM public.profiles
  WHERE user_id = NEW.from_user
  LIMIT 1;
  
  -- Preview del mensaje (primeros 50 caracteres)
  v_message_preview := LEFT(NEW.body, 50);
  IF LENGTH(NEW.body) > 50 THEN
    v_message_preview := v_message_preview || '...';
  END IF;
  
  -- Crear notificación para el receptor
  PERFORM public.create_notification(
    NEW.to_user,
    'new_message',
    'Nuevo Mensaje',
    COALESCE(v_sender_name, 'Alguien') || ' te envió un mensaje: ' || v_message_preview,
    NEW.id,
    'message'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Nuevo mensaje
DROP TRIGGER IF EXISTS trigger_notify_new_message ON public.messages;
CREATE TRIGGER trigger_notify_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_message();

-- ============================================
-- TRIGGERS PARA RESEÑAS
-- ============================================

-- Función trigger: Nueva reseña
CREATE OR REPLACE FUNCTION public.notify_new_review() RETURNS TRIGGER AS $$
DECLARE
  v_buyer_name TEXT;
  v_product_name TEXT;
  v_rating_text TEXT;
BEGIN
  -- Obtener nombre del comprador
  SELECT full_name INTO v_buyer_name
  FROM public.profiles
  WHERE user_id = NEW.buyer_id
  LIMIT 1;
  
  -- Obtener nombre del producto si existe
  IF NEW.product_id IS NOT NULL THEN
    SELECT nombre INTO v_product_name
    FROM public.products
    WHERE id = NEW.product_id
    LIMIT 1;
  END IF;
  
  -- Texto de calificación
  v_rating_text := NEW.rating || ' ' || CASE NEW.rating
    WHEN 1 THEN 'huellita'
    ELSE 'huellitas'
  END;
  
  -- Crear notificación para el vendedor
  PERFORM public.create_notification(
    NEW.seller_id,
    'new_review',
    'Nueva Reseña Recibida',
    COALESCE(v_buyer_name, 'Un comprador') || ' dejó una reseña de ' || v_rating_text || 
    CASE 
      WHEN v_product_name IS NOT NULL THEN ' para ' || v_product_name
      ELSE ''
    END || '.',
    NEW.id,
    'review'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Nueva reseña
DROP TRIGGER IF EXISTS trigger_notify_new_review ON public.reviews;
CREATE TRIGGER trigger_notify_new_review
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_review();

-- ============================================
-- TRIGGERS PARA STOCK BAJO
-- ============================================

-- Función trigger: Stock bajo
CREATE OR REPLACE FUNCTION public.notify_low_stock() RETURNS TRIGGER AS $$
DECLARE
  v_threshold INTEGER := 5; -- Umbral de stock bajo
BEGIN
  -- Solo notificar si el stock es bajo Y el producto está activo
  IF NEW.stock <= v_threshold AND NEW.stock > 0 AND NEW.activo = true THEN
    -- Verificar si ya existe una notificación reciente para este producto (últimas 24 horas)
    IF NOT EXISTS (
      SELECT 1 FROM public.notifications
      WHERE user_id = NEW.id_vendedor
        AND type = 'low_stock'
        AND related_id = NEW.id
        AND related_type = 'product'
        AND created_at > NOW() - INTERVAL '24 hours'
    ) THEN
      -- Crear notificación para el vendedor
      PERFORM public.create_notification(
        NEW.id_vendedor,
        'low_stock',
        'Stock Bajo',
        'El producto "' || NEW.nombre || '" tiene solo ' || NEW.stock || ' unidades en stock.',
        NEW.id,
        'product'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Stock bajo (al actualizar)
DROP TRIGGER IF EXISTS trigger_notify_low_stock ON public.products;
CREATE TRIGGER trigger_notify_low_stock
  AFTER UPDATE OF stock ON public.products
  FOR EACH ROW
  WHEN (NEW.stock <= 5 AND NEW.stock > 0 AND NEW.activo = true)
  EXECUTE FUNCTION public.notify_low_stock();

-- Trigger: Stock bajo (al insertar)
DROP TRIGGER IF EXISTS trigger_notify_low_stock_insert ON public.products;
CREATE TRIGGER trigger_notify_low_stock_insert
  AFTER INSERT ON public.products
  FOR EACH ROW
  WHEN (NEW.stock <= 5 AND NEW.stock > 0 AND NEW.activo = true)
  EXECUTE FUNCTION public.notify_low_stock();

-- ============================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================

COMMENT ON FUNCTION public.create_notification IS 'Función auxiliar para crear notificaciones. Usa SECURITY DEFINER para poder insertar notificaciones para cualquier usuario.';
COMMENT ON FUNCTION public.notify_new_order IS 'Crea notificación cuando se inserta una nueva orden. Notifica al vendedor.';
COMMENT ON FUNCTION public.notify_order_status_change IS 'Crea notificaciones cuando cambia el estado de una orden. Notifica al comprador y vendedor.';
COMMENT ON FUNCTION public.notify_new_message IS 'Crea notificación cuando se inserta un nuevo mensaje. Notifica al receptor.';
COMMENT ON FUNCTION public.notify_new_review IS 'Crea notificación cuando se inserta una nueva reseña. Notifica al vendedor.';
COMMENT ON FUNCTION public.notify_low_stock IS 'Crea notificación cuando el stock de un producto es bajo (≤5 unidades). Solo notifica una vez cada 24 horas por producto.';

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. Todas las funciones usan SECURITY DEFINER para poder insertar
--    notificaciones para cualquier usuario, incluso si el usuario actual
--    no tiene permisos directos.
--
-- 2. Los triggers se ejecutan automáticamente cuando ocurren los eventos.
--
-- 3. Para el stock bajo, se verifica que no haya una notificación reciente
--    (últimas 24 horas) para evitar spam.
--
-- 4. Si necesitas desactivar algún trigger, usa:
--    DROP TRIGGER trigger_name ON table_name;
--
-- 5. Para probar manualmente, puedes usar:
--    SELECT public.create_notification(
--      'user-uuid'::UUID,
--      'new_order',
--      'Título',
--      'Mensaje',
--      'related-id'::UUID,
--      'order'
--    );
-- ============================================


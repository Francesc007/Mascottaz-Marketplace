-- ============================================
-- SCRIPT MAESTRO - SETUP COMPLETO DE BASE DE DATOS
-- ============================================
-- Ejecuta este script en Supabase SQL Editor
-- Este script ejecuta todos los scripts necesarios en orden
-- ============================================

-- 1. CREAR TABLA VENDORS
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

CREATE POLICY "Users can view their own vendor profile" ON public.vendors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vendor profile" ON public.vendors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vendor profile" ON public.vendors FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vendor profile" ON public.vendors FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public can view vendor profiles" ON public.vendors FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION update_vendors_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_vendors_updated_at_trigger ON public.vendors;
CREATE TRIGGER update_vendors_updated_at_trigger BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION update_vendors_updated_at();

-- 2. CREAR TABLA PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen TEXT,
  id_vendedor UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  categoria VARCHAR(50),
  subcategoria VARCHAR(50),
  stock INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  fecha_actualizacion TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_id_vendedor ON public.products(id_vendedor);
CREATE INDEX IF NOT EXISTS idx_products_categoria ON public.products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_activo ON public.products(activo) WHERE activo = true;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Sellers can view their own products" ON public.products;
DROP POLICY IF EXISTS "Sellers can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Sellers can update their own products" ON public.products;
DROP POLICY IF EXISTS "Sellers can delete their own products" ON public.products;

CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (activo = true);
CREATE POLICY "Sellers can view their own products" ON public.products FOR SELECT USING (auth.uid() = id_vendedor);
CREATE POLICY "Sellers can insert their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = id_vendedor);
CREATE POLICY "Sellers can update their own products" ON public.products FOR UPDATE USING (auth.uid() = id_vendedor) WITH CHECK (auth.uid() = id_vendedor);
CREATE POLICY "Sellers can delete their own products" ON public.products FOR DELETE USING (auth.uid() = id_vendedor);

CREATE OR REPLACE FUNCTION update_products_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.fecha_actualizacion = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_products_updated_at_trigger ON public.products;
CREATE TRIGGER update_products_updated_at_trigger BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_products_updated_at();

-- 3. CREAR TABLAS DE FOTOS DE USUARIO
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

CREATE POLICY "Users can view public photos" ON public.user_photos FOR SELECT USING (publica = true);
CREATE POLICY "Users can view their own photos" ON public.user_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own photos" ON public.user_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own photos" ON public.user_photos FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own photos" ON public.user_photos FOR DELETE USING (auth.uid() = user_id);

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

CREATE POLICY "Users can view photo likes" ON public.photo_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON public.photo_likes FOR INSERT WITH CHECK (auth.uid() = id_usuario);
CREATE POLICY "Users can delete their own likes" ON public.photo_likes FOR DELETE USING (auth.uid() = id_usuario);

-- 4. CREAR TABLAS DEL DASHBOARD DE VENDEDOR
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_preparacion', 'enviado', 'entregado', 'cancelado')),
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pendiente' CHECK (payment_status IN ('pendiente', 'pagado', 'reembolsado')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  seller_response TEXT,
  seller_response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(order_id, buyer_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_seller_message BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 0,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pendiente' CHECK (payment_status IN ('pendiente', 'procesando', 'completado', 'cancelado')),
  payment_method VARCHAR(50),
  stripe_payment_id VARCHAR(255),
  bank_account_last4 VARCHAR(4),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  stripe_account_id VARCHAR(255),
  account_holder_name VARCHAR(200) NOT NULL,
  account_type VARCHAR(20) CHECK (account_type IN ('checking', 'savings')),
  bank_name VARCHAR(200),
  account_number_last4 VARCHAR(4),
  routing_number_last4 VARCHAR(4),
  is_verified BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_seller_id ON public.reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor_id ON public.reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_payments_seller_id ON public.payments(seller_id);
CREATE INDEX IF NOT EXISTS idx_payments_vendor_id ON public.payments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_seller_id ON public.bank_accounts(seller_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sellers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Buyers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Sellers can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view order items of their orders" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Buyers can create reviews for their orders" ON public.reviews;
DROP POLICY IF EXISTS "Sellers can respond to their reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;
DROP POLICY IF EXISTS "Sellers can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Sellers can view their own bank accounts" ON public.bank_accounts;
DROP POLICY IF EXISTS "Sellers can insert their own bank accounts" ON public.bank_accounts;
DROP POLICY IF EXISTS "Sellers can update their own bank accounts" ON public.bank_accounts;

CREATE POLICY "Sellers can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Buyers can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers can update their own orders" ON public.orders FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Users can view order items of their orders" ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())));
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can create reviews for their orders" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = buyer_id AND EXISTS (SELECT 1 FROM public.orders WHERE orders.id = reviews.order_id AND orders.buyer_id = auth.uid() AND orders.status = 'entregado'));
CREATE POLICY "Sellers can respond to their reviews" ON public.reviews FOR UPDATE USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their own messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Sellers can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can view their own bank accounts" ON public.bank_accounts FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can insert their own bank accounts" ON public.bank_accounts FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their own bank accounts" ON public.bank_accounts FOR UPDATE USING (auth.uid() = seller_id);

CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
DROP TRIGGER IF EXISTS update_bank_accounts_updated_at ON public.bank_accounts;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION generate_order_number() RETURNS TEXT AS $$ DECLARE new_number TEXT; BEGIN new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'); WHILE EXISTS (SELECT 1 FROM public.orders WHERE order_number = new_number) LOOP new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'); END LOOP; RETURN new_number; END; $$ LANGUAGE plpgsql;

-- 5. CREAR TABLA DE FEEDBACK DE ELIMINACIÓN
CREATE TABLE IF NOT EXISTS public.account_deletion_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_type VARCHAR(20),
  reason TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_account_deletion_feedback_user_id ON public.account_deletion_feedback(user_id);
ALTER TABLE public.account_deletion_feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated users to insert feedback" ON public.account_deletion_feedback;
CREATE POLICY "Allow authenticated users to insert feedback" ON public.account_deletion_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SETUP COMPLETO
-- ============================================









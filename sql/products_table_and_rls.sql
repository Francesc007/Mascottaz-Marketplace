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

CREATE POLICY "Anyone can view active products"
ON public.products
FOR SELECT
USING (activo = true);

CREATE POLICY "Sellers can view their own products"
ON public.products
FOR SELECT
USING (auth.uid() = id_vendedor);

CREATE POLICY "Sellers can insert their own products"
ON public.products
FOR INSERT
WITH CHECK (auth.uid() = id_vendedor);

CREATE POLICY "Sellers can update their own products"
ON public.products
FOR UPDATE
USING (auth.uid() = id_vendedor)
WITH CHECK (auth.uid() = id_vendedor);

CREATE POLICY "Sellers can delete their own products"
ON public.products
FOR DELETE
USING (auth.uid() = id_vendedor);

CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at_trigger ON public.products;
CREATE TRIGGER update_products_updated_at_trigger
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();








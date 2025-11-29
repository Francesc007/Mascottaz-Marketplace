-- Agregar campo de políticas de devolución y reembolso a la tabla vendors
ALTER TABLE public.vendors
ADD COLUMN IF NOT EXISTS return_policy TEXT;

-- Comentario para documentar el campo
COMMENT ON COLUMN public.vendors.return_policy IS 'Políticas de devolución y reembolso del vendedor que serán visibles para los compradores';


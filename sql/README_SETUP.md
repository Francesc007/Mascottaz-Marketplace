# Scripts SQL para Mascottaz

## Orden de Ejecución

Ejecuta estos scripts en Supabase SQL Editor en el siguiente orden:

### 1. Tablas Base
```sql
-- Ejecutar primero: vendors_table_and_rls.sql
-- Crea la tabla de vendedores con RLS
```

### 2. Tablas de Productos
```sql
-- Ejecutar segundo: products_table_and_rls.sql
-- Crea la tabla de productos con RLS
```

### 3. Tablas de Usuario
```sql
-- Ejecutar tercero: create_user_photos_table.sql
-- Crea tablas para fotos de usuarios y likes
```

### 4. Tablas del Dashboard de Vendedor
```sql
-- Ejecutar cuarto: create_seller_dashboard_tables_safe.sql
-- Crea todas las tablas del dashboard:
-- - orders (pedidos)
-- - order_items (items de pedido)
-- - reviews (reseñas)
-- - messages (mensajes)
-- - payments (pagos)
-- - bank_accounts (cuentas bancarias)
```

### 5. Tablas Adicionales
```sql
-- Ejecutar quinto: create_account_deletion_feedback_table.sql
-- Crea tabla para feedback de eliminación de cuentas
```

### 6. Actualizaciones
```sql
-- Ejecutar sexto: complete_database_setup.sql
-- Agrega avatar_url a vendors si no existe
```

## Notas Importantes

- Todos los scripts incluyen `DROP POLICY IF EXISTS` y `DROP TRIGGER IF EXISTS` para evitar errores si se ejecutan múltiples veces
- Las políticas RLS (Row Level Security) están configuradas para proteger los datos
- Los triggers actualizan automáticamente los campos `updated_at`
- La función `generate_order_number()` genera números de pedido únicos

## Verificación

Después de ejecutar todos los scripts, verifica que las tablas existan:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'vendors', 
  'products', 
  'user_photos', 
  'photo_likes',
  'orders', 
  'order_items', 
  'reviews', 
  'messages', 
  'payments', 
  'bank_accounts',
  'account_deletion_feedback'
);
```








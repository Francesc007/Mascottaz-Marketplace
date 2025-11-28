# 🔧 Guía de Configuración de Supabase para Mascottaz

## 📋 Pasos para Configurar Supabase

### 1. ✅ Variables de Entorno (YA CONFIGURADAS)
Ya tienes configurado tu `.env.local` con:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. 🗄️ Crear Tablas en Supabase

Ve a tu proyecto en Supabase → **SQL Editor** y ejecuta los siguientes scripts **EN ORDEN**:

#### Paso 1: Tabla de Vendedores
Ejecuta el contenido de: `sql/vendors_table_and_rls.sql`

#### Paso 2: Tabla de Productos
Ejecuta el contenido de: `sql/products_table_and_rls.sql`

#### Paso 3: Tabla de Fotos de Usuarios
Ejecuta el contenido de: `sql/create_user_photos_table.sql`

#### Paso 4: Tablas del Dashboard de Vendedor
Ejecuta el contenido de: `sql/create_seller_dashboard_tables_safe.sql`

Esto crea:
- `orders` (pedidos)
- `order_items` (items de pedido)
- `reviews` (reseñas)
- `messages` (mensajes)
- `payments` (pagos)
- `bank_accounts` (cuentas bancarias)

#### Paso 5: Tabla de Feedback de Eliminación
Ejecuta el contenido de: `sql/create_account_deletion_feedback_table.sql`

#### Paso 6: Agregar Avatar URL a Vendedores
Ejecuta el contenido de: `sql/add_avatar_url_to_vendors.sql`

### 3. 📦 Configurar Storage (Buckets)

Ve a **Storage** en Supabase y crea los siguientes buckets:

#### Bucket: `petplace-images`
- **Public**: ✅ Sí (marcar como público)
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/*`

Este bucket se usa para:
- Imágenes de productos
- Fotos de usuarios/mascotas
- Avatares de vendedores

### 4. 🔒 Configurar Políticas de Storage

Para el bucket `petplace-images`, crea estas políticas:

#### Política 1: Lectura Pública
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'petplace-images');
```

#### Política 2: Usuarios pueden subir
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'petplace-images' 
  AND auth.role() = 'authenticated'
);
```

#### Política 3: Usuarios pueden actualizar sus archivos
```sql
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'petplace-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Política 4: Usuarios pueden eliminar sus archivos
```sql
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'petplace-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 5. ✅ Verificar Configuración

Ejecuta este query en SQL Editor para verificar que todas las tablas existan:

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
)
ORDER BY table_name;
```

Deberías ver 11 tablas listadas.

### 6. 🔐 Verificar RLS (Row Level Security)

Verifica que RLS esté habilitado en todas las tablas:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'vendors', 'products', 'user_photos', 'photo_likes',
  'orders', 'order_items', 'reviews', 'messages', 
  'payments', 'bank_accounts', 'account_deletion_feedback'
);
```

Todas deberían tener `rowsecurity = true`.

## 🚀 Orden Rápido de Ejecución

Si prefieres ejecutar todo de una vez, puedes usar:

1. `sql/00_MASTER_SETUP.sql` - Script maestro que crea todo
2. O ejecutar `sql/complete_database_setup.sql`

## ⚠️ Notas Importantes

- **No ejecutes los scripts múltiples veces** a menos que usen `IF NOT EXISTS` o `DROP IF EXISTS`
- Los scripts `*_safe.sql` son seguros de ejecutar múltiples veces
- Después de crear las tablas, **reinicia tu servidor Next.js** para que los cambios surtan efecto

## 🐛 Solución de Problemas

### Error: "relation does not exist"
- Verifica que ejecutaste los scripts SQL en orden
- Asegúrate de estar en el esquema `public`

### Error: "permission denied"
- Verifica que las políticas RLS estén creadas
- Revisa que el usuario autenticado tenga los permisos correctos

### Error al subir imágenes
- Verifica que el bucket `petplace-images` existe
- Verifica que las políticas de Storage estén configuradas
- Asegúrate de que el bucket sea público

## 📞 Siguiente Paso

Una vez configurado todo:
1. Reinicia tu servidor Next.js (`Ctrl+C` y luego `npm run dev`)
2. Abre http://localhost:3000
3. La aplicación debería funcionar correctamente











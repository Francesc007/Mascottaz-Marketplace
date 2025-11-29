# Verificación del Proyecto

## Pasos para ver los avances:

### 1. Verificar que el servidor esté corriendo
```bash
npm run dev
```

El servidor debería estar en: **http://localhost:3000**

### 2. Verificar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### 3. Verificar archivos críticos

✅ **Archivos principales creados:**
- `src/app/page.js` - Home
- `src/app/layout.js` - Layout principal
- `src/components/Header.js` - Header con logo
- `src/components/NavigationBar.jsx` - Barra de navegación
- `src/components/DailyDeals.jsx` - Ofertas del día
- `src/components/CommunityGallery.jsx` - Galería de comunidad
- `src/components/Footer.jsx` - Footer
- `src/lib/supabaseClient.js` - Cliente Supabase
- `src/lib/storage.js` - Servicio de almacenamiento
- `src/middleware.js` - Middleware de autenticación

### 4. Verificar logo

El logo debe estar en: `public/MASCOTTAZ.png`

Si no existe, puedes:
- Agregar tu logo en `public/MASCOTTAZ.png`
- O cambiar la ruta en `Header.js` y otros componentes

### 5. Abrir en el navegador

1. Abre: **http://localhost:3000**
2. Abre la consola del navegador (F12) para ver errores
3. Revisa la pestaña "Console" para errores de JavaScript
4. Revisa la pestaña "Network" para errores de carga

### 6. Errores comunes

**Si ves pantalla en blanco:**
- Revisa la consola del navegador (F12)
- Verifica que las variables de entorno estén configuradas
- Verifica que el logo exista en `public/MASCOTTAZ.png`
- Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

**Si hay errores de Supabase:**
- Verifica que las variables de entorno estén correctas
- Verifica que las tablas existan en Supabase

### 7. Páginas disponibles

- `/` - Home
- `/sell` - Página para vendedores
- `/seller/login` - Login de vendedores
- `/seller/register` - Registro de vendedores
- `/seller/dashboard` - Dashboard de vendedores
- `/seller/products` - Productos
- `/seller/orders` - Pedidos
- `/seller/billing` - Facturación
- `/seller/settings` - Configuración
- `/seller/reviews` - Reseñas
- `/seller/messages` - Mensajes












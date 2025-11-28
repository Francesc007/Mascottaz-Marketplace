# 🔐 Configuración de Credenciales de Supabase

## 📍 Ubicación de las Credenciales

Las credenciales de Supabase deben estar en un archivo **`.env.local`** en la **raíz del proyecto**.

### Estructura del archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_public_key_aqui
```

**⚠️ IMPORTANTE:**
- El archivo `.env.local` está en `.gitignore` (no se sube a Git)
- Debe estar en la raíz del proyecto (mismo nivel que `package.json`)
- Sin espacios antes o después del `=`
- Sin comillas alrededor de los valores

---

## 🔧 Código Funcional que Lee las Credenciales

### 1. Cliente de Supabase (Cliente - Navegador)

**Archivo:** `src/lib/supabaseClient.js`

```javascript
"use client";

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Leer variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // Validación estricta antes de crear el cliente
  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = `
❌ ERROR: Supabase environment variables are not set!

Tu archivo .env.local existe, pero Next.js no está leyendo las variables.

SOLUCIÓN:
1. Detén el servidor Next.js (Ctrl+C en la terminal)
2. Elimina la carpeta .next (o ejecuta: Remove-Item -Recurse -Force .next)
3. Reinicia el servidor: npm run dev

Verifica que tu .env.local tenga este formato (sin espacios antes del =):
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
`;
    
    console.error(errorMessage);
    
    // En desarrollo, mostrar error claro pero no romper la app completamente
    if (typeof window !== 'undefined') {
      console.error('🔴 Supabase URL:', supabaseUrl || 'NO DEFINIDA');
      console.error('🔴 Supabase Key:', supabaseAnonKey ? 'DEFINIDA (oculta)' : 'NO DEFINIDA');
    }
    
    // Lanzar error para que el usuario sepa que algo está mal
    throw new Error(
      'Supabase environment variables are not set. ' +
      'Please check your .env.local file and restart the Next.js server.'
    );
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw error;
  }
}
```

### 2. Cliente Alternativo (Más Simple)

**Archivo:** `src/lib/supabase-client.js`

```javascript
"use client";

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase environment variables are not set');
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw error;
  }
}
```

### 3. Middleware (Servidor)

**Archivo:** `src/middleware.js`

```javascript
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Leer variables de entorno en el servidor
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set');
    return response;
  }

  let supabase;
  try {
    supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // ... configuración de cookies
        },
        remove(name, options) {
          // ... eliminación de cookies
        },
      },
    });
  } catch (err) {
    console.error('Error creating Supabase client in middleware:', err);
    return response;
  }

  // ... resto del middleware
  return response;
}
```

### 4. Uso en Autenticación

**Archivo:** `src/lib/auth.js`

```javascript
"use client";

import { createClient } from "./supabase-client";
import useAuthStore from "../store/authStore";

export function useAuth() {
  const login = async (email, password) => {
    try {
      // Crear cliente de Supabase usando las credenciales
      const supabase = createClient();
      
      // Usar el cliente para autenticación
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: { message: error.message },
        };
      }

      if (data?.user) {
        const userType = data.user.user_metadata?.user_type || 'buyer';
        useAuthStore.getState().login(data.user, userType);

        return {
          success: true,
          user: data.user,
        };
      }

      return {
        success: false,
        error: { message: "Error desconocido al iniciar sesión" },
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error.message || "Error al iniciar sesión" },
      };
    }
  };

  // ... otros métodos (register, getCurrentUser, logout)
  
  return {
    login,
    register,
    getCurrentUser,
    logout,
  };
}
```

---

## ✅ Cómo Verificar que las Credenciales Están Configuradas

### Opción 1: Verificar en la Consola del Navegador

1. Abre la aplicación en el navegador
2. Abre las **Herramientas de Desarrollador** (F12)
3. Ve a la pestaña **Console**
4. Busca mensajes que indiquen:
   - ✅ `Supabase URL: DEFINIDA`
   - ✅ `Supabase Key: DEFINIDA`
   - ❌ Si ves `NO DEFINIDA`, las credenciales no están configuradas

### Opción 2: Ejecutar Script de Verificación

```powershell
node verificar-env.js
```

Este script verificará si las variables están disponibles.

### Opción 3: Verificar Manualmente

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Verifica que tenga este formato exacto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://izlwpdaejefajwllmkln.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE:**
- Sin espacios antes o después del `=`
- Sin comillas alrededor de los valores
- Cada variable en una línea separada

---

## 🔄 Pasos para Configurar las Credenciales

### 1. Crear el archivo `.env.local`

En la raíz del proyecto, crea un archivo llamado `.env.local`:

```powershell
# En PowerShell
New-Item -Path .env.local -ItemType File
```

### 2. Agregar las credenciales

Abre `.env.local` y agrega:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_public_key_aqui
```

**Reemplaza:**
- `https://tu-proyecto.supabase.co` con tu URL real de Supabase
- `tu_anon_public_key_aqui` con tu clave anónima real

### 3. Reiniciar el servidor

```powershell
# Detener el servidor (Ctrl+C)
# Limpiar cache
Remove-Item -Recurse -Force .next
# Reiniciar
npm run dev
```

---

## 📝 Dónde Obtener las Credenciales

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Encontrarás:
   - **Project URL**: Esta es tu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key**: Esta es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🐛 Solución de Problemas

### Error: "Supabase environment variables are not set"

**Solución:**
1. Verifica que el archivo `.env.local` existe en la raíz
2. Verifica que las variables tienen el formato correcto
3. **Reinicia el servidor Next.js** (esto es crucial)
4. Limpia el cache: `Remove-Item -Recurse -Force .next`

### Error: "Cannot read properties of undefined"

**Solución:**
- Las credenciales no están siendo leídas correctamente
- Reinicia el servidor completamente
- Verifica que no hay espacios en el archivo `.env.local`

### Las credenciales no se cargan

**Solución:**
1. Detén completamente el servidor (Ctrl+C)
2. Espera 2-3 segundos
3. Elimina la carpeta `.next`
4. Reinicia: `npm run dev`

---

## 📂 Estructura del Proyecto

```
petplace-mvp/
├── .env.local          ← AQUÍ están tus credenciales
├── src/
│   ├── lib/
│   │   ├── supabaseClient.js    ← Lee las credenciales (versión con validación)
│   │   ├── supabase-client.js   ← Lee las credenciales (versión simple)
│   │   └── auth.js               ← Usa las credenciales para autenticación
│   └── middleware.js             ← Lee las credenciales en el servidor
└── package.json
```

---

## ✅ Resumen

**Las credenciales están en:**
- 📁 Archivo: `.env.local` (en la raíz del proyecto)
- 🔑 Variables: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**El código funcional está en:**
- 📄 `src/lib/supabaseClient.js` - Cliente con validación estricta
- 📄 `src/lib/supabase-client.js` - Cliente simple
- 📄 `src/middleware.js` - Middleware del servidor
- 📄 `src/lib/auth.js` - Autenticación usando las credenciales

**Para que funcione:**
1. Crea `.env.local` con tus credenciales
2. Reinicia el servidor Next.js
3. Las credenciales se leerán automáticamente









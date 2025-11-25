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


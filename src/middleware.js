import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

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
        req.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: req.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name, options) {
        req.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: req.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
    });
  } catch (err) {
    console.error('Error creating Supabase client in middleware:', err);
    return response;
  }

  let user = null;
  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();
    
    if (!authError && authUser) {
      user = authUser;
    }
  } catch (err) {
    console.warn('Error getting user in middleware:', err);
    // Continuar sin usuario si hay error
  }

  const { pathname } = req.nextUrl;

  // Permitir acceso a todas las rutas /auth/* sin autenticación
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }

  // Proteger rutas de vendedor
  if (pathname.startsWith('/seller/')) {
    // Permitir acceso a login y register sin autenticación
    if (pathname === '/seller/login' || pathname === '/seller/register' || 
        pathname === '/seller/forgot-password' || pathname === '/seller/reset-password') {
      return NextResponse.next();
    }

    // Si no está autenticado, redirigir a login
    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = '/seller/login';
      return NextResponse.redirect(url);
    }

    // Verificar si tiene perfil de vendedor
    try {
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      // Si no tiene perfil y no está en register, redirigir a register
      if (!vendor && pathname !== '/seller/register' && !vendorError) {
        const url = req.nextUrl.clone();
        url.pathname = '/seller/register';
        return NextResponse.redirect(url);
      }
    } catch (err) {
      // Si hay error al consultar vendors, permitir continuar
      console.warn('Error checking vendor profile:', err);
    }

    // Redirigir /seller a /seller/dashboard
    if (pathname === '/seller' || pathname === '/seller/') {
      const url = req.nextUrl.clone();
      url.pathname = '/seller/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};


"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { Store, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function SellerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromReset, setFromReset] = useState(false);

  useEffect(() => {
    const from = searchParams.get('from');
    if (from === 'reset-password') {
      setFromReset(true);
    }
    checkAuthStatus();
  }, [searchParams, supabase]);

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !fromReset) {
        // Verificar si tiene perfil de vendedor
        const { data: vendor } = await supabase
          .from("vendors")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (vendor) {
          router.push("/seller/dashboard");
        }
      }
    } catch (err) {
      console.error("Error verificando autenticación:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Verificar si tiene perfil de vendedor
        const { data: vendor } = await supabase
          .from("vendors")
          .select("id")
          .eq("user_id", data.user.id)
          .single();

        if (vendor) {
          router.push("/seller/dashboard");
        } else {
          setError("No tienes un perfil de vendedor. Por favor regístrate primero.");
        }
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intenta de nuevo.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fffaf0' }}>
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/MASCOTTAZ.png"
              alt="Mascottaz logo"
              width={300}
              height={100}
              className="h-[90px] w-[300px] object-contain mx-auto"
              priority
            />
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--brand-blue)' }}>
            Iniciar Sesión Vendedor
          </h1>
          <p className="text-gray-600">Accede a tu panel de vendedor</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="text-right">
              <Link
                href="/seller/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <Store className="w-5 h-5" />
                  Iniciar Sesión Vendedor
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Aún no eres vendedor?{" "}
              <Link href="/seller/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}






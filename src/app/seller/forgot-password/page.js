"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { Store, Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Footer from "../../../components/Footer";

export default function SellerForgotPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const origin = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/seller/reset-password`,
      });

      if (resetError) {
        setError(resetError.message || "Error al enviar el email de recuperación");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
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
            Recuperar Contraseña
          </h1>
          <p className="text-gray-600">Ingresa tu correo para recibir el enlace de recuperación</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email enviado</h3>
              <p className="text-gray-600 mb-6">
                Te hemos enviado un enlace de recuperación a <strong>{email}</strong>. 
                Por favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <Link
                href="/seller/login"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Store className="w-5 h-5" />
                    Enviar enlace de recuperación
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/seller/login"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


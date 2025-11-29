"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { MessageSquare, ArrowLeft, Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import useAuthStore from "../../store/authStore";

export default function SupportPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { isAuthenticated, user } = useAuthStore();
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setError("Debes iniciar sesión para abrir un ticket de soporte");
      return;
    }

    if (!formData.subject.trim()) {
      setError("Por favor ingresa un asunto");
      return;
    }

    if (!formData.body.trim()) {
      setError("Por favor describe tu problema o consulta");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const { data, error: insertError } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user.id,
          subject: formData.subject.trim(),
          body: formData.body.trim(),
          status: "open",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creando ticket:", insertError);
        setError(insertError.message || "Error al crear el ticket de soporte");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setFormData({ subject: "", body: "" });
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Error:", err);
      setError("Error inesperado al crear el ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffaf0' }}>
      <Header />

      <main className="max-w-3xl mx-auto px-2 md:px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <MessageSquare className="w-8 h-8" style={{ color: 'var(--brand-blue)' }} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Contactar Soporte
            </h1>
            <p className="text-gray-600">
              ¿Tienes un problema o pregunta? Estamos aquí para ayudarte. Completa el formulario y nuestro equipo te responderá en un plazo de 24 horas.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-800 font-semibold mb-1">¡Ticket creado exitosamente!</p>
                <p className="text-green-700 text-sm">
                  Hemos recibido tu solicitud. Te responderemos en un plazo de 24 horas hábiles.
                </p>
              </div>
            </div>
          )}

          {!isAuthenticated || !user ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-800 mb-4">
                Debes iniciar sesión para abrir un ticket de soporte.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Iniciar Sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Producto no recibido, Problema con el vendedor, etc."
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe tu problema o consulta *
                </label>
                <textarea
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  placeholder="Proporciona todos los detalles relevantes: número de pedido (si aplica), nombre del vendedor, descripción del problema, fecha de compra, etc."
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.body.length}/2000 caracteres</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Información Importante
                </h3>
                <ul className="space-y-1 text-blue-800 text-sm">
                  <li>• Tiempo de respuesta: 24 horas hábiles</li>
                  <li>• Incluye todos los detalles posibles para una atención más rápida</li>
                  <li>• Si tienes un número de pedido, inclúyelo en tu mensaje</li>
                  <li>• También puedes contactarnos por WhatsApp si es urgente</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={submitting || !formData.subject.trim() || !formData.body.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    Enviar Ticket de Soporte
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Otras formas de contacto</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>WhatsApp:</strong> Para consultas urgentes, puedes contactarnos directamente por WhatsApp.
              </p>
              <p>
                <strong>Email:</strong> También puedes escribirnos a soporte@mascottaz.com
              </p>
              <p>
                <Link href="/how-we-protect" className="text-blue-600 hover:text-blue-700 underline">
                  Conoce más sobre cómo protegemos tus compras
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


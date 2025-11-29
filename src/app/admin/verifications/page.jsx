"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "../../../lib/supabaseClient";
import {
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Eye,
} from "lucide-react";

export default function AdminVerificationsPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [verifications, setVerifications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkAdminAndLoad = async () => {
      try {
        setCheckingAdmin(true);
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push("/");
          return;
        }

        const role =
          user.app_metadata?.role ||
          user.user_metadata?.role ||
          user.app_metadata?.app_metadata?.role;

        if (role !== "admin") {
          router.push("/");
          return;
        }

        setIsAdmin(true);
        await loadVerifications();
      } catch (err) {
        console.error("Error verificando admin:", err);
        setError("Error al cargar las verificaciones. Intenta de nuevo.");
      } finally {
        setCheckingAdmin(false);
      }
    };

    const loadVerifications = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error: vError } = await supabase
          .from("seller_verifications")
          .select("*")
          .order("submitted_at", { ascending: true });

        if (vError) {
          console.error("Error cargando verificaciones:", vError);
          setError("No se pudieron cargar las solicitudes de verificación.");
          return;
        }

        setVerifications(data || []);
      } catch (err) {
        console.error("Error inesperado cargando verificaciones:", err);
        setError("Error inesperado cargando verificaciones.");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoad();
  }, [supabase, router]);

  const refresh = async () => {
    setSelected(null);
    setNotes("");
    setSuccess("");
    setError("");
    try {
      setLoading(true);
      const { data, error: vError } = await supabase
        .from("seller_verifications")
        .select("*")
        .order("submitted_at", { ascending: true });

      if (vError) {
        console.error("Error recargando verificaciones:", vError);
        setError("No se pudieron recargar las solicitudes.");
        return;
      }

      setVerifications(data || []);
    } catch (err) {
      console.error("Error al recargar:", err);
      setError("Error inesperado al recargar.");
    } finally {
      setLoading(false);
    }
  };

  const createSignedUrl = async (path) => {
    if (!path) return null;
    const { data, error } = await supabase.storage
      .from("seller_docs")
      .createSignedUrl(path, 60 * 10); // 10 minutos

    if (error) {
      console.error("Error creando signed URL:", error);
      return null;
    }

    return data?.signedUrl || null;
  };

  const handleSelect = async (verification) => {
    setSelected({
      ...verification,
      signed: {
        ine_front_url: null,
        ine_back_url: null,
        proof_address_url: null,
        selfie_url: null,
      },
    });
    setNotes(verification.notes || "");
    setSuccess("");
    setError("");

    // Generar signed URLs en segundo plano
    try {
      const [ineFront, ineBack, proof, selfie] = await Promise.all([
        createSignedUrl(verification.ine_front_url),
        createSignedUrl(verification.ine_back_url),
        createSignedUrl(verification.proof_address_url),
        createSignedUrl(verification.selfie_url),
      ]);

      setSelected((prev) =>
        prev
          ? {
              ...prev,
              signed: {
                ine_front_url: ineFront,
                ine_back_url: ineBack,
                proof_address_url: proof,
                selfie_url: selfie,
              },
            }
          : prev
      );
    } catch (err) {
      console.error("Error generando URLs firmadas:", err);
    }
  };

  const handleDecision = async (status) => {
    if (!selected) return;
    if (!["approved", "rejected"].includes(status)) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      // Obtener admin actual
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Sesión expirada. Vuelve a iniciar sesión como admin.");
        setActionLoading(false);
        return;
      }

      // Actualizar seller_verifications
      const { error: updateError } = await supabase
        .from("seller_verifications")
        .update({
          status,
          notes: notes || null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", selected.id);

      if (updateError) {
        console.error("Error actualizando verificación:", updateError);
        setError("No se pudo actualizar la solicitud. Intenta de nuevo.");
        setActionLoading(false);
        return;
      }

      // Si se aprueba, marcar como vendedor verificado en profiles
      if (status === "approved") {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            is_seller: true,
            seller_verified: true,
          })
          .eq("user_id", selected.user_id);

        if (profileError) {
          console.error("Error actualizando perfil:", profileError);
          setError(
            "La solicitud fue aprobada, pero hubo un problema al actualizar el perfil del vendedor."
          );
          setActionLoading(false);
          return;
        }
      }

      setSuccess(
        status === "approved"
          ? "Solicitud aprobada y vendedor marcado como verificado."
          : "Solicitud rechazada correctamente."
      );

      await refresh();
    } catch (err) {
      console.error("Error en decisión de verificación:", err);
      setError("Error inesperado al procesar la decisión.");
    } finally {
      setActionLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fffaf0" }}
      >
        <div className="flex flex-col items-center gap-3 text-gray-700">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: "#fffaf0" }}
    >
      <div className="max-w-6xl mx-auto px-2 md:px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Image
              src="/MASCOTTAZ.png"
              alt="Mascottaz logo"
              width={200}
              height={60}
              className="h-[60px] w-[200px] object-contain"
              priority
            />
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--brand-blue)" }}
              >
                Panel de Verificación de Vendedores
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Revisa documentos de identidad y aprueba/rechaza solicitudes de
                verificación.
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <ShieldCheck className="w-5 h-5" style={{ color: "var(--brand-blue)" }} />
            <span>Solo administradores</span>
          </div>
        </div>

        {/* Estado global */}
        {error && (
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <p className="text-sm text-orange-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Lista de solicitudes */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Solicitudes de verificación
              </h2>
              {loading && (
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              )}
            </div>

            {verifications.length === 0 && !loading && (
              <p className="text-sm text-gray-600">
                No hay solicitudes de verificación registradas por ahora.
              </p>
            )}

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {verifications.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleSelect(v)}
                  className={`w-full text-left border rounded-lg px-3 py-3 flex items-center justify-between gap-3 hover:bg-blue-50 transition-colors ${
                    selected?.id === v.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Usuario: <span className="font-mono text-xs">{v.user_id}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Enviada:{" "}
                      {v.submitted_at
                        ? new Date(v.submitted_at).toLocaleString("es-MX")
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        v.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : v.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {v.status}
                    </span>
                    <Eye className="w-4 h-4 text-gray-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detalle de la solicitud seleccionada */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-3 py-16">
                <ShieldCheck
                  className="w-10 h-10"
                  style={{ color: "var(--brand-blue)" }}
                />
                <p>Selecciona una solicitud para ver los documentos y tomar una decisión.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Detalle de verificación
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(null);
                      setNotes("");
                      setSuccess("");
                      setError("");
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-4 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Usuario:</span>{" "}
                    <span className="font-mono text-xs">{selected.user_id}</span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Estado actual:</span>{" "}
                    <span className="capitalize">{selected.status}</span>
                  </p>
                  {selected.reviewed_at && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Última revisión:</span>{" "}
                      {new Date(selected.reviewed_at).toLocaleString("es-MX")}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {[
                    { key: "ine_front_url", label: "INE - Frente" },
                    { key: "ine_back_url", label: "INE - Reverso" },
                    { key: "proof_address_url", label: "Comprobante de domicilio" },
                    { key: "selfie_url", label: "Selfie con INE" },
                  ].map(({ key, label }) => {
                    const path = selected[key];
                    const signed =
                      selected.signed && selected.signed[`${key}`]
                        ? selected.signed[`${key}`]
                        : null;
                    return (
                      <div key={key} className="border border-gray-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          {label}
                        </p>
                        {path ? (
                          <div className="flex flex-col gap-1">
                            <p className="text-[11px] text-gray-500 break-all">
                              {path}
                            </p>
                            {signed ? (
                              <a
                                href={signed}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline mt-1"
                              >
                                <Eye className="w-3 h-3" />
                                Ver documento
                              </a>
                            ) : (
                              <p className="text-[11px] text-gray-400 mt-1">
                                Generando enlace seguro...
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">
                            No se proporcionó este archivo.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas internas (no visibles para el vendedor)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Ej: Documento poco legible, volver a solicitar; datos coherentes con dirección registrada, etc."
                  />
                </div>

                <div className="flex flex-wrap gap-3 justify-end">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleDecision("rejected")}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleDecision("approved")}
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "var(--brand-blue)" }}
                  >
                    {actionLoading ? "Procesando..." : "Aprobar y marcar como verificado"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



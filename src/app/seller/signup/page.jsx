"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "../../../lib/supabaseClient";
import {
  ShieldCheck,
  IdCard,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Footer from "../../../components/Footer";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

export default function SellerSignupVerificationPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingStatus, setExistingStatus] = useState(null);

  const [files, setFiles] = useState({
    ineFront: null,
    ineBack: null,
    proofAddress: null,
    selfie: null,
  });

  const [fileErrors, setFileErrors] = useState({});
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  useEffect(() => {
    const loadUserAndVerification = async () => {
      try {
        setLoadingUser(true);
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push("/seller/login");
          return;
        }

        setUser(authUser);

        // Cargar estado actual de verificación (si existe)
        const { data: verif, error: verifError } = await supabase
          .from("seller_verifications")
          .select("*")
          .eq("user_id", authUser.id)
          .order("submitted_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!verifError && verif) {
          setExistingStatus(verif.status);
        }
      } catch (err) {
        console.error("Error cargando usuario/verificación:", err);
        setError("Error al cargar tu información. Intenta nuevamente.");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserAndVerification();
  }, [supabase, router]);

  const validateFile = (file) => {
    if (!file) return null;
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Formato inválido. Sólo se permiten JPG, PNG o PDF.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "El archivo no debe exceder 10MB.";
    }
    return null;
  };

  const handleFileChange = (key, event) => {
    const file = event.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));

    if (file) {
      const validationError = validateFile(file);
      setFileErrors((prev) => ({
        ...prev,
        [key]: validationError || "",
      }));
    } else {
      setFileErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const uploadDoc = async (file, userId, label) => {
    if (!file) return null;
    const ext = file.name.split(".").pop();
    const safeLabel = label.replace(/[^a-zA-Z0-9_]/g, "");
    const path = `${userId}/${safeLabel}_${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("seller_docs")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error(`Error subiendo ${label}:`, error);
      throw new Error(`No se pudo subir el archivo de ${label}.`);
    }

    // Guardamos el path; luego el admin generará URLs firmadas a partir de él
    return path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Debes iniciar sesión para solicitar verificación.");
      return;
    }

    // Validar aceptación
    if (!acceptedPolicy) {
      setError("Debes aceptar el aviso de confidencialidad para continuar.");
      return;
    }

    // Validar archivos requeridos
    const requiredKeys = ["ineFront", "ineBack", "proofAddress", "selfie"];
    const newErrors = {};
    for (const key of requiredKeys) {
      if (!files[key]) {
        newErrors[key] = "Este archivo es obligatorio.";
      } else {
        const validationError = validateFile(files[key]);
        if (validationError) {
          newErrors[key] = validationError;
        }
      }
    }

    setFileErrors((prev) => ({ ...prev, ...newErrors }));

    if (Object.values(newErrors).some((msg) => msg && msg.length > 0)) {
      setError("Revisa los archivos marcados antes de continuar.");
      return;
    }

    setSubmitting(true);
    try {
      // Subir documentos al bucket privado seller_docs
      const [ineFrontPath, ineBackPath, proofAddressPath, selfiePath] =
        await Promise.all([
          uploadDoc(files.ineFront, user.id, "ine_front"),
          uploadDoc(files.ineBack, user.id, "ine_back"),
          uploadDoc(files.proofAddress, user.id, "proof_address"),
          uploadDoc(files.selfie, user.id, "selfie_ine"),
        ]);

      // Ver si ya hay una verificación previa
      const { data: existing, error: existingError } = await supabase
        .from("seller_verifications")
        .select("*")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!existingError && existing) {
        // Actualizar la solicitud más reciente y volver a pending
        const { error: updateError } = await supabase
          .from("seller_verifications")
          .update({
            status: "pending",
            ine_front_url: ineFrontPath,
            ine_back_url: ineBackPath,
            proof_address_url: proofAddressPath,
            selfie_url: selfiePath,
            notes: null,
            reviewed_by: null,
            reviewed_at: null,
            submitted_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Error actualizando verificación:", updateError);
          throw new Error("No se pudo actualizar tu solicitud de verificación.");
        }
      } else {
        // Crear nueva solicitud
        const { error: insertError } = await supabase
          .from("seller_verifications")
          .insert({
            user_id: user.id,
            status: "pending",
            ine_front_url: ineFrontPath,
            ine_back_url: ineBackPath,
            proof_address_url: proofAddressPath,
            selfie_url: selfiePath,
          });

        if (insertError) {
          console.error("Error creando verificación:", insertError);
          throw new Error("No se pudo crear tu solicitud de verificación.");
        }
      }

      setExistingStatus("pending");
      setSuccess(
        "Tu solicitud de verificación se envió correctamente. Nuestro equipo revisará tus documentos en un plazo de 48 a 72 horas hábiles."
      );
      setFiles({
        ineFront: null,
        ineBack: null,
        proofAddress: null,
        selfie: null,
      });
    } catch (err) {
      console.error("Error en envío de verificación:", err);
      setError(
        err?.message ||
          "Ocurrió un error al enviar tu solicitud. Intenta de nuevo más tarde."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fffaf0" }}
      >
        <div className="flex flex-col items-center gap-3 text-gray-700">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Cargando tu información...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: "#fffaf0" }}
    >
      <div className="max-w-3xl mx-auto px-2 md:px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Image
            src="/MASCOTTAZ.png"
            alt="Mascottaz logo"
            width={260}
            height={80}
            className="h-[80px] w-[260px] object-contain mx-auto mb-4"
            priority
          />
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--brand-blue)" }}
          >
            Verificación de Vendedor
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Para proteger a los compradores y a toda la comunidad, revisamos
            manualmente ciertos documentos de los vendedores. Esta información
            se maneja de forma confidencial y sólo se usa para validar tu
            identidad y crear un entorno de confianza.
          </p>
        </div>

        {/* Estado actual */}
        {existingStatus && (
          <div className="mb-6 p-4 rounded-lg flex items-start gap-3 bg-blue-50 border border-blue-200">
            {existingStatus === "approved" ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            ) : existingStatus === "rejected" ? (
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-gray-900">
                Estado de tu verificación:{" "}
                <span className="capitalize">{existingStatus}</span>
              </p>
              {existingStatus === "pending" && (
                <p className="text-sm text-gray-700 mt-1">
                  Tu solicitud está en revisión. Si necesitas actualizar tus
                  documentos, puedes volver a enviarlos con este formulario.
                </p>
              )}
              {existingStatus === "approved" && (
                <p className="text-sm text-gray-700 mt-1">
                  Ya eres un vendedor verificado. Mostraremos el sello
                  <span className="font-semibold">
                    {" "}
                    “Vendedor verificado”
                  </span>{" "}
                  junto a tu nombre en tus productos y perfil de tienda.
                </p>
              )}
              {existingStatus === "rejected" && (
                <p className="text-sm text-gray-700 mt-1">
                  Tu solicitud anterior fue rechazada. Puedes volver a enviar
                  documentos corregidos o actualizados con este formulario.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Errores / éxitos */}
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

        {/* Formulario de documentos */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <IdCard className="w-6 h-6" style={{ color: "var(--brand-blue)" }} />
            <h2 className="text-xl font-semibold text-gray-800">
              Documentos para verificación
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Te pediremos cuatro archivos: INE frente, INE atrás, comprobante de
            domicilio y una selfie sosteniendo tu INE. Estos datos se almacenan
            en un bucket privado de Supabase y sólo el equipo de Mascottaz
            puede verlos para validar tu identidad.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* INE frente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                INE - Frente *
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange("ineFront", e)}
                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {fileErrors.ineFront && (
                <p className="text-xs text-red-600 mt-1">{fileErrors.ineFront}</p>
              )}
            </div>

            {/* INE atrás */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                INE - Reverso *
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange("ineBack", e)}
                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {fileErrors.ineBack && (
                <p className="text-xs text-red-600 mt-1">{fileErrors.ineBack}</p>
              )}
            </div>

            {/* Comprobante de domicilio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comprobante de domicilio (agua, luz, etc.) *
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange("proofAddress", e)}
                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {fileErrors.proofAddress && (
                <p className="text-xs text-red-600 mt-1">
                  {fileErrors.proofAddress}
                </p>
              )}
            </div>

            {/* Selfie con INE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selfie sosteniendo tu INE *
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange("selfie", e)}
                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {fileErrors.selfie && (
                <p className="text-xs text-red-600 mt-1">{fileErrors.selfie}</p>
              )}
            </div>
          </div>

          {/* Aviso de confidencialidad */}
          <div className="mt-2 p-4 rounded-lg bg-blue-50 border border-blue-200 flex gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">
                ¿Por qué pedimos estos documentos?
              </p>
              <p>
                Usamos esta información únicamente para verificar que eres una
                persona real y reducir riesgos de fraude. Los archivos se
                almacenan de forma cifrada en un bucket privado y sólo el equipo
                de Mascottaz puede revisarlos. No se comparten con terceros y
                puedes solicitar su eliminación en cualquier momento.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 mt-2">
            <input
              id="acceptPolicy"
              type="checkbox"
              checked={acceptedPolicy}
              onChange={(e) => setAcceptedPolicy(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor="acceptPolicy"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Confirmo que la información proporcionada es verdadera y autorizo
              a Mascottaz a revisar estos documentos únicamente con fines de
              verificación de identidad y seguridad dentro de la plataforma.
            </label>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--brand-blue)" }}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Enviando solicitud..." : "Enviar verificación"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}



"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { Store, User, Mail, Phone, MapPin, FileText, Loader2, CheckCircle2, AlertCircle, Lock, Eye, EyeOff } from "lucide-react";

export default function SellerRegisterPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    accountEmail: "",
    password: "",
    confirmPassword: "",
    business_name: "",
    owner_name: "",
    phone: "",
    email: "",
    address: "",
    description: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    checkAuth();
  }, [supabase]);

  const checkAuth = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
      setFormData(prev => ({
        ...prev,
        email: user.email || ""
      }));
    } catch (err) {
      console.error("Error verificando autenticación:", err);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!isAuthenticated) {
      if (!formData.accountEmail.trim()) {
        errors.accountEmail = "El correo es requerido";
      } else if (!/\S+@\S+\.\S+/.test(formData.accountEmail)) {
        errors.accountEmail = "El correo no es válido";
      }
      
      if (!formData.password) {
        errors.password = "La contraseña es requerida";
      } else if (formData.password.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres";
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Confirma tu contraseña";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    if (!formData.business_name.trim()) {
      errors.business_name = "El nombre del negocio es requerido";
    }
    if (!formData.owner_name.trim()) {
      errors.owner_name = "El nombre del propietario es requerido";
    }
    if (!formData.phone.trim()) {
      errors.phone = "El teléfono es requerido";
    }
    if (!formData.email.trim() && isAuthenticated) {
      errors.email = "El correo es requerido";
    }
    if (!formData.address.trim()) {
      errors.address = "La dirección es requerida";
    }
    if (!formData.description.trim()) {
      errors.description = "La descripción es requerida";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      let user;

      if (!isAuthenticated) {
        // Crear cuenta de usuario
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.accountEmail.trim(),
          password: formData.password,
          options: {
            data: {
              user_type: "seller"
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message || "Error al crear la cuenta");
          setSubmitting(false);
          return;
        }

        if (!signUpData.user) {
          setError("Error al crear la cuenta de usuario");
          setSubmitting(false);
          return;
        }

        user = signUpData.user;
      } else {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        if (userError || !currentUser) {
          setError("Error al obtener tu información de usuario.");
          setSubmitting(false);
          return;
        }
        user = currentUser;
      }

      // Verificar que no exista un perfil
      const { data: existing } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        setError("Ya tienes un perfil de vendedor creado.");
        router.push("/seller/dashboard");
        return;
      }

      // Insertar nuevo perfil de vendedor
      const vendorEmail = isAuthenticated ? formData.email.trim() : formData.accountEmail.trim();
      
      const { data, error: insertError } = await supabase
        .from("vendors")
        .insert({
          user_id: user.id,
          business_name: formData.business_name.trim(),
          owner_name: formData.owner_name.trim(),
          phone: formData.phone.trim(),
          email: vendorEmail,
          address: formData.address.trim(),
          description: formData.description.trim()
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error insertando perfil de vendedor:", insertError);
        if (insertError.code === "23505") {
          setError("Ya tienes un perfil de vendedor creado.");
        } else {
          setError(insertError.message || "Error al crear el perfil de vendedor.");
        }
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/seller/dashboard");
      }, 2000);

    } catch (err) {
      console.error("Error inesperado:", err);
      setError("Error inesperado. Intenta más tarde.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fffaf0' }}>
      <div className="max-w-2xl mx-auto px-2 md:px-4">
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
            Registro de Vendedor
          </h1>
          <p className="text-gray-600">Crea tu cuenta de vendedor en Mascottaz</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-green-800 text-sm">¡Registro exitoso! Redirigiendo...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isAuthenticated && (
              <>
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                  Datos de Cuenta
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.accountEmail}
                        onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          formErrors.accountEmail ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                    {formErrors.accountEmail && (
                      <p className="text-red-600 text-xs mt-1">{formErrors.accountEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          formErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-red-600 text-xs mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          formErrors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="text-red-600 text-xs mt-1">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
              Información del Negocio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Negocio *
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.business_name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Ej: Tienda de Mascotas Premium"
                  />
                </div>
                {formErrors.business_name && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.business_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Propietario *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.owner_name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                {formErrors.owner_name && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.owner_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Ej: +52 55 1234 5678"
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.phone}</p>
                )}
              </div>

              {isAuthenticated && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        formErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.address ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Calle, número, colonia, ciudad, estado, CP"
                  />
                </div>
                {formErrors.address && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.address}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del Negocio *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Describe tu negocio, productos que vendes, etc."
                  />
                </div>
                {formErrors.description && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.description}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Store className="w-5 h-5" />
                  Crear Cuenta de Vendedor
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link href="/seller/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}






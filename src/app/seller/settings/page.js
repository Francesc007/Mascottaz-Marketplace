"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { 
  Settings, 
  ArrowLeft, 
  Save,
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Camera,
  Trash2,
  X,
  Building2,
  CreditCard,
  Lock
} from "lucide-react";
import StorageService from "../../../lib/storage";

export default function SellerSettingsPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    owner_name: "",
    phone: "",
    email: "",
    address: "",
    description: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState({
    reason: "",
    comments: ""
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bankAccount, setBankAccount] = useState(null);
  const [bankFormData, setBankFormData] = useState({
    account_holder_name: "",
    account_type: "checking",
    bank_name: "",
    account_number: "",
    routing_number: ""
  });

  useEffect(() => {
    loadVendorData();
  }, [supabase]);

  const loadVendorData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/seller/login");
        return;
      }

      const { data: vendorData } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!vendorData) {
        router.push("/seller/register");
        return;
      }

      setVendor(vendorData);
      setFormData({
        business_name: vendorData.business_name || "",
        owner_name: vendorData.owner_name || "",
        phone: vendorData.phone || "",
        email: vendorData.email || "",
        address: vendorData.address || "",
        description: vendorData.description || ""
      });
      
      if (vendorData.avatar_url) {
        setImagePreview(vendorData.avatar_url);
      }

      // Cargar cuenta bancaria
      try {
        const { data: bankData } = await supabase
          .from("bank_accounts")
          .select("*")
          .eq("seller_id", user.id)
          .eq("is_default", true)
          .single();

        if (bankData) {
          setBankAccount(bankData);
          setBankFormData({
            account_holder_name: bankData.account_holder_name || "",
            account_type: bankData.account_type || "checking",
            bank_name: bankData.bank_name || "",
            account_number: bankData.account_number_last4 ? `****${bankData.account_number_last4}` : "",
            routing_number: bankData.routing_number_last4 ? `****${bankData.routing_number_last4}` : ""
          });
        }
      } catch (err) {
        console.log("No hay cuenta bancaria configurada:", err);
      }
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Por favor selecciona un archivo de imagen válido");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe exceder 5MB");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) {
      setError("Por favor selecciona una imagen");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("No estás autenticado");
        return;
      }

      const result = await StorageService.uploadImage(profileImage, user.id, 'vendor_avatars');

      if (result.success) {
        const { error: updateError } = await supabase
          .from("vendors")
          .update({ avatar_url: result.url })
          .eq("user_id", user.id);

        if (updateError) throw updateError;

        setSuccess("✅ Foto de perfil actualizada exitosamente");
        setProfileImage(null);
        await loadVendorData();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("❌ Error al subir la foto de perfil: " + (result.error || ''));
      }
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      setError("❌ Error al subir la foto de perfil: " + (err?.message || ''));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("No estás autenticado");
        return;
      }

      const { error } = await supabase
        .from("vendors")
        .update({
          business_name: formData.business_name.trim(),
          owner_name: formData.owner_name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          description: formData.description.trim()
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setSuccess("✅ Perfil actualizado exitosamente");
      await loadVendorData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error guardando perfil:", err);
      setError("❌ Error al guardar el perfil: " + (err?.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setSuccess("✅ Contraseña actualizada exitosamente");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error actualizando contraseña:", err);
      setError("❌ Error al actualizar la contraseña: " + (err?.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBankAccount = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("No estás autenticado");
        return;
      }

      const { data: vendorData } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!vendorData) {
        setError("No se encontró tu perfil de vendedor");
        return;
      }

      const accountLast4 = bankFormData.account_number.slice(-4);
      const routingLast4 = bankFormData.routing_number.slice(-4);

      const bankData = {
        seller_id: user.id,
        vendor_id: vendorData.id,
        account_holder_name: bankFormData.account_holder_name.trim(),
        account_type: bankFormData.account_type,
        bank_name: bankFormData.bank_name.trim(),
        account_number_last4: accountLast4,
        routing_number_last4: routingLast4,
        is_default: true,
        is_verified: false
      };

      if (bankAccount) {
        const { error } = await supabase
          .from("bank_accounts")
          .update(bankData)
          .eq("id", bankAccount.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("bank_accounts")
          .insert([bankData]);

        if (error) throw error;
      }

      setSuccess("✅ Datos bancarios guardados exitosamente. La cuenta será verificada por Stripe.");
      await loadVendorData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error guardando datos bancarios:", err);
      setError("❌ Error al guardar los datos bancarios: " + (err?.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }

    setDeleting(true);
    setError("");
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("No estás autenticado");
        return;
      }

      // Guardar feedback antes de eliminar
      if (deleteFeedback.reason || deleteFeedback.comments) {
        try {
          const { error: checkError } = await supabase
            .from("account_deletion_feedback")
            .select("id")
            .limit(1);
          
          if (!checkError) {
            await supabase
              .from("account_deletion_feedback")
              .insert({
                user_id: user.id,
                user_type: "vendor",
                reason: deleteFeedback.reason,
                comments: deleteFeedback.comments,
                created_at: new Date().toISOString()
              });
          }
        } catch (feedbackError) {
          console.warn("No se pudo guardar el feedback (la tabla puede no existir):", feedbackError);
        }
      }

      // Eliminar datos del vendedor
      if (vendor?.avatar_url) {
        try {
          await StorageService.deleteImage(vendor.avatar_url);
        } catch (err) {
          console.warn("Error eliminando avatar:", err);
        }
      }

      // Eliminar productos y sus imágenes
      const { data: products } = await supabase
        .from("products")
        .select("imagen")
        .eq("id_vendedor", user.id);

      if (products) {
        for (const product of products) {
          if (product.imagen) {
            try {
              await StorageService.deleteImage(product.imagen);
            } catch (err) {
              console.warn("Error eliminando imagen de producto:", err);
            }
          }
        }
      }

      // Eliminar perfil de vendedor (esto eliminará en cascada los productos, pedidos, etc.)
      const { error: deleteError } = await supabase
        .from("vendors")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      // Eliminar cuenta de usuario
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      if (authError) {
        // Si no hay admin, al menos cerrar sesión
        await supabase.auth.signOut();
      }

      router.push("/");
    } catch (err) {
      console.error("Error eliminando cuenta:", err);
      setError("❌ Error al eliminar la cuenta: " + (err?.message || ''));
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fffaf0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffaf0' }}>
      <header className="shadow-sm" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex flex-col items-center py-4">
            <div className="flex items-center justify-center mb-4">
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/MASCOTTAZ.png"
                  alt="Mascottaz logo"
                  width={300}
                  height={100}
                  className="h-[90px] w-[300px] object-contain"
                  priority
                />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="w-full flex items-center justify-between py-3 px-8" style={{ backgroundColor: 'var(--interaction-blue)' }}>
          <div className="max-w-screen-2xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/seller/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                <Settings className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
                Configuración
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Foto de Perfil */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Foto de Perfil
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-200" style={{ backgroundColor: 'var(--interaction-blue-light)' }}>
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="w-16 h-16" style={{ color: 'var(--brand-blue)' }} />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors duration-200 cursor-pointer shadow-md">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-4">
                  Sube una foto de perfil para tu tienda. La imagen debe ser menor a 5MB y en formato JPG, PNG o GIF.
                </p>
                {profileImage && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploadingImage}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                      {uploadingImage ? "Subiendo..." : "Guardar Foto"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileImage(null);
                        setImagePreview(vendor?.avatar_url || null);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información del Negocio */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Store className="w-5 h-5" />
              Información del Negocio
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Negocio *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Tienda de Mascotas Premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Propietario *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.owner_name}
                      onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+52 55 1234 5678"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Calle, número, colonia, ciudad, estado, CP"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del Negocio *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe tu negocio, productos que vendes, etc."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>

          {/* Cambiar Contraseña */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Cambiar Contraseña
            </h2>
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nueva Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirma tu nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Actualizando..." : "Actualizar Contraseña"}
                </button>
              </div>
            </form>
          </div>

          {/* Datos Bancarios */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Datos Bancarios (Stripe)
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Configura tu cuenta bancaria para recibir pagos. Los datos se almacenan de forma segura mediante Stripe.
            </p>
            <form onSubmit={handleSaveBankAccount} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Titular *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankFormData.account_holder_name}
                    onChange={(e) => setBankFormData({ ...bankFormData, account_holder_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Cuenta *
                  </label>
                  <select
                    required
                    value={bankFormData.account_type}
                    onChange={(e) => setBankFormData({ ...bankFormData, account_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="checking">Cuenta Corriente</option>
                    <option value="savings">Cuenta de Ahorros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Banco *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankFormData.bank_name}
                    onChange={(e) => setBankFormData({ ...bankFormData, bank_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Banco Nacional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Cuenta *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankFormData.account_number}
                    onChange={(e) => setBankFormData({ ...bankFormData, account_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 1234567890"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Ruteo (CLABE/Routing) *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankFormData.routing_number}
                    onChange={(e) => setBankFormData({ ...bankFormData, routing_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 012345678901234567"
                    maxLength={18}
                  />
                </div>
              </div>

              {bankAccount && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Cuenta Configurada</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {bankAccount.is_verified ? "Cuenta verificada" : "Cuenta pendiente de verificación"}
                  </p>
                  {bankAccount.account_number_last4 && (
                    <p className="text-sm text-blue-600 mt-1">
                      Cuenta terminada en: {bankAccount.account_number_last4}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Guardando..." : "Guardar Datos Bancarios"}
              </button>
            </form>
          </div>

          {/* Eliminar Cuenta */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
              ¿Ya no deseas continuar?{" "}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="underline font-medium hover:opacity-80 transition-opacity"
                style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-body)' }}
              >
                Eliminar cuenta
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--brand-blue)' }}>
                  <Trash2 className="w-6 h-6" />
                  Eliminar Cuenta
                </h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setShowConfirmDelete(false);
                    setDeleteFeedback({ reason: "", comments: "" });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!showConfirmDelete ? (
                <>
                  <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--interaction-blue-light)', border: `1px solid var(--interaction-blue-dark)` }}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--brand-blue)' }} />
                      <div>
                        <p className="font-semibold mb-1" style={{ color: 'var(--brand-blue)' }}>
                          Esta acción eliminará permanentemente tu cuenta y todos tus datos
                        </p>
                        <p className="text-sm" style={{ color: 'var(--brand-blue)' }}>
                          Todos tus productos, pedidos, reseñas y datos personales serán eliminados de forma permanente. Esta acción no se puede deshacer.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Por qué estás eliminando tu cuenta? (Opcional)
                      </label>
                      <select
                        value={deleteFeedback.reason}
                        onChange={(e) => setDeleteFeedback({ ...deleteFeedback, reason: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecciona una razón</option>
                        <option value="no_uso">Ya no uso la plataforma</option>
                        <option value="problemas_tecnicos">Problemas técnicos</option>
                        <option value="precio">Precios o comisiones</option>
                        <option value="competencia">Encontré otra plataforma</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentarios adicionales (Opcional)
                      </label>
                      <textarea
                        value={deleteFeedback.comments}
                        onChange={(e) => setDeleteFeedback({ ...deleteFeedback, comments: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ayúdanos a mejorar compartiendo tus comentarios..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setDeleteFeedback({ reason: "", comments: "" });
                      }}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 px-6 py-3 rounded-lg transition-colors font-medium text-white"
                      style={{ backgroundColor: 'var(--brand-blue)' }}
                    >
                      Continuar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--interaction-blue-light)', border: `1px solid var(--interaction-blue-dark)` }}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--brand-blue)' }} />
                      <div>
                        <p className="font-semibold mb-1" style={{ color: 'var(--brand-blue)' }}>
                          Confirmación Final
                        </p>
                        <p className="text-sm" style={{ color: 'var(--brand-blue)' }}>
                          ¿Estás completamente seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowConfirmDelete(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      No, Cancelar
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="flex-1 px-6 py-3 rounded-lg transition-colors font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: 'var(--brand-blue)' }}
                    >
                      {deleting ? "Eliminando..." : "Sí, Eliminar Cuenta"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}








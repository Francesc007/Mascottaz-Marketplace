"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NavigationBar from "../../components/NavigationBar";
import BannerUpload from "../../components/profile/BannerUpload";
import AvatarUpload from "../../components/profile/AvatarUpload";
import PetPhotoGallery from "../../components/profile/PetPhotoGallery";
import useAuthStore from "../../store/authStore";
import { useAuth } from "../../lib/auth";
import ProfileAPI from "../../lib/profile/api";
import { 
  ArrowLeft,
  Edit,
  Save,
  X,
  MapPin,
  FileText
} from "lucide-react";

export default function PerfilPage() {
  const router = useRouter();
  const { location } = useAuthStore();
  const { getCurrentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    location_text: "",
    description: "",
    pet_description: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndLoad = async () => {
      try {
        setLoading(true);
        // Verificar con Supabase directamente
        const { user: userData, error: userError } = await getCurrentUser();
        
        if (!isMounted) return;

        if (!userData || userError) {
          // Si no hay sesión o hay error, redirigir al inicio
          if (userError?.message?.includes('session') || userError?.message?.includes('Auth session missing')) {
            console.log("No hay sesión activa, redirigiendo al inicio");
          } else {
            console.error("Error obteniendo usuario:", userError);
          }
          router.push("/");
          return;
        }

        // Guardar usuario en estado local
        setCurrentUser(userData);

        // Obtener location del store solo una vez
        const currentLocation = useAuthStore.getState().location;

        // Cargar perfil desde Supabase
        const profileResult = await ProfileAPI.getProfile(userData.id);
        
        if (!isMounted) return;

        if (profileResult.success) {
          const profileData = profileResult.data;
          setProfile(profileData);
          
          setFormData({
            full_name: profileData?.full_name || userData.user_metadata?.full_name || "",
            location_text: profileData?.location_text || 
              (currentLocation ? `${currentLocation.municipio || currentLocation.city}, ${currentLocation.estado || currentLocation.state}` : ""),
            description: profileData?.description || "",
            pet_description: profileData?.pet_description || ""
          });
        } else {
          // Si no existe perfil, inicializar con datos del usuario
          setFormData({
            full_name: userData.user_metadata?.full_name || "",
            location_text: currentLocation ? `${currentLocation.municipio || currentLocation.city}, ${currentLocation.estado || currentLocation.state}` : "",
            description: "",
            pet_description: ""
          });
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error cargando perfil:", err);
        setError("Error al cargar el perfil");
        router.push("/");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuthAndLoad();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSave = async () => {
    setError("");
    setSuccess("");

    // Validar descripción (máximo 100 caracteres)
    if (formData.description.length > 100) {
      setError("La descripción no debe exceder 100 caracteres");
      return;
    }

    try {
      const result = await ProfileAPI.upsertProfile(currentUser.id, {
        full_name: formData.full_name,
        location_text: formData.location_text,
        description: formData.description,
        pet_description: formData.pet_description
      });

      if (result.success) {
        setSuccess("Perfil actualizado exitosamente");
        setEditing(false);
        setProfile(result.data);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Error al actualizar el perfil: " + result.error);
      }
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      setError("Error al actualizar el perfil: " + (err?.message || ""));
    }
  };

  const handleBannerUpdate = async (bannerData) => {
    try {
      const result = await ProfileAPI.upsertProfile(currentUser.id, {
        ...profile,
        banner_url: bannerData.banner_url,
        banner_position: bannerData.banner_position
      });

      if (result.success) {
        setProfile(result.data);
      }
    } catch (err) {
      console.error("Error actualizando banner:", err);
    }
  };

  const handleAvatarUpdate = async (avatarData) => {
    try {
      const result = await ProfileAPI.upsertProfile(currentUser.id, {
        ...profile,
        avatar_url: avatarData.avatar_url
      });

      if (result.success) {
        setProfile(result.data);
      }
    } catch (err) {
      console.error("Error actualizando avatar:", err);
    }
  };

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F0E6' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario después de cargar, no mostrar nada (ya se redirigió)
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F0E6' }}>
      <Header />
      <NavigationBar />

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-2 md:px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al inicio</span>
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Banner y Avatar */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <BannerUpload
            bannerUrl={profile?.banner_url}
            bannerPosition={profile?.banner_position || 0}
            onBannerUpdate={handleBannerUpdate}
            userId={currentUser.id}
          />
          
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 md:-mt-20">
              <AvatarUpload
                avatarUrl={profile?.avatar_url}
                onAvatarUpdate={handleAvatarUpdate}
                userId={currentUser.id}
              />
              
              <div className="flex-1 mt-4 md:mt-0">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {profile?.full_name || formData.full_name || currentUser.email?.split('@')[0] || "Usuario"}
                </h1>
                {profile?.location_text && (
                  <p className="text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location_text}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel de edición */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Información del Perfil</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#001F3F' }}
              >
                <Edit className="w-4 h-4" />
                Editar perfil
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setError("");
                    setSuccess("");
                    // Restaurar datos
                    setFormData({
                      full_name: profile?.full_name || currentUser.user_metadata?.full_name || "",
                      location_text: profile?.location_text || 
                        (location ? `${location.municipio || location.city}, ${location.estado || location.state}` : ""),
                      description: profile?.description || "",
                      pet_description: profile?.pet_description || ""
                    });
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tu nombre completo"
                />
              ) : (
                <p className="text-lg text-gray-800">
                  {profile?.full_name || formData.full_name || "No especificado"}
                </p>
              )}
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Ubicación
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.location_text}
                  onChange={(e) => setFormData({ ...formData, location_text: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ciudad, Estado"
                />
              ) : (
                <p className="text-lg text-gray-800">
                  {profile?.location_text || formData.location_text || "No especificado"}
                </p>
              )}
            </div>

            {/* Descripción breve */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción breve (máximo 100 caracteres)
              </label>
              {editing ? (
                <div>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setFormData({ ...formData, description: e.target.value });
                      }
                    }}
                    rows={3}
                    maxLength={100}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Escribe una breve descripción sobre ti..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/100 caracteres
                  </p>
                </div>
              ) : (
                <p className="text-lg text-gray-800">
                  {profile?.description || formData.description || "Sin descripción"}
                </p>
              )}
            </div>

            {/* Descripción de mascota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Descripción de tu mascota
              </label>
              {editing ? (
                <textarea
                  value={formData.pet_description}
                  onChange={(e) => setFormData({ ...formData, pet_description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cuéntanos sobre tu mascota..."
                />
              ) : (
                <p className="text-lg text-gray-800 whitespace-pre-wrap">
                  {profile?.pet_description || formData.pet_description || "Sin descripción"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Galería de fotos */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <PetPhotoGallery userId={currentUser.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

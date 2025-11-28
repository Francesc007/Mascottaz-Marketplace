"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Footer from "../../components/Footer";
import BannerUpload from "../../components/profile/BannerUpload";
import AvatarUpload from "../../components/profile/AvatarUpload";
import PetPhotoGallery from "../../components/profile/PetPhotoGallery";
import useAuthStore from "../../store/authStore";
import { useAuth } from "../../lib/auth";
import ProfileAPI from "../../lib/profile/api";
import { 
  Save,
  X,
  Users,
  Mail,
  Bell,
  Compass,
  Settings
} from "lucide-react";

export default function PerfilPage() {
  const router = useRouter();
  const { location } = useAuthStore();
  const { getCurrentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    location_text: "",
    description: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

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
            description: profileData?.description || ""
          });
        } else {
          // Si no existe perfil, inicializar con datos del usuario
          setFormData({
            full_name: userData.user_metadata?.full_name || "",
            location_text: currentLocation ? `${currentLocation.municipio || currentLocation.city}, ${currentLocation.estado || currentLocation.state}` : "",
            description: ""
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
        description: formData.description
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
      {/* Header simplificado: Logo y Barra de navegación */}
      <header className="py-3 border-b border-gray-200" style={{ backgroundColor: '#fffaf0' }}>
        <div className="max-w-screen-2xl mx-auto px-2 md:px-4">
          <div className="flex items-center gap-4">
            {/* Logo clickeable para regresar a home */}
            <Link href="/" className="flex-shrink-0 cursor-pointer flex items-center">
              {!imageError ? (
                <Image
                  src="/MASCOTTAZ.png"
                  alt="Mascottaz logo"
                  width={400}
                  height={100}
                  className="h-[67px] w-[267px] md:h-[100px] md:w-[400px] object-contain"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="h-[67px] w-[267px] md:h-[100px] md:w-[400px] flex items-center">
                  <span className="text-2xl md:text-4xl font-bold" style={{ color: 'var(--brand-blue)' }}>
                    MASCOTTAZ
                  </span>
                </div>
              )}
            </Link>

            {/* Barra de navegación con iconos - A la altura del logo, desde el logo hasta el margen */}
            <nav className="flex-1 flex items-center justify-between gap-2 md:gap-4 py-2" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
            {/* Amigos */}
            <div className="relative group flex-1 flex justify-center">
              <button 
                className="flex flex-col items-center gap-1 transition-all duration-300 cursor-not-allowed" 
                style={{ color: 'var(--brand-blue)' }}
                disabled
              >
                <Users className="w-6 h-6 md:w-7 md:h-7 transition-all duration-300" />
                <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-200 px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-lg md:text-xl" style={{ color: 'var(--brand-blue)' }}>Amigos</div>
                    <div className="text-sm md:text-base text-gray-600 mt-1">Próximamente</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Mensajes */}
            <div className="relative group flex-1 flex justify-center">
              <button 
                className="flex flex-col items-center gap-1 transition-all duration-300 cursor-not-allowed" 
                style={{ color: 'var(--brand-blue)' }}
                disabled
              >
                <Mail className="w-6 h-6 md:w-7 md:h-7 transition-all duration-300" />
                <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-200 px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-lg md:text-xl" style={{ color: 'var(--brand-blue)' }}>Mensajes</div>
                    <div className="text-sm md:text-base text-gray-600 mt-1">Próximamente</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Notificaciones */}
            <div className="relative group flex-1 flex justify-center">
              <button 
                className="flex flex-col items-center gap-1 transition-all duration-300 cursor-not-allowed" 
                style={{ color: 'var(--brand-blue)' }}
                disabled
              >
                <Bell className="w-6 h-6 md:w-7 md:h-7 transition-all duration-300" />
                <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-200 px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-lg md:text-xl" style={{ color: 'var(--brand-blue)' }}>Notificaciones</div>
                    <div className="text-sm md:text-base text-gray-600 mt-1">Próximamente</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Conocer */}
            <div className="relative group flex-1 flex justify-center">
              <button 
                className="flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer" 
                style={{ color: 'var(--brand-blue)' }}
                onClick={() => router.push('/conocer')}
              >
                <Compass className="w-6 h-6 md:w-7 md:h-7 transition-all duration-300" />
                <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-200 px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-lg md:text-xl" style={{ color: 'var(--brand-blue)' }}>Conocer</div>
                    <div className="text-sm md:text-base text-gray-600 mt-1">Explorar mascotas</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Configuración */}
            <div className="relative group flex-1 flex justify-center">
              <button 
                className="flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer" 
                style={{ color: 'var(--brand-blue)' }}
                onMouseEnter={() => setShowSettingsMenu(true)}
              >
                <Settings className="w-6 h-6 md:w-7 md:h-7 transition-all duration-300" />
              </button>
              {showSettingsMenu && (
                <div 
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 pt-2 z-50"
                  onMouseEnter={() => setShowSettingsMenu(true)}
                  onMouseLeave={() => setShowSettingsMenu(false)}
                >
                  <div className="bg-white rounded-lg shadow-xl border border-gray-200 min-w-[200px]">
                    <button
                      onClick={() => {
                        setEditing(true);
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <div className="font-medium">Editar perfil</div>
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={async () => {
                        const { logout } = useAuth();
                        await logout();
                        router.push("/");
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <div className="font-medium">Cerrar Sesión</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-2 md:px-4 py-8" onClick={() => setShowSettingsMenu(false)}>
        {/* Modal de edición de perfil */}
        {editing && (
          <>
            {/* Overlay transparente */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => {
                setEditing(false);
                setError("");
                setSuccess("");
                // Restaurar datos
                setFormData({
                  full_name: profile?.full_name || currentUser.user_metadata?.full_name || "",
                  location_text: profile?.location_text || 
                    (location ? `${location.municipio || location.city}, ${location.estado || location.state}` : ""),
                  description: profile?.description || ""
                });
              }}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Perfil</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={formData.location_text}
                        onChange={(e) => setFormData({ ...formData, location_text: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        placeholder="Ciudad, Estado"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mi historia breve (máximo 100 caracteres)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => {
                          if (e.target.value.length <= 100) {
                            setFormData({ ...formData, description: e.target.value });
                          }
                        }}
                        rows={3}
                        maxLength={100}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                        placeholder="Mi historia breve..."
                      />
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {formData.description.length}/100 caracteres
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end mt-6">
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
                          description: profile?.description || ""
                        });
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

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
                <div className="flex gap-6 items-start">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {profile?.full_name || formData.full_name || currentUser.email?.split('@')[0] || "Usuario"}
                    </h1>
                    {profile?.location_text || formData.location_text ? (
                      <p className="text-lg text-gray-600">
                        {profile?.location_text || formData.location_text}
                      </p>
                    ) : null}
                  </div>
                  {profile?.description || formData.description ? (
                    <div className="flex-1">
                      <p className="text-lg text-gray-700">
                        {profile?.description || formData.description}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
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

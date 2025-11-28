"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Users, Mail, Bell, Compass, Settings } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { createClient } from "../../lib/supabase-client.js";

export default function ConocerPage() {
  const router = useRouter();
  const { getCurrentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [petPhotos, setPetPhotos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPhotos = async () => {
      try {
        setLoading(true);
        
        // Verificar autenticación
        const { user: userData, error: userError } = await getCurrentUser();
        
        if (cancelled) return;

        if (!userData || userError) {
          router.push("/");
          return;
        }

        setCurrentUser(userData);

        // Obtener todas las fotos de mascotas de todos los usuarios
        const supabase = createClient();
        
        // Primero obtener las fotos
        const { data: photosData, error: photosError } = await supabase
          .from('pet_photos')
          .select('id, image_url, caption, user_id, created_at')
          .order('created_at', { ascending: false })
          .limit(50);

        if (cancelled) return;

        if (photosError) {
          // Log detallado del error para debugging
          console.warn("Error cargando fotos (continuando sin fotos):", {
            message: photosError.message,
            code: photosError.code,
            details: photosError.details,
            hint: photosError.hint
          });
          // Continuar sin fotos en lugar de romper
          setPetPhotos([]);
          setLoading(false);
          return;
        }

        if (!photosData || photosData.length === 0) {
          setPetPhotos([]);
          setLoading(false);
          return;
        }

        // Obtener los perfiles de los usuarios únicos (si hay fotos)
        const userIds = [...new Set(photosData.map(photo => photo.user_id).filter(Boolean))];
        let profilesMap = {};
        
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url')
            .in('user_id', userIds);

          if (cancelled) return;

          if (!profilesError && profilesData) {
            profilesData.forEach(profile => {
              if (profile && profile.user_id) {
                profilesMap[profile.user_id] = profile;
              }
            });
          }
        }

        if (cancelled) return;

        // Combinar fotos con perfiles
        const photosWithProfiles = photosData.map(photo => ({
          ...photo,
          profiles: photo.user_id ? (profilesMap[photo.user_id] || null) : null
        }));

        setPetPhotos(photosWithProfiles);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error("Error en loadPhotos:", err);
        setPetPhotos([]);
        setLoading(false);
      }
    };

    loadPhotos();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fffaf0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
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
                        router.push('/perfil');
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <div className="font-medium">Mi Perfil</div>
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={async () => {
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

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-2 md:px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Conocer Mascotas</h1>

        {petPhotos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aún no hay fotos de mascotas para explorar</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {petPhotos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/perfil/${photo.user_id}`)}
              >
                <div className="aspect-square relative">
                  <img
                    src={photo.image_url}
                    alt={photo.caption || "Foto de mascota"}
                    className="w-full h-full object-cover"
                  />
                </div>
                {photo.caption && (
                  <div className="p-3">
                    <p className="text-sm text-gray-700 line-clamp-2">{photo.caption}</p>
                  </div>
                )}
                {photo.profiles && (
                  <div className="px-3 pb-3 flex items-center gap-2">
                    {photo.profiles.avatar_url ? (
                      <img
                        src={photo.profiles.avatar_url}
                        alt={photo.profiles.full_name || "Usuario"}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                    )}
                    <p className="text-xs text-gray-600">
                      {photo.profiles.full_name || "Usuario"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


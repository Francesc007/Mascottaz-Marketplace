"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createClient } from "../lib/supabaseClient";
import { Heart, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CommunityGallery() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [likedPhotos, setLikedPhotos] = useState(new Set());
  const sectionRef = useRef(null);
  const [showUploadButton, setShowUploadButton] = useState(false);

  const loadCommunityPhotos = useCallback(async () => {
    try {
      if (!supabase || !supabase.from) {
        console.warn("Supabase client not available");
        setPhotos([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_photos")
        .select("*")
        .eq("publica", true)
        .order("fecha", { ascending: false })
        .limit(20);

      if (error) {
        // Solo mostrar error si es relevante (no es un error de tabla no encontrada)
        const errorCode = error.code || error.error_code;
        const errorMessage = error.message || error.error_description || String(error);
        
        // No mostrar errores de tablas no encontradas o permisos
        if (errorCode !== 'PGRST116' && 
            errorCode !== '42P01' && 
            !errorMessage.includes('relation') && 
            !errorMessage.includes('does not exist') &&
            !errorMessage.includes('permission denied')) {
          console.error("Error de Supabase al cargar fotos:", errorMessage);
        }
        setPhotos([]);
        setLoading(false);
        return;
      } else {
        const photosData = data || [];
        
        // Cargar likes para cada foto de forma simple
        const photosWithLikes = await Promise.all(
          photosData.map(async (photo) => {
            try {
              const { count, error: likeError } = await supabase
                .from("photo_likes")
                .select("*", { count: 'exact', head: true })
                .eq("id_foto", photo.id);
              
              if (likeError) {
                return { ...photo, likes: 0 };
              }
              
              return {
                ...photo,
                likes: count || 0
              };
            } catch (err) {
              return {
                ...photo,
                likes: 0
              };
            }
          })
        );
        
        setPhotos(photosWithLikes);
        
        // Cargar likes del usuario actual
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: userLikes } = await supabase
              .from("photo_likes")
              .select("id_foto")
              .eq("id_usuario", user.id);
            
            if (userLikes) {
              setLikedPhotos(new Set(userLikes.map(like => like.id_foto)));
            }
          }
        } catch (authErr) {
          // Usuario no autenticado, continuar sin likes
        }
      }
    } catch (err) {
      // Solo mostrar errores relevantes
      if (err?.message && !err.message.includes('relation') && !err.message.includes('does not exist')) {
        console.error("Error cargando fotos:", err.message || err);
      }
      setPhotos([]);
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadCommunityPhotos();
  }, [loadCommunityPhotos]);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
        setShowUploadButton(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = async (photoId) => {
    if (likedPhotos.has(photoId)) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/profile");
        return;
      }

      const { error } = await supabase
        .from("photo_likes")
        .insert({
          id_foto: photoId,
          id_usuario: user.id
        });

      if (!error) {
        setLikedPhotos(new Set([...likedPhotos, photoId]));
        setPhotos(photos.map(photo => 
          photo.id === photoId 
            ? { ...photo, likes: (photo.likes || 0) + 1 }
            : photo
        ));
      }
    } catch (err) {
      console.error("Error dando like:", err);
    }
  };

  const handleUploadClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/profile");
    } else {
      router.push("/profile");
    }
  };

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-2 md:px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando comunidad...</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="max-w-screen-2xl mx-auto px-2 md:px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Aún no hay fotos en la comunidad</p>
        </div>
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="py-8 relative">
      <div className="max-w-screen-2xl mx-auto px-2 md:px-4">
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--brand-blue)' }}>
          Comunidad Petz Prime
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-square relative">
                <Image
                  src={photo.photo_url || photo.url}
                  alt={photo.descripcion || "Foto de mascota"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full ${
                      likedPhotos.has(photo.id) 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPhotos.has(photo.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
              {(photo.likes > 0 || likedPhotos.has(photo.id)) && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white bg-opacity-80 px-2 py-1 rounded-full">
                  <Heart className="w-4 h-4" style={{ color: 'var(--interaction-blue)' }} fill="var(--interaction-blue)" />
                  <span className="text-sm font-medium text-gray-700">
                    {photo.likes + (likedPhotos.has(photo.id) ? 1 : 0)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botón flotante "Subir foto" - solo visible en esta sección */}
        {showUploadButton && (
          <button
            onClick={handleUploadClick}
            className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 font-semibold"
            style={{ 
              backgroundColor: 'var(--interaction-blue)',
              color: '#1e3a8a'
            }}
          >
            <Upload className="w-5 h-5" />
            <span>Subir foto</span>
          </button>
        )}

        {/* Modal de foto */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div 
              className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={selectedPhoto.photo_url || selectedPhoto.url}
                  alt={selectedPhoto.descripcion || "Foto de mascota"}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6">
                {selectedPhoto.descripcion && (
                  <p className="text-gray-700 mb-4">{selectedPhoto.descripcion}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(selectedPhoto.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        likedPhotos.has(selectedPhoto.id)
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 ${likedPhotos.has(selectedPhoto.id) ? 'fill-current' : ''}`}
                        style={{ color: likedPhotos.has(selectedPhoto.id) ? 'var(--interaction-blue)' : 'inherit' }}
                      />
                      <span className="font-medium">
                        {selectedPhoto.likes + (likedPhotos.has(selectedPhoto.id) ? 1 : 0)}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


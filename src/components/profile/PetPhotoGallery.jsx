"use client";

import { useState, useEffect } from "react";
import { Heart, Trash2, Upload, X } from "lucide-react";
import ProfileStorageService from "../../lib/profile/storage";
import ProfileAPI from "../../lib/profile/api";
import useAuthStore from "../../store/authStore";

export default function PetPhotoGallery({ userId }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    loadPhotos();
  }, [userId]);

  const loadPhotos = async () => {
    setLoading(true);
    const result = await ProfileAPI.getPetPhotos(userId);
    if (result.success) {
      // Cargar likes para cada foto
      const photosWithLikes = await Promise.all(
        result.data.map(async (photo) => {
          const likesResult = await ProfileAPI.getPhotoLikes(photo.id);
          const userLiked = user ? likesResult.data?.some(like => like.user_id === user.id) : false;
          return {
            ...photo,
            likesCount: likesResult.count || 0,
            userLiked
          };
        })
      );
      setPhotos(photosWithLikes);
    }
    setLoading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !caption.trim()) {
      alert('Por favor selecciona una imagen y agrega una descripción');
      return;
    }

    if (caption.split(' ').length > 20) {
      alert('La descripción no debe exceder 20 palabras');
      return;
    }

    setUploading(true);
    
    // Subir imagen
    const uploadResult = await ProfileStorageService.uploadPetPhoto(selectedFile, userId);
    
    if (!uploadResult.success) {
      alert('Error al subir la imagen: ' + uploadResult.error);
      setUploading(false);
      return;
    }

    // Guardar en DB
    const dbResult = await ProfileAPI.addPetPhoto(userId, {
      image_url: uploadResult.url,
      image_path: uploadResult.path,
      bucket_name: uploadResult.bucket,
      caption: caption.trim()
    });

    if (dbResult.success) {
      await loadPhotos();
      setShowUploadModal(false);
      setSelectedFile(null);
      setCaption("");
      setPreview(null);
    } else {
      alert('Error al guardar la foto: ' + dbResult.error);
    }

    setUploading(false);
  };

  const handleDelete = async (photoId) => {
    if (!confirm('¿Estás seguro de eliminar esta foto?')) return;

    // Eliminar de DB (esto retorna el path y bucket)
    const result = await ProfileAPI.deletePetPhoto(photoId);
    
    if (result.success) {
      // Eliminar del storage
      if (result.imagePath) {
        await ProfileStorageService.deleteImage(result.imagePath, result.bucketName);
      }
      await loadPhotos();
    } else {
      alert('Error al eliminar la foto: ' + result.error);
    }
  };

  const handleLike = async (photoId) => {
    if (!user) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    const result = await ProfileAPI.toggleLike(photoId, user.id);
    if (result.success) {
      await loadPhotos();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Galería de Mascotas</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Subir Foto
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Aún no has subido fotos de tu mascota</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square group">
              <img
                src={photo.image_url}
                alt={photo.caption || "Foto de mascota"}
                className="w-full h-full object-cover rounded-lg"
              />
              
              {/* Overlay con acciones */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleLike(photo.id)}
                  className={`p-2 rounded-full ${
                    photo.userLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-red-100'
                  } transition-colors`}
                >
                  <Heart className={`w-5 h-5 ${photo.userLiked ? 'fill-current' : ''}`} />
                </button>
                <span className="text-white font-semibold">{photo.likesCount || 0}</span>
                
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="p-2 rounded-full bg-white text-gray-700 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Caption */}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 rounded-b-lg">
                  <p className="text-white text-sm line-clamp-2">{photo.caption}</p>
                </div>
              )}

              {/* Like count siempre visible */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1 flex items-center gap-1">
                <Heart className={`w-4 h-4 ${photo.userLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                <span className="text-white text-xs font-semibold">{photo.likesCount || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de subir foto */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Subir Foto de Mascota</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setCaption("");
                  setPreview(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {preview && (
                  <div className="mt-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (máximo 20 palabras)
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe esta foto..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {caption.split(' ').filter(w => w).length}/20 palabras
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setCaption("");
                    setPreview(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile || !caption.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Subiendo..." : "Subir"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


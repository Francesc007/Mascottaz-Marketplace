"use client";

import { createClient } from './supabaseClient';

class StorageService {
  async uploadImage(file, userId, folder = 'products') {
    try {
      const supabase = createClient();
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'El archivo debe ser una imagen' };
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: 'La imagen no debe exceder 5MB' };
      }

      // Generar nombre único
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Subir archivo
      const { data, error } = await supabase.storage
        .from('petplace-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading file:', error);
        return { success: false, error: error.message };
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('petplace-images')
        .getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return { success: false, error: error.message || 'Error al subir la imagen' };
    }
  }

  async deleteImage(path) {
    try {
      const supabase = createClient();
      const { error } = await supabase.storage
        .from('petplace-images')
        .remove([path]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getPublicUrl(path) {
    const supabase = createClient();
    const { data } = supabase.storage
      .from('petplace-images')
      .getPublicUrl(path);
    return data.publicUrl;
  }
}

export default new StorageService();
export { StorageService };






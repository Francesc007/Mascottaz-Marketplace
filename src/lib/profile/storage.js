"use client";

import { createClient } from '../supabaseClient';

class ProfileStorageService {
  /**
   * Subir banner del perfil
   */
  async uploadBanner(file, userId) {
    try {
      const supabase = createClient();
      
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'El archivo debe ser una imagen' };
      }

      if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: 'La imagen no debe exceder 10MB' };
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/banner_${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      let uploadResult = await supabase.storage
        .from('petplace-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadResult.error) {
        uploadResult = await supabase.storage
          .from('mascotas_gallery')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
      }

      const { data, error } = uploadResult;

      if (error) {
        return { success: false, error: error.message };
      }

      const bucketName = 'petplace-images';
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrl,
        path: filePath
      };
    } catch (error) {
      return { success: false, error: error.message || 'Error al subir el banner' };
    }
  }

  /**
   * Subir foto de perfil
   */
  async uploadAvatar(file, userId) {
    try {
      const supabase = createClient();
      
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'El archivo debe ser una imagen' };
      }

      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: 'La imagen no debe exceder 5MB' };
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      let uploadResult = await supabase.storage
        .from('petplace-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadResult.error) {
        uploadResult = await supabase.storage
          .from('mascotas_gallery')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
      }

      const { data, error } = uploadResult;

      if (error) {
        return { success: false, error: error.message };
      }

      const bucketName = 'petplace-images';
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrl,
        path: filePath
      };
    } catch (error) {
      return { success: false, error: error.message || 'Error al subir la foto' };
    }
  }

  /**
   * Subir foto de mascota
   */
  async uploadPetPhoto(file, userId) {
    try {
      const supabase = createClient();
      
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'El archivo debe ser una imagen' };
      }

      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: 'La imagen no debe exceder 5MB' };
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/pet_${Date.now()}.${fileExt}`;

      // Intentar subir a mascotas_gallery primero, si no existe usar petplace-images
      let bucketName = 'mascotas_gallery';
      let filePath = fileName;
      let uploadResult = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadResult.error) {
        bucketName = 'petplace-images';
        filePath = `mascotas_gallery/${fileName}`;
        uploadResult = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
      }

      const { data, error } = uploadResult;

      if (error) {
        return { success: false, error: error.message };
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrl,
        path: filePath,
        bucket: bucketName
      };
    } catch (error) {
      return { success: false, error: error.message || 'Error al subir la foto' };
    }
  }

  /**
   * Eliminar imagen del storage
   */
  async deleteImage(path, bucketName = 'petplace-images') {
    try {
      const supabase = createClient();
      
      // Intentar eliminar del bucket especificado
      let error = null;
      let result = await supabase.storage
        .from(bucketName)
        .remove([path]);

      if (result.error) {
        // Si falla, intentar con el otro bucket
        const altBucket = bucketName === 'petplace-images' ? 'mascotas_gallery' : 'petplace-images';
        result = await supabase.storage
          .from(altBucket)
          .remove([path]);
        error = result.error;
      } else {
        error = result.error;
      }

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new ProfileStorageService();


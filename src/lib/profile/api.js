"use client";

import { createClient } from '../supabaseClient';

class ProfileAPI {
  /**
   * Obtener perfil del usuario
   */
  async getProfile(userId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Crear o actualizar perfil
   */
  async upsertProfile(userId, profileData) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener fotos de mascotas del usuario
   */
  async getPetPhotos(userId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pet_photos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Agregar foto de mascota
   */
  async addPetPhoto(userId, photoData) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pet_photos')
        .insert({
          user_id: userId,
          image_url: photoData.image_url,
          image_path: photoData.image_path,
          bucket_name: photoData.bucket_name,
          caption: photoData.caption,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar foto de mascota
   */
  async deletePetPhoto(photoId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pet_photos')
        .select('image_url, image_path, bucket_name')
        .eq('id', photoId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Usar path guardado o extraer del URL
      let imagePath = data.image_path;
      const bucketName = data.bucket_name || 'petplace-images';
      
      // Si no hay path directo, intentar extraer del URL
      if (!imagePath && data.image_url) {
        const urlParts = data.image_url.split('/');
        const storageIndex = urlParts.findIndex(part => part.includes('storage') || part.includes('supabase'));
        if (storageIndex >= 0 && storageIndex < urlParts.length - 1) {
          imagePath = urlParts.slice(storageIndex + 2).join('/');
        } else {
          // Fallback: usar el último segmento del URL
          imagePath = urlParts[urlParts.length - 1];
        }
      }
      
      const { error: deleteError } = await supabase
        .from('pet_photos')
        .delete()
        .eq('id', photoId);

      if (deleteError) {
        return { success: false, error: deleteError.message };
      }

      return { success: true, imagePath, bucketName };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Dar like a una foto
   */
  async toggleLike(photoId, userId) {
    try {
      const supabase = createClient();
      
      // Verificar si ya tiene like
      const { data: existingLike } = await supabase
        .from('pet_photo_likes')
        .select('id')
        .eq('photo_id', photoId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Eliminar like
        const { error } = await supabase
          .from('pet_photo_likes')
          .delete()
          .eq('photo_id', photoId)
          .eq('user_id', userId);

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, liked: false };
      } else {
        // Agregar like
        const { error } = await supabase
          .from('pet_photo_likes')
          .insert({
            photo_id: photoId,
            user_id: userId,
            created_at: new Date().toISOString()
          });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, liked: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener likes de una foto
   */
  async getPhotoLikes(photoId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pet_photo_likes')
        .select('id, user_id')
        .eq('photo_id', photoId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [], count: data?.length || 0 };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new ProfileAPI();


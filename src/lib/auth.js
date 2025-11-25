"use client";

import { createClient } from "./supabase-client";
import useAuthStore from "../store/authStore";

// Hook de autenticación
export function useAuth() {
  const login = async (email, password) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Verificar si el error es por email no confirmado
        const needsEmailConfirmation = 
          error.message?.toLowerCase().includes('email not confirmed') ||
          error.message?.toLowerCase().includes('email_not_confirmed');

        return {
          success: false,
          error: {
            message: error.message,
            needsEmailConfirmation,
          },
        };
      }

      if (data?.user) {
        // Actualizar el store de autenticación
        const userType = data.user.user_metadata?.user_type || 'buyer';
        useAuthStore.getState().login(data.user, userType);

        return {
          success: true,
          user: data.user,
        };
      }

      return {
        success: false,
        error: { message: "Error desconocido al iniciar sesión" },
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error.message || "Error al iniciar sesión" },
      };
    }
  };

  const register = async (email, password, userData = {}) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || userData.full_name || "",
            phone: userData.phone || "",
            user_type: userData.userType || userData.user_type || "buyer",
            ...userData,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: { message: error.message },
        };
      }

      if (data?.user) {
        // Si requiere confirmación de email, Supabase no retorna session
        if (!data.session) {
          return {
            success: true,
            user: {
              ...data.user,
              needsEmailConfirmation: true,
              message: "Registro exitoso. Por favor revisa tu email y confirma tu cuenta antes de iniciar sesión.",
            },
          };
        }

        // Si no requiere confirmación, actualizar el store
        const userType = data.user.user_metadata?.user_type || 'buyer';
        useAuthStore.getState().login(data.user, userType);

        return {
          success: true,
          user: data.user,
        };
      }

      return {
        success: false,
        error: { message: "Error desconocido al registrar" },
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error.message || "Error al registrar" },
      };
    }
  };

  const getCurrentUser = async () => {
    try {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        return { user: null, error };
      }

      if (user) {
        // Actualizar el store si hay un usuario
        const userType = user.user_metadata?.user_type || 'buyer';
        useAuthStore.getState().login(user, userType);
      }

      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      useAuthStore.getState().logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aún así, limpiar el store local
      useAuthStore.getState().logout();
    }
  };

  return {
    login,
    register,
    getCurrentUser,
    logout,
  };
}

// Servicio de autenticación para operaciones adicionales
export const AuthService = {
  resendConfirmationEmail: async (email) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        return {
          success: false,
          error: { message: error.message },
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error.message || "Error al reenviar el email" },
      };
    }
  },

  resetPasswordForEmail: async (email) => {
    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password`,
      });

      if (error) {
        return {
          error: { message: error.message },
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        error: { message: error.message || "Error al enviar el email de recuperación" },
      };
    }
  },
};

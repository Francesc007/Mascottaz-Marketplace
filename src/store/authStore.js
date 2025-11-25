import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      userType: null,
      isAuthenticated: false,
      location: null, // { postalCode, city, state }
      
      login: (user, userType = 'buyer') => {
        set({
          user,
          userType,
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        set({
          user: null,
          userType: null,
          isAuthenticated: false,
          location: null, // Borrar ubicación al cerrar sesión
        });
      },
      
      setUser: (user) => {
        set({ user });
      },
      
      setUserType: (userType) => {
        set({ userType });
      },
      
      setLocation: (location) => {
        set({ location });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;






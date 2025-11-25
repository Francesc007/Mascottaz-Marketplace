import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  userType: null,
  isAuthenticated: false,
  
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
    });
  },
  
  setUser: (user) => {
    set({ user });
  },
  
  setUserType: (userType) => {
    set({ userType });
  },
}));

export default useAuthStore;






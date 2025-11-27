"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/authStore";
import { useAuth } from "../lib/auth";
import BuyerRegistrationForm from "./BuyerRegistrationForm";
import SellerRegistrationForm from "./SellerRegistrationForm";

export default function AuthButton({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [showSellerForm, setShowSellerForm] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { logout: handleLogout } = useAuth();
  const router = useRouter();

  const toggleMenu = () => {
    if (!isAuthenticated && onLoginClick) {
      // Si no está autenticado, abrir el modal del CP directamente
      onLoginClick();
    } else {
      // Si está autenticado, mostrar el menú de perfil
      setIsOpen(!isOpen);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleOptionClick = (option) => {
    console.log(`Seleccionado: ${option}`);
    closeMenu();
    
    if (option === 'Comprador') {
      setShowBuyerForm(true);
    } else if (option === 'Vendedor') {
      setShowSellerForm(true);
    }
  };

  const handleLogoutClick = async () => {
    await handleLogout();
    closeMenu();
    router.refresh();
  };

  const handleProfileClick = () => {
    closeMenu();
    router.push('/perfil');
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-base md:text-lg"
        style={{ 
          backgroundColor: 'var(--brand-blue)',
          color: '#fff'
        }}
      >
        <User className="w-5 h-5 md:w-6 md:h-6" />
        <span>
          {isAuthenticated 
            ? (user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Mi Perfil")
            : "Iniciar Sesión"}
        </span>
      </button>
        
      {isOpen && (
        <>
          {/* Overlay para cerrar el menú */}
          <div
            className="fixed inset-0 z-40"
            onClick={closeMenu}
          />
          
          {/* Menú desplegable */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="py-2">
              {isAuthenticated ? (
                <>
                  {/* Menú para usuario autenticado */}
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    <div className="font-medium">Mi Perfil</div>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  >
                    <div className="font-medium">Cerrar Sesión</div>
                  </button>
                </>
              ) : (
                <>
                  {/* Menú para usuario no autenticado */}
                  <button
                    onClick={() => handleOptionClick('Comprador')}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center"
                  >
                    <span className="mr-3">🛒</span>
                    <div>
                      <div className="font-medium">Soy Comprador</div>
                      <div className="text-sm text-gray-500">(Quiero comprar)</div>
                    </div>
                  </button>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={() => handleOptionClick('Vendedor')}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center"
                  >
                    <span className="mr-3">🏪</span>
                    <div>
                      <div className="font-medium">Soy Vendedor</div>
                      <div className="text-sm text-gray-500">(Quiero vender)</div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
      
      {/* Formulario de registro de comprador */}
      <BuyerRegistrationForm 
        isOpen={showBuyerForm} 
        onClose={() => setShowBuyerForm(false)} 
      />
      
      {/* Formulario de registro de vendedor */}
      <SellerRegistrationForm 
        isOpen={showSellerForm} 
        onClose={() => setShowSellerForm(false)} 
      />
    </div>
  );
}

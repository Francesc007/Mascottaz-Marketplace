"use client";

import { useState } from "react";
import BuyerRegistrationForm from "./BuyerRegistrationForm";
import SellerRegistrationForm from "./SellerRegistrationForm";

export default function AuthButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [showSellerForm, setShowSellerForm] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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

  return (
    <div className="fixed top-4 right-20 z-50">
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 font-medium"
        >
          Regístrate / Inicia Sesión
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
              </div>
            </div>
          </>
        )}
      </div>
      
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

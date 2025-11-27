"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import SearchBar from "./SearchBar";
import PostalCodeInput from "./PostalCodeInput";
import AuthButton from "./AuthButton";
import { useRouter } from "next/navigation";
import useCartStore from "../store/cartStore";

export default function Header() {
  const [imageError, setImageError] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [openCPModal, setOpenCPModal] = useState(false);
  const router = useRouter();
  const { items: cartItems, removeItem, incrementQuantity, decrementQuantity, getTotal, getItemCount } = useCartStore();
  const total = getTotal();

  // Evitar error de hidratación: solo calcular el contador después de montar en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItemCount = isMounted ? getItemCount() : 0;

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    closeCart();
    router.push("/carrito");
  };

  return (
    <>
      <header className="py-2 md:py-3 border-b border-gray-200" style={{ backgroundColor: '#fffaf0' }}>
        <div className="max-w-screen-2xl mx-auto px-2 md:px-4">
          {/* Layout estilo Amazon/Mercado Libre: Todo en una fila */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Logo a la izquierda - 400x100 */}
            <div className="flex-shrink-0">
              <Link href="/" className="cursor-pointer flex items-center">
                {!imageError ? (
                  <Image
                    src="/MASCOTTAZ.png"
                    alt="Mascottaz logo"
                    width={400}
                    height={100}
                    className="h-[67px] w-[267px] md:h-[100px] md:w-[400px] object-contain"
                    priority
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="h-[67px] w-[267px] md:h-[100px] md:w-[400px] flex items-center">
                    <span className="text-2xl md:text-4xl font-bold" style={{ color: 'var(--brand-blue)' }}>
                      MASCOTTAZ
                    </span>
                  </div>
                )}
              </Link>
            </div>

            {/* Código Postal - Solo en desktop */}
            <div className="hidden md:block flex-shrink-0">
              <PostalCodeInput openModal={openCPModal} onModalClose={() => setOpenCPModal(false)} />
            </div>

            {/* Barra de búsqueda - Ocupa el espacio central */}
            <div className="flex-1 min-w-0 hidden md:block">
              <SearchBar />
            </div>

            {/* Botones de acción a la derecha */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-auto">
              {/* Botón de inicio de sesión - Solo desktop */}
              <div className="hidden md:block">
                <AuthButton onLoginClick={() => setOpenCPModal(true)} />
              </div>

              {/* Carrito - Más grande con círculo azul */}
              <button
                onClick={toggleCart}
                className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: 'var(--brand-blue)' }}
              >
                <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-white" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs md:text-sm rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--interaction-blue)', color: 'var(--brand-blue)' }}>
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Botón de inicio de sesión - Solo móvil */}
              <div className="md:hidden">
                <AuthButton onLoginClick={() => setOpenCPModal(true)} />
              </div>
            </div>
          </div>

          {/* Segunda fila móvil: Código postal y búsqueda */}
          <div className="flex md:hidden items-center gap-2 mt-2">
            <PostalCodeInput openModal={openCPModal} onModalClose={() => setOpenCPModal(false)} />
            <div className="flex-1">
              <SearchBar />
            </div>
          </div>
        </div>
      </header>

      {/* Overlay transparente para cerrar el carrito al hacer click fuera */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeCart}
        />
      )}

      {/* Panel lateral deslizante del carrito */}
      <div
        className={`fixed top-0 right-0 h-full w-96 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: '#fffaf0' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header del carrito */}
          <div className="p-6 border-b border-gray-200" style={{ backgroundColor: 'var(--interaction-blue)' }}>
            {/* Logo simbólico con sombra suave */}
            <div className="flex justify-center mb-4">
              <Link href="/" onClick={closeCart} className="cursor-pointer flex items-center">
                {!imageError ? (
                  <Image
                    src="/MASCOTTAZ.png"
                    alt="Mascottaz logo"
                    width={250}
                    height={63}
                    className="h-14 w-40 md:h-16 md:w-48 object-contain"
                    style={{ 
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
                      opacity: 0.9
                    }}
                    priority
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="h-14 w-40 md:h-16 md:w-48 flex items-center justify-center">
                    <span 
                      className="text-xl md:text-2xl font-bold" 
                      style={{ 
                        color: 'var(--brand-blue)',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
                        opacity: 0.9
                      }}
                    >
                      MASCOTTAZ
                    </span>
                  </div>
                )}
              </Link>
            </div>
            
            {/* Título y botón de cerrar */}
            <div className="flex items-center justify-between relative">
              <h2 className="text-xl font-bold text-gray-800 flex-1 text-center">Mi Carrito</h2>
              <button
                onClick={closeCart}
                className="text-gray-500 hover:text-gray-700 text-2xl absolute right-0"
              >
                ×
              </button>
            </div>
          </div>

          {/* Contenido del carrito */}
          <div className="flex-1 p-6 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-600 text-lg">
                  Tu carrito está vacío. ¡Añade felicidad a la vida de tu mascota!
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#dbeafe' }}>
                    <p className="text-blue-700 font-semibold text-base text-center">
                      Productos añadidos
                    </p>
                  </div>
                  <div className="space-y-3">
                    {cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">{item.name}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-1 mb-2">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="text-blue-600 font-bold text-lg">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                            
                            {/* Controles de cantidad +/- */}
                            <div className="flex items-center gap-2 border border-gray-300 rounded-md">
                              <button
                                onClick={() => decrementQuantity(index)}
                                className="px-2 py-1 text-gray-700 hover:bg-gray-100 transition-colors rounded-l-md"
                                title="Disminuir cantidad"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="px-3 py-1 text-sm font-semibold text-gray-800 min-w-[2rem] text-center">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() => incrementQuantity(index)}
                                className="px-2 py-1 text-gray-700 hover:bg-gray-100 transition-colors rounded-r-md"
                                title="Aumentar cantidad"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">${item.price?.toFixed(2)} c/u</p>
                        </div>
                        <button
                          onClick={() => {
                            removeItem(index);
                          }}
                          className="text-gray-700 hover:text-gray-900 p-2 flex-shrink-0 transition-colors"
                          title="Eliminar producto"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer del carrito */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-xl font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Continuar con la Compra
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

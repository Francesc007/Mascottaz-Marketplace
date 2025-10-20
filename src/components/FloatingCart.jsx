"use client";

import { useState, useEffect } from "react";

export default function FloatingCart({ items, removeFromCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [previousItemCount, setPreviousItemCount] = useState(0);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  // Abrir automáticamente el carrito cuando se añade un producto
  useEffect(() => {
    if (items.length > previousItemCount && previousItemCount > 0) {
      setIsOpen(true);
    }
    setPreviousItemCount(items.length);
  }, [items.length, previousItemCount]);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Ícono del carrito flotante */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleCart}
          className="relative bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
            />
          </svg>
          
          {/* Contador de productos */}
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {items.length}
            </span>
          )}
        </button>
      </div>

      {/* Overlay para cerrar el carrito */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeCart}
        />
      )}

      {/* Panel lateral deslizante */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header del carrito */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">🛒 Carrito de Compras</h2>
            <button
              onClick={closeCart}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Contenido del carrito */}
          <div className="flex-1 p-6 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-600 text-lg">
                  Tu carrito está vacío. ¡Añade felicidad a la vida de tu mascota!
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="text-green-600 font-semibold text-lg mb-4">
                    ✅ Productos añadidos:
                  </p>
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="text-blue-600 font-bold">${item.price}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700 ml-2 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-xl font-bold text-blue-600">${total}</span>
              </div>
              <button
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

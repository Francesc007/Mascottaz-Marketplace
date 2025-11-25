"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NavigationBar from "../../components/NavigationBar";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  // Cargar items del localStorage o estado global
  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  const removeFromCart = (index) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newItems);
    localStorage.setItem("cartItems", JSON.stringify(newItems));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header cartItems={cartItems} />

      <main className="flex-1">
        <NavigationBar />
        
        <div className="max-w-screen-2xl mx-auto px-8 py-8">
          <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--brand-blue)' }}>
            Carrito de Compras
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-600 text-lg mb-4">
                Tu carrito está vacío
              </p>
              <Link 
                href="/"
                className="inline-block px-6 py-3 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: 'var(--brand-blue)',
                  color: '#fff'
                }}
              >
                Continuar Comprando
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}
                          <p className="text-blue-600 font-bold mt-1">${item.price}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:text-red-700 ml-4 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h2 className="text-xl font-bold mb-4">Resumen</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío:</span>
                      <span>Calculado al finalizar</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    className="w-full py-3 rounded-lg font-medium transition-colors"
                    style={{ 
                      backgroundColor: 'var(--brand-blue)',
                      color: '#fff'
                    }}
                  >
                    Proceder al Pago
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


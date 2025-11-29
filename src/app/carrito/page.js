"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NavigationBar from "../../components/NavigationBar";
import Link from "next/link";
import useCartStore from "../../store/cartStore";
import { createClient } from "../../lib/supabaseClient";
import SellerBadge from "../../components/SellerBadge";
import { MessageSquare, Shield, CheckCircle2 } from "lucide-react";

export default function CartPage() {
  const { items: cartItems, removeItem, getTotal } = useCartStore();
  const supabase = useMemo(() => createClient(), []);
  const [sellersInfo, setSellersInfo] = useState({});
  const total = getTotal();

  useEffect(() => {
    if (cartItems.length > 0) {
      loadSellersInfo();
    }
  }, [cartItems, supabase]);

  const loadSellersInfo = async () => {
    try {
      const sellerIds = [...new Set(cartItems.map(item => item.id_vendedor || item.seller_id).filter(Boolean))];
      
      if (sellerIds.length === 0) return;

      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, seller_verified")
        .in("user_id", sellerIds);

      const sellersMap = {};
      profilesData?.forEach(p => {
        sellersMap[p.user_id] = { verified: p.seller_verified || false };
      });

      setSellersInfo(sellersMap);
    } catch (err) {
      console.error("Error cargando info de vendedores:", err);
    }
  };

  const hasVerifiedSeller = Object.values(sellersInfo).some(s => s.verified);
  const firstItem = cartItems.find(item => item.id_vendedor || item.seller_id);
  const firstSellerId = firstItem?.id_vendedor || firstItem?.seller_id;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />

      <main className="flex-1">
        <NavigationBar />
        
        <div className="max-w-screen-2xl mx-auto px-2 md:px-4 py-8">
          <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--brand-blue)' }}>
            Carrito
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow relative"
                    >
                      {item.image && (
                        <div className="w-full h-40 mb-3 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="mb-2">
                        <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-blue-600 font-bold text-lg">
                            ${(item.price * (item.quantity || 1)).toFixed(2)}
                          </p>
                          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            Cantidad: {item.quantity || 1}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">${item.price?.toFixed(2)} c/u</p>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
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

              <div className="lg:col-span-1">
                <div className="space-y-4 sticky top-4">
                  {/* Banner de Protección */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-4 text-white">
                    <div className="flex items-start gap-3 mb-3">
                      <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        {hasVerifiedSeller && (
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-semibold">Vendedor Verificado</span>
                          </div>
                        )}
                        <p className="text-sm mb-3">
                          Si el vendedor no responde en 48h, Mascottaz interviene
                        </p>
                        {firstSellerId && (
                          <Link
                            href={`/messages?sellerId=${firstSellerId}&productId=${cartItems[0]?.id}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Contactar al vendedor
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resumen */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
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
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


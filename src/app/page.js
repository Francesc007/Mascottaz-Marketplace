"use client";

import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";
import DailyDeals from "../components/DailyDeals";
import CommunityGallery from "../components/CommunityGallery";
import useCartStore from "../store/cartStore";

export default function Home() {
  const { addItem } = useCartStore();

  const addToCart = (product) => {
    addItem(product);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />

      <main className="flex-1">
        <NavigationBar />
        
        {/* Banner de Protección */}
        <div className="max-w-screen-2xl mx-auto px-2 md:px-4 py-4">
          <Link
            href="/how-we-protect"
            className="block bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 md:p-6 text-white"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl mb-1">Compras Seguras — Vendedores Verificados</h3>
                  <p className="text-blue-100 text-sm md:text-base">Conoce cómo protegemos tus compras y garantizamos tu seguridad</p>
                </div>
              </div>
              <div className="hidden md:block">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
        
        <DailyDeals addToCart={addToCart} />
        
        <CommunityGallery />
      </main>

      <Footer />
    </div>
  );
}

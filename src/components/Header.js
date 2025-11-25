"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User } from "lucide-react";
import SearchBar from "./SearchBar";
import PostalCodeInput from "./PostalCodeInput";
import AuthButton from "./AuthButton";
import { useRouter } from "next/navigation";

export default function Header({ cartItems = [] }) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const cartItemCount = cartItems?.length || 0;

  return (
    <header className="bg-transparent py-4 border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        {/* Primera fila: Logo y acciones principales */}
        <div className="flex items-center justify-between gap-2 md:gap-4 mb-3 md:mb-0">
          {/* Logo a la izquierda */}
          <div className="flex-shrink-0">
            <Link href="/" className="cursor-pointer">
              {!imageError ? (
                <Image
                  src="/MASCOTTAZ.png"
                  alt="Mascottaz logo"
                  width={200}
                  height={67}
                  className="h-[50px] w-[150px] md:h-[67px] md:w-[200px] object-contain"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="h-[50px] w-[150px] md:h-[67px] md:w-[200px] flex items-center">
                  <span className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-blue)' }}>
                    MASCOTTAZ
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Botones de acción (móvil) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => router.push("/carrito")}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
            <AuthButton />
          </div>

          {/* Botones de acción (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Botón de inicio de sesión */}
            <div className="flex-shrink-0">
              <AuthButton />
            </div>

            {/* Carrito */}
            <div className="flex-shrink-0">
              <button
                onClick={() => router.push("/carrito")}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Segunda fila: Código postal y búsqueda (desktop) */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Código Postal */}
          <div className="flex-shrink-0">
            <PostalCodeInput />
          </div>

          {/* Barra de búsqueda (centro) */}
          <div className="flex-1 min-w-0 max-w-2xl mx-4">
            <SearchBar />
          </div>
        </div>

        {/* Segunda fila: Código postal y búsqueda (móvil) */}
        <div className="flex md:hidden items-center gap-2">
          <PostalCodeInput />
          <div className="flex-1">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}

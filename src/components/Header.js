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
    <header className="py-2 md:py-3 border-b border-gray-200" style={{ backgroundColor: '#fffaf0' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
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
            <PostalCodeInput />
          </div>

          {/* Barra de búsqueda - Ocupa el espacio central */}
          <div className="flex-1 min-w-0 hidden md:block">
            <SearchBar />
          </div>

          {/* Botones de acción a la derecha */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-auto">
            {/* Botón de inicio de sesión - Solo desktop */}
            <div className="hidden md:block">
              <AuthButton />
            </div>

            {/* Carrito */}
            <button
              onClick={() => router.push("/carrito")}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Botón de inicio de sesión - Solo móvil */}
            <div className="md:hidden">
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Segunda fila móvil: Código postal y búsqueda */}
        <div className="flex md:hidden items-center gap-2 mt-2">
          <PostalCodeInput />
          <div className="flex-1">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}

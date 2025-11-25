"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navegar a página de búsqueda o filtrar productos
      router.push(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 w-full">
      <div className="relative flex">
        <input
          type="text"
          placeholder="Buscar productos, marcas, categorías..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2.5 pl-10 pr-20 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base md:text-lg"
          style={{ backgroundColor: '#fff' }}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-r-md text-base md:text-lg font-medium transition-colors whitespace-nowrap"
          style={{ 
            backgroundColor: 'var(--brand-blue)',
            color: '#fff',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }}
        >
          Buscar
        </button>
      </div>
    </form>
  );
}


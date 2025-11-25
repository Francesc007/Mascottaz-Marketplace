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
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 md:px-4 py-2 pl-9 md:pl-10 pr-20 md:pr-24 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          style={{ backgroundColor: '#fff' }}
        />
        <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        <button
          type="submit"
          className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 px-2 md:px-4 py-1 rounded-md text-xs md:text-sm font-medium transition-colors"
          style={{ 
            backgroundColor: 'var(--brand-blue)',
            color: '#fff'
          }}
        >
          Buscar
        </button>
      </div>
    </form>
  );
}


"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NavigationBar from "../../components/NavigationBar";
import ProductCard from "../../components/ProductCard";
import { createClient } from "../../lib/supabaseClient";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchProducts(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const searchProducts = async (searchTerm) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("activo", true)
        .or(`nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%,marca.ilike.%${searchTerm}%`)
        .limit(50);

      if (error) {
        console.error("Error buscando productos:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />

      <main className="flex-1">
        <NavigationBar />
        
        <div className="max-w-screen-2xl mx-auto px-2 md:px-4 py-8">
          <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--brand-blue)' }}>
            {query ? `Resultados para "${query}"` : "Buscar productos"}
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Buscando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {query ? `No se encontraron productos para "${query}"` : "Ingresa un término de búsqueda"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}




"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "../lib/supabaseClient";
import ProductCard from "./ProductCard";

export default function DailyDeals({ addToCart }) {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, [supabase]);

  const loadDeals = async () => {
    try {
      if (!supabase || !supabase.from) {
        console.warn("Supabase client not available");
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("activo", true)
        .order("fecha_creacion", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error cargando ofertas:", error);
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

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-2 md:px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="max-w-screen-2xl mx-auto px-2 md:px-4">
        <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--brand-blue)' }}>
          Ofertas del Día
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}


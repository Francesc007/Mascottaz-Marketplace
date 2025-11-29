"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import SellerBadge from "../../../components/SellerBadge";
import ReviewList from "../../../components/ReviewList";
import ReviewForm from "../../../components/ReviewForm";
import { ShoppingCart, Store, ArrowLeft, Loader2, AlertCircle, MessageSquare, Star } from "lucide-react";
import useCartStore from "../../../store/cartStore";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { addItem } = useCartStore();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadProduct();
    }
  }, [params.id, supabase]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      // Cargar producto
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .eq("activo", true)
        .single();

      if (productError || !productData) {
        setError("Producto no encontrado");
        setLoading(false);
        return;
      }

      setProduct(productData);

      // Cargar información del vendedor si existe id_vendedor
      if (productData.id_vendedor) {
        const { data: vendorData } = await supabase
          .from("vendors")
          .select("business_name, email, phone, avatar_url")
          .eq("user_id", productData.id_vendedor)
          .single();

        if (vendorData) {
          // Cargar perfil para verificar si está verificado
          const { data: profileData } = await supabase
            .from("profiles")
            .select("seller_verified, full_name")
            .eq("user_id", productData.id_vendedor)
            .single();

          setSeller({
            ...vendorData,
            seller_verified: profileData?.seller_verified || false,
            full_name: profileData?.full_name || vendorData.business_name,
          });
        }
      }
    } catch (err) {
      console.error("Error cargando producto:", err);
      setError("Error al cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      addItem(product);
      // Pequeño delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push("/carrito");
    } catch (err) {
      console.error("Error agregando al carrito:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fffaf0' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: 'var(--brand-blue)' }} />
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fffaf0' }}>
        <Header />
        <div className="max-w-screen-2xl mx-auto px-2 md:px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
            <p className="text-gray-600 mb-6">{error || "El producto que buscas no existe o no está disponible."}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al inicio
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = product.imagen || "/placeholder-product.jpg";
  const productName = product.nombre || product.name;
  const productDescription = product.descripcion || product.description;
  const productPrice = product.precio || product.price;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffaf0' }}>
      <Header />

      <main className="max-w-screen-2xl mx-auto px-2 md:px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Imagen del producto */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imageUrl}
                alt={productName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Información del producto */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{productName}</h1>
              
              <div className="mb-6">
                <p className="text-4xl font-bold mb-2" style={{ color: 'var(--brand-blue)' }}>
                  ${productPrice?.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Información del vendedor */}
              {seller && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    {seller.avatar_url ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={seller.avatar_url}
                          alt={seller.business_name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Store className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{seller.business_name}</h3>
                        <SellerBadge verified={seller.seller_verified} />
                      </div>
                      {seller.full_name && seller.full_name !== seller.business_name && (
                        <p className="text-sm text-gray-600">{seller.full_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    {seller.email && <p>📧 {seller.email}</p>}
                    {seller.phone && <p>📞 {seller.phone}</p>}
                  </div>
                  <Link
                    href={`/messages?sellerId=${product.id_vendedor}&productId=${product.id}`}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contactar al vendedor
                  </Link>
                </div>
              )}

              {/* Descripción */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Descripción</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{productDescription || "Sin descripción disponible."}</p>
              </div>

              {/* Botón agregar al carrito */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-lg"
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Agregando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Agregar al carrito
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Reseñas */}
        {product.id_vendedor && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
              <h2 className="text-2xl font-bold text-gray-900">Reseñas</h2>
            </div>
            <ReviewList 
              sellerId={product.id_vendedor} 
              productId={product.id}
              showForm={true}
            />
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deja tu reseña</h3>
              <ReviewForm 
                sellerId={product.id_vendedor}
                productId={product.id}
                onReviewSubmitted={() => {
                  // Recargar reviews después de enviar
                  window.location.reload();
                }}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}


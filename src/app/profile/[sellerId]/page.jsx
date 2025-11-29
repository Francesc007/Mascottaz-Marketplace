"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import SellerBadge from "../../../components/SellerBadge";
import ProductCard from "../../../components/ProductCard";
import ReviewList from "../../../components/ReviewList";
import ReviewForm from "../../../components/ReviewForm";
import { Store, MapPin, Mail, Phone, Package, Star, Camera, Edit, ArrowLeft } from "lucide-react";
import useCartStore from "../../../store/cartStore";

export default function SellerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { addItem } = useCartStore();
  const [seller, setSeller] = useState(null);
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [petPhotos, setPetPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.sellerId) {
      loadSellerData();
    }
  }, [params.sellerId, supabase]);

  const loadSellerData = async () => {
    try {
      setLoading(true);
      setError("");

      // Cargar perfil del vendedor
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", params.sellerId)
        .single();

      if (profileError || !profileData) {
        setError("Vendedor no encontrado");
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Cargar datos del vendor
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", params.sellerId)
        .single();

      if (vendorData) {
        setSeller(vendorData);
      }

      // Cargar productos del vendedor
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("id_vendedor", params.sellerId)
        .eq("activo", true)
        .order("fecha_creacion", { ascending: false })
        .limit(12);

      if (productsData) {
        setProducts(productsData);
      }

      // Cargar fotos de mascotas del vendedor
      const { data: photosData } = await supabase
        .from("pet_photos")
        .select("*")
        .eq("user_id", params.sellerId)
        .order("created_at", { ascending: false })
        .limit(9);

      if (photosData) {
        setPetPhotos(photosData);
      }
    } catch (err) {
      console.error("Error cargando datos del vendedor:", err);
      setError("Error al cargar el perfil del vendedor");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    addItem(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fffaf0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fffaf0' }}>
        <Header />
        <div className="max-w-screen-2xl mx-auto px-2 md:px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Vendedor no encontrado</h2>
            <p className="text-gray-600 mb-6">{error || "El vendedor que buscas no existe."}</p>
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

  const sellerName = seller?.business_name || profile.full_name || "Vendedor";
  const sellerDescription = seller?.description || profile.bio || "";
  const sellerLocation = seller?.address || (profile.location ? `${profile.location.municipio || ""}, ${profile.location.estado || ""}` : "");
  const bannerUrl = profile.banner_url || seller?.banner_url;
  const avatarUrl = profile.avatar_url || seller?.avatar_url;
  const isVerified = profile.seller_verified || false;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffaf0' }}>
      <Header />

      <main className="max-w-screen-2xl mx-auto px-2 md:px-4">
        {/* Banner */}
        <div className="relative w-full h-64 md:h-80 bg-gray-200 rounded-t-xl overflow-hidden">
          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt={`Banner de ${sellerName}`}
              fill
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <Store className="w-24 h-24 text-white opacity-50" />
            </div>
          )}
        </div>

        {/* Información del vendedor */}
        <div className="bg-white rounded-b-xl shadow-lg p-6 md:p-8 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="relative -mt-20 md:-mt-24">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={sellerName}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <Store className="w-16 h-16 md:w-20 md:h-20" style={{ color: 'var(--brand-blue)' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Información */}
            <div className="flex-1 mt-4 md:mt-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{sellerName}</h1>
                <SellerBadge verified={isVerified} />
              </div>

              {sellerLocation && (
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{sellerLocation}</span>
                </div>
              )}

              {sellerDescription && (
                <p className="text-gray-700 mt-3">{sellerDescription}</p>
              )}

              {seller && (
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  {seller.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{seller.email}</span>
                    </div>
                  )}
                  {seller.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{seller.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Productos */}
        {products.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
              <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
              <span className="text-gray-500">({products.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
              ))}
            </div>
          </div>
        )}

        {/* Galería de fotos de mascotas */}
        {petPhotos.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
              <Camera className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
              <h2 className="text-2xl font-bold text-gray-900">Galería de Mascotas</h2>
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {petPhotos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={photo.photo_url}
                    alt={photo.caption || "Foto de mascota"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sección de Reseñas */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
            <h2 className="text-2xl font-bold text-gray-900">Reseñas</h2>
          </div>
          <ReviewList 
            sellerId={params.sellerId} 
            productId={null}
            showForm={true}
          />
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deja tu reseña</h3>
            <ReviewForm 
              sellerId={params.sellerId}
              productId={null}
              onReviewSubmitted={() => {
                // Recargar reviews después de enviar
                window.location.reload();
              }}
            />
          </div>
        </div>

        {products.length === 0 && petPhotos.length === 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-12 text-center">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Este vendedor aún no tiene productos o fotos publicadas.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}


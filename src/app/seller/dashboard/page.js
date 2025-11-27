"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { Store, Package, ShoppingCart, DollarSign, TrendingUp, Settings, CreditCard, LogOut, Star, MessageSquare } from "lucide-react";

export default function SellerDashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    weeklySales: 0,
    averageRating: 0,
    totalReviews: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    loadVendorData();
  }, [supabase]);

  const loadVendorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/seller/login");
        return;
      }

      const { data: vendorData } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!vendorData) {
        router.push("/seller/register");
        return;
      }

      setVendor(vendorData);

      // Cargar estadísticas
      const { data: productsData } = await supabase
        .from("products")
        .select("id, precio")
        .eq("id_vendedor", user.id);

      const totalProducts = productsData?.length || 0;
      
      // Cargar pedidos
      let totalOrders = 0;
      let totalRevenue = 0;
      let pendingOrders = 0;
      let weeklySales = 0;

      try {
        const { data: ordersData } = await supabase
          .from("orders")
          .select("id, total_amount, status, created_at")
          .eq("seller_id", user.id);

        if (ordersData) {
          totalOrders = ordersData.length;
          totalRevenue = ordersData.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
          pendingOrders = ordersData.filter(o => o.status === 'pendiente' || o.status === 'en_preparacion').length;
          
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          weeklySales = ordersData
            .filter(o => new Date(o.created_at) >= oneWeekAgo && o.status !== 'cancelado')
            .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
        }
      } catch (err) {
        console.log("Tabla orders no existe aún:", err);
      }

      // Cargar calificaciones
      let averageRating = 0;
      let totalReviews = 0;
      try {
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("rating")
          .eq("seller_id", user.id);

        if (reviewsData && reviewsData.length > 0) {
          totalReviews = reviewsData.length;
          const sum = reviewsData.reduce((acc, r) => acc + (r.rating || 0), 0);
          averageRating = sum / totalReviews;
        }
      } catch (err) {
        console.log("Tabla reviews no existe aún:", err);
      }

      // Cargar mensajes no leídos
      let unreadMessages = 0;
      try {
        const { data: messagesData } = await supabase
          .from("messages")
          .select("id")
          .eq("receiver_id", user.id)
          .eq("is_read", false);

        if (messagesData) {
          unreadMessages = messagesData.length;
        }
      } catch (err) {
        console.log("Tabla messages no existe aún:", err);
      }
      
      setStats({
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        weeklySales,
        averageRating,
        totalReviews,
        unreadMessages
      });
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/seller/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fffaf0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffaf0' }}>
      <header className="shadow-sm" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-screen-2xl mx-auto px-2 md:px-4">
          <div className="flex flex-col items-center py-4">
            <div className="flex items-center justify-center mb-4">
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/MASCOTTAZ.png"
                  alt="Mascottaz logo"
                  width={300}
                  height={100}
                  className="h-[90px] w-[300px] object-contain"
                  priority
                />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="w-full flex items-center justify-between py-3 px-8" style={{ backgroundColor: 'var(--interaction-blue)' }}>
          <div className="max-w-screen-2xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden">
                {vendor?.avatar_url ? (
                  <img 
                    src={vendor.avatar_url} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-8 h-8" style={{ color: 'var(--brand-blue)' }} />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
                  {vendor?.business_name || "Mi Tienda"}
                </h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-2 md:px-4 py-8">
        {/* Resumen de la semana y Rating */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--brand-blue)' }}>Ventas de la Semana</h3>
              <TrendingUp className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
            </div>
            <p className="text-4xl font-bold mb-2" style={{ color: 'var(--brand-blue)' }}>
              ${stats.weeklySales.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600">Últimos 7 días</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--brand-blue)' }}>Reputación</h3>
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold" style={{ color: 'var(--brand-blue)' }}>
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(stats.averageRating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{stats.totalReviews} {stats.totalReviews === 1 ? 'reseña' : 'reseñas'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Productos</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--brand-blue)' }}>{stats.totalProducts}</p>
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--interaction-blue-light)' }}>
                <Package className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pedidos</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.totalOrders}</p>
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--interaction-blue)' }}>
                <ShoppingCart className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Ingresos</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--brand-blue)' }}>${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--interaction-blue)' }}>
                <DollarSign className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pendientes</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--brand-blue)' }}>{stats.pendingOrders}</p>
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--interaction-blue)' }}>
                <TrendingUp className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/seller/products"
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--interaction-blue-light)' }}>
              <Package className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
              Productos
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
              Gestiona tus productos y inventario
            </p>
          </Link>

          <Link
            href="/seller/orders"
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--interaction-blue-light)' }}>
              <ShoppingCart className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
              Pedidos
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
              Revisa y gestiona tus pedidos
            </p>
          </Link>

          <Link
            href="/seller/billing"
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--interaction-blue-light)' }}>
              <CreditCard className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
              Facturación
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
              Gestiona pagos y comisiones
            </p>
          </Link>

          <Link
            href="/seller/reviews"
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative" style={{ backgroundColor: 'var(--interaction-blue-light)' }}>
              <Star className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
              {stats.totalReviews > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.totalReviews}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
              Reputación
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
              Reseñas y calificaciones
            </p>
          </Link>

          <Link
            href="/seller/messages"
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative" style={{ backgroundColor: 'var(--interaction-blue-light)' }}>
              <MessageSquare className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
              {stats.unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.unreadMessages}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
              Mensajes
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
              Preguntas de compradores
            </p>
          </Link>

          <Link
            href="/seller/settings"
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1 group"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--interaction-blue-light)' }}>
              <Settings className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
              Configuración
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
              Ajusta tu perfil y preferencias
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}









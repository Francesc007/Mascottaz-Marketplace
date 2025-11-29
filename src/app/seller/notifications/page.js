"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { 
  Bell, 
  ShoppingCart, 
  Mail, 
  Star, 
  Package, 
  Trash2,
  Eye,
  EyeOff,
  Clock,
  AlertCircle,
  Truck,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import Footer from "../../../components/Footer";

export default function SellerNotificationsPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all"); // all, new_order, order_status_change, new_message, new_review, low_stock
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [supabase, filterType, showOnlyUnread]);

  useEffect(() => {
    // Suscripción en tiempo real para nuevas notificaciones
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        async (payload) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && payload.new.user_id === user.id) {
            loadNotifications();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/seller/login");
        return;
      }

      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (filterType !== "all") {
        query = query.eq("type", filterType);
      }

      if (showOnlyUnread) {
        query = query.eq("is_read", false);
      }

      const { data, error } = await query;

      if (error) {
        // Si la tabla no existe aún, simplemente mostrar lista vacía
        if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation') || error.code === 'PGRST116') {
          // Tabla no existe aún, mostrar lista vacía sin error
          setNotifications([]);
          return;
        }
        // Solo mostrar error en consola si no es un error de tabla no encontrada
        console.warn("Error cargando notificaciones:", error.message || error);
        setNotifications([]);
        return;
      }

      setNotifications(data || []);
    } catch (err) {
      console.error("Error inesperado:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq("id", notificationId);

      if (error) {
        console.error("Error marcando como leído:", error);
        return;
      }

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)
      );
    } catch (err) {
      console.error("Error inesperado:", err);
    }
  };

  const markAsUnread = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ 
          is_read: false,
          read_at: null
        })
        .eq("id", notificationId);

      if (error) {
        console.error("Error marcando como no leído:", error);
        return;
      }

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: false, read_at: null } : n)
      );
    } catch (err) {
      console.error("Error inesperado:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const unreadIds = notifications
        .filter(n => !n.is_read)
        .map(n => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from("notifications")
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .in("id", unreadIds);

      if (error) {
        console.error("Error marcando todas como leídas:", error);
        return;
      }

      loadNotifications();
    } catch (err) {
      console.error("Error inesperado:", err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) {
        console.error("Error eliminando notificación:", error);
        return;
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error("Error inesperado:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_order":
        return <ShoppingCart className="w-5 h-5" />;
      case "order_status_change":
        return <Truck className="w-5 h-5" />;
      case "new_review":
        return <Star className="w-5 h-5" />;
      case "low_stock":
        return <AlertCircle className="w-5 h-5" />;
      case "product_update":
        return <Package className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "new_order":
        return "bg-green-100 text-green-700";
      case "order_status_change":
        return "bg-blue-100 text-blue-700";
      case "new_review":
        return "bg-yellow-100 text-yellow-700";
      case "low_stock":
        return "bg-red-100 text-red-700";
      case "product_update":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getActionLink = (notification) => {
    if (!notification.related_id || !notification.related_type) return null;

    switch (notification.related_type) {
      case "order":
        return `/seller/orders?orderId=${notification.related_id}`;
      case "message":
        return `/seller/messages?conversationId=${notification.related_id}`;
      case "review":
        return `/seller/reviews`;
      case "product":
        return `/seller/products?productId=${notification.related_id}`;
      default:
        return null;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fffaf0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando notificaciones...</p>
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
              <Link href="/seller/dashboard" style={{ color: 'var(--brand-blue)' }} className="hover:opacity-80 transition-opacity">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Bell className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>Notificaciones</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-2 md:px-4 py-8">
        {/* Filtros y acciones */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 flex-1">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterType("new_order")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === "new_order"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Nuevos Pedidos
              </button>
              <button
                onClick={() => setFilterType("order_status_change")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === "order_status_change"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cambios de Estado
              </button>
              <button
                onClick={() => setFilterType("new_review")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === "new_review"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Reseñas
              </button>
              <button
                onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  showOnlyUnread
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {showOnlyUnread ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                No leídas
              </button>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Marcar todas como leídas ({unreadCount})
              </button>
            )}
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay notificaciones</h3>
              <p className="text-gray-500">
                {showOnlyUnread 
                  ? "No tienes notificaciones sin leer" 
                  : "Todas tus notificaciones aparecerán aquí"}
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const actionLink = getActionLink(notification);
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-lg p-5 border-l-4 transition-all duration-200 ${
                    notification.is_read 
                      ? "border-gray-300 opacity-75" 
                      : "border-blue-600 shadow-xl"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className={`font-semibold mb-1 ${notification.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(notification.created_at)}
                            </span>
                            {notification.related_type && (
                              <span className="capitalize">{notification.related_type}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.is_read ? (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Marcar como leído"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => markAsUnread(notification.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Marcar como no leído"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {actionLink && (
                        <div className="mt-3">
                          <Link
                            href={actionLink}
                            onClick={() => !notification.is_read && markAsRead(notification.id)}
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Ver detalles
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}


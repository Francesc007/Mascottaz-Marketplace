"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Search, 
  Filter,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileText
} from "lucide-react";

export default function SellerOrdersPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0
  });

  useEffect(() => {
    loadOrders();
  }, [supabase]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/seller/login");
        return;
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items:order_items (
            *,
            product:product_id (
              nombre,
              imagen
            )
          )
        `)
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error cargando pedidos:", ordersError);
        if (ordersError.code === '42P01') {
          setOrders([]);
          setLoading(false);
          return;
        }
        throw ordersError;
      }

      if (ordersData) {
        const formattedOrders = ordersData.map(order => ({
          id: order.id,
          numero: order.order_number,
          buyer_id: order.buyer_id,
          productos: order.order_items || [],
          total: parseFloat(order.total_amount || 0),
          estado: order.status,
          fecha: order.created_at,
          direccion: order.shipping_address,
          payment_status: order.payment_status,
          notes: order.notes
        }));
        setOrders(formattedOrders);

        // Calcular estadísticas
        setStats({
          total: formattedOrders.length,
          pending: formattedOrders.filter(o => o.estado === 'pendiente').length,
          processing: formattedOrders.filter(o => o.estado === 'en_preparacion').length,
          completed: formattedOrders.filter(o => o.estado === 'entregado').length
        });
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updateData = { status: newStatus, updated_at: new Date().toISOString() };
      
      if (newStatus === 'enviado') {
        updateData.shipped_at = new Date().toISOString();
      } else if (newStatus === 'entregado') {
        updateData.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, estado: newStatus } : order
      ));
      
      await loadOrders();
    } catch (err) {
      console.error("Error actualizando pedido:", err);
      alert("Error al actualizar el estado del pedido");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "en_preparacion":
        return "bg-blue-100 text-blue-800";
      case "enviado":
        return "bg-indigo-100 text-indigo-800";
      case "entregado":
        return "bg-green-100 text-green-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendiente":
        return <Clock className="w-4 h-4" />;
      case "en_preparacion":
        return <Package className="w-4 h-4" />;
      case "enviado":
        return <Truck className="w-4 h-4" />;
      case "entregado":
        return <CheckCircle2 className="w-4 h-4" />;
      case "cancelado":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pendiente: "Pendiente",
      en_preparacion: "En Preparación",
      enviado: "Enviado",
      entregado: "Entregado",
      cancelado: "Cancelado"
    };
    return labels[status] || status;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.numero?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fffaf0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffaf0' }}>
      <header className="shadow-sm" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-screen-2xl mx-auto px-8">
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
              <Link href="/seller/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                <ShoppingCart className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
                Pedidos
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--brand-blue)' }}>{stats.total}</p>
              </div>
              <ShoppingCart className="w-8 h-8" style={{ color: 'var(--brand-blue)' }} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">En Proceso</p>
                <p className="text-3xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Completados</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número de pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_preparacion">En Preparación</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de pedidos */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes pedidos aún
            </h3>
            <p className="text-gray-500">
              Los pedidos aparecerán aquí cuando los clientes compren tus productos
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--brand-blue)' }}>
                        {order.numero}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.estado)}`}>
                        {getStatusIcon(order.estado)}
                        {getStatusLabel(order.estado)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Fecha: {new Date(order.fecha).toLocaleDateString('es-MX', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.payment_status === 'pagado' ? 'Pagado' : 'Pendiente de pago'}
                    </p>
                  </div>
                </div>

                {order.productos && order.productos.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Productos:</h4>
                    <div className="space-y-2">
                      {order.productos.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span>{item.product_name} x {item.quantity}</span>
                          <span className="font-medium">${item.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Dirección de envío:</strong> {order.direccion}
                  </p>
                </div>

                {order.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Notas:</strong> {order.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  {order.estado === 'pendiente' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'en_preparacion')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Marcar como En Preparación
                    </button>
                  )}
                  {order.estado === 'en_preparacion' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'enviado')}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      Marcar como Enviado
                    </button>
                  )}
                  {order.estado === 'enviado' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'entregado')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Marcar como Entregado
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}






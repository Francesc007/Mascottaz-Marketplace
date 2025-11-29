"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { 
  CreditCard, 
  ArrowLeft, 
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  Download,
  Building2,
  Wallet
} from "lucide-react";
import Footer from "../../../components/Footer";

export default function SellerBillingPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingPayout: 0,
    thisMonth: 0,
    lastMonth: 0,
    commissionRate: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [bankAccount, setBankAccount] = useState(null);

  useEffect(() => {
    loadVendorData();
  }, [supabase]);

  const loadVendorData = async () => {
    try {
      setLoading(true);
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

      // Cargar pagos
      try {
        const { data: paymentsData } = await supabase
          .from("payments")
          .select("*")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });

        if (paymentsData) {
          const totalEarnings = paymentsData
            .filter(p => p.payment_status === 'completado')
            .reduce((sum, p) => sum + parseFloat(p.net_amount || 0), 0);

          const pendingPayout = paymentsData
            .filter(p => p.payment_status === 'pendiente' || p.payment_status === 'procesando')
            .reduce((sum, p) => sum + parseFloat(p.net_amount || 0), 0);

          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const thisMonth = paymentsData
            .filter(p => {
              const created = new Date(p.created_at);
              return created >= startOfMonth && p.payment_status === 'completado';
            })
            .reduce((sum, p) => sum + parseFloat(p.net_amount || 0), 0);

          const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
          const lastMonth = paymentsData
            .filter(p => {
              const created = new Date(p.created_at);
              return created >= startOfLastMonth && created <= endOfLastMonth && p.payment_status === 'completado';
            })
            .reduce((sum, p) => sum + parseFloat(p.net_amount || 0), 0);

          setStats({
            totalEarnings,
            pendingPayout,
            thisMonth,
            lastMonth,
            commissionRate: paymentsData.length > 0 ? parseFloat(paymentsData[0].commission_rate || 0) : 0
          });

          setTransactions(paymentsData);
        }
      } catch (err) {
        console.log("Tabla payments no existe aún:", err);
      }

      // Cargar cuenta bancaria
      try {
        const { data: bankData } = await supabase
          .from("bank_accounts")
          .select("*")
          .eq("seller_id", user.id)
          .eq("is_default", true)
          .single();

        if (bankData) {
          setBankAccount(bankData);
        }
      } catch (err) {
        console.log("Tabla bank_accounts no existe aún o no hay cuenta:", err);
      }
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fffaf0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
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
              <Link href="/seller/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                <CreditCard className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
                Facturación
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-2 md:px-4 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Ganancias Totales</p>
                <p className="text-3xl font-bold text-green-600">
                  ${stats.totalEarnings.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                <DollarSign className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pendiente de Pago</p>
                <p className="text-3xl font-bold text-yellow-600">
                  ${stats.pendingPayout.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center">
                <Wallet className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Este Mes</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--brand-blue)' }}>
                  ${stats.thisMonth.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                <Calendar className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Comisión</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--brand-blue)' }}>
                  {stats.commissionRate}%
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-7 h-7" style={{ color: 'var(--brand-blue)' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Método de Pago */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                Método de Pago
              </h2>
              {bankAccount ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-8 h-8" style={{ color: 'var(--brand-blue)' }} />
                    <div>
                      <p className="font-semibold">{bankAccount.bank_name}</p>
                      <p className="text-sm text-gray-600">
                        {bankAccount.account_holder_name}
                      </p>
                      {bankAccount.account_number_last4 && (
                        <p className="text-xs text-gray-500">
                          Cuenta terminada en: {bankAccount.account_number_last4}
                        </p>
                      )}
                    </div>
                  </div>
                  <Link
                    href="/seller/settings"
                    className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Actualizar Datos Bancarios
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No hay cuenta bancaria configurada</p>
                  <Link
                    href="/seller/settings"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Configurar Cuenta
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Historial de Transacciones */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--brand-blue)' }}>
                  Historial de Transacciones
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
              </div>
              
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Aún no tienes transacciones</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            ${transaction.net_amount?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.created_at).toLocaleDateString('es-MX')}
                          </p>
                          {transaction.description && (
                            <p className="text-xs text-gray-500 mt-1">{transaction.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              transaction.payment_status === 'completado'
                                ? 'bg-green-100 text-green-800'
                                : transaction.payment_status === 'procesando'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {transaction.payment_status === 'completado' ? 'Completado' :
                             transaction.payment_status === 'procesando' ? 'Procesando' :
                             'Pendiente'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}









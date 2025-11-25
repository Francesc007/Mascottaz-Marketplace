"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Users, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Package, 
  Shield,
  ArrowRight
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const benefits = [
  {
    icon: Users,
    title: "Alcance masivo",
    description: "Conecta con miles de compradores que buscan productos para sus mascotas"
  },
  {
    icon: TrendingUp,
    title: "Aumenta tus ventas",
    description: "Accede a una audiencia comprometida y aumenta tu volumen de ventas"
  },
  {
    icon: BarChart3,
    title: "Estadísticas en tiempo real",
    description: "Monitorea tus ventas, productos más vendidos y rendimiento con herramientas profesionales"
  },
  {
    icon: Zap,
    title: "Publicación rápida",
    description: "Sube fotos, agrega precios y activa tus productos en cuestión de minutos"
  },
  {
    icon: Package,
    title: "Gestión de inventario",
    description: "Controla tu catálogo, stock, promociones y configuración desde un solo lugar"
  },
  {
    icon: Shield,
    title: "Herramientas profesionales",
    description: "Panel intuitivo con gestión de productos, pedidos, mensajes y más"
  }
];

export default function Benefits() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-2xl mx-auto px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Vende tus productos de mascotas al público adecuado
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En Mascottaz te conectamos con miles de compradores que buscan exactamente lo que ofreces. 
            Publica tus productos rápido, gestiona tu inventario y recibe notificaciones en tiempo real.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  ...fadeUp,
                  transition: { duration: 0.5, delay: index * 0.1 }
                }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 mb-8"
        >
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Comienza sin comisiones
              </h3>
            </div>
          </div>
          <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
            Hasta el <strong>1° de enero 2026</strong> podrás vender sin pagar comisiones, 
            costos de registro, ni tarifas por publicación, ni por venta.
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center"
        >
          <Link
            href="/seller/register"
            className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span>Crear cuenta de vendedor</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}






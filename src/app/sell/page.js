"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Benefits from "@/components/sell/Benefits";
import Commissions from "@/components/sell/Commissions";
import Faq from "@/components/sell/Faq";
import CallToAction from "@/components/sell/CallToAction";
import { Store, ArrowRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function SellPage() {
  return (
    <div style={{ backgroundColor: '#fffaf0' }}>
      <header className="bg-transparent py-6">
        <div className="max-w-screen-2xl mx-auto px-2 md:px-4">
          <Link href="/" className="flex justify-center">
            <Image
              src="/MASCOTTAZ.png"
              alt="Mascottaz Logo"
              width={300}
              height={100}
              className="h-[90px] w-[300px] object-contain"
              priority
            />
          </Link>
        </div>
      </header>

      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-screen-2xl mx-auto px-2 md:px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeUp}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 mb-6">
              <Store className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Vende en Mascottaz
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Conecta con miles de compradores de productos para mascotas. 
              Publica tus productos, gestiona tu inventario y aumenta tus ventas 
              desde un panel profesional.
            </p>
            <Link
              href="/seller/register"
              className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Crear cuenta de vendedor</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Benefits />
      <Commissions />
      <Faq />
      <CallToAction />

      <footer className="py-8 bg-gray-900 text-white">
        <div className="max-w-screen-2xl mx-auto px-2 md:px-4 text-center">
          <p className="text-sm">
            © 2025 Mascottaz. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}









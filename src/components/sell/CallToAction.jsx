"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="max-w-screen-2xl mx-auto px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Listo para comenzar a vender?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a Mascottaz y comienza a llegar a miles de compradores de productos para mascotas.
            El registro es rápido y sin comisiones hasta enero 2026.
          </p>
          <Link
            href="/seller/register"
            className="inline-flex items-center space-x-3 bg-white text-blue-600 font-bold px-10 py-5 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-blue-50"
          >
            <span className="text-lg">Comenzar a Vender</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}






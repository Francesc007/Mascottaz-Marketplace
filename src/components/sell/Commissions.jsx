"use client";

import { motion } from "framer-motion";
import { DollarSign, Calendar, CheckCircle2 } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Commissions() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-screen-2xl mx-auto px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comisiones y Pagos
          </h2>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Por lanzamiento, hasta el 1° de enero 2026
                </h3>
                <p className="text-lg text-gray-700 mb-4">
                  No habrá comisiones ni tarifas de registro, publicación o venta.
                </p>
                <p className="text-base text-gray-600 italic">
                  Las comisiones finales serán anunciadas próximamente.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Mientras tanto:
              </h4>
              <div className="space-y-3">
                {[
                  "Puedes publicar productos libremente",
                  "No hay cargos por venta",
                  "No hay deducciones en tus pagos"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}








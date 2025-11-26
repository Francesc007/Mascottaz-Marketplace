"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const faqs = [
  {
    question: "¿Cómo creo una cuenta de vendedor?",
    answer: "Solo necesitas tu correo, una contraseña y tus datos básicos. Completa el formulario en la página de registro y en pocos minutos tendrás acceso a tu panel de vendedor."
  },
  {
    question: "¿Cómo subo mis productos?",
    answer: "Desde tu dashboard de vendedor selecciona \"Agregar producto\", sube tus imágenes, escribe nombre, precio y descripción. Publicarlo toma menos de 2 minutos."
  },
  {
    question: "¿Cómo recibo mis pagos?",
    answer: "Una vez configurados tus datos bancarios, recibirás tus pagos automáticamente según el calendario de liquidaciones del sistema."
  },
  {
    question: "¿Cómo gestiono mis pedidos?",
    answer: "En tu dashboard verás todos tus pedidos, estado, horarios, datos del comprador y pasos para procesar cada venta."
  },
  {
    question: "¿Cómo recupero mi contraseña?",
    answer: "Desde la página de inicio de sesión puedes acceder a \"¿Olvidaste tu contraseña?\" y se enviará un enlace para restablecerla o en la configuración de tu perfil podrás cambiarla si así lo deseas."
  },
  {
    question: "¿Qué hago si no tengo inventario disponible?",
    answer: "Puedes pausar o desactivar temporalmente un producto desde tu panel sin perder su información."
  },
  {
    question: "¿Cuánto tiempo tarda en aprobarse mi cuenta de vendedor?",
    answer: "La aprobación de tu cuenta es automática una vez que completes el registro. Podrás comenzar a publicar productos inmediatamente después de registrarte."
  },
  {
    question: "¿Puedo vender productos de cualquier categoría?",
    answer: "Sí, puedes vender productos relacionados con mascotas en todas las categorías disponibles: alimentos, juguetes, accesorios, servicios veterinarios, entre otros."
  },
  {
    question: "¿Cómo puedo contactar con el soporte para vendedores?",
    answer: "Puedes contactar con nuestro equipo de soporte desde tu dashboard de vendedor, en la sección de ayuda. También puedes enviar un correo a soporte@mascottaz.com y te responderemos en menos de 24 horas."
  },
  {
    question: "¿Qué información necesito para registrarme como vendedor?",
    answer: "Necesitarás: nombre de tu negocio, nombre del propietario, correo electrónico, teléfono, dirección y una breve descripción de tu negocio. Todos los datos son necesarios para autenticar tu identidad y brindarte una mejor experiencia, garantizando la confidencialidad de tu información."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Centro de Ayuda para Vendedores
          </h2>
          <p className="text-lg text-gray-600">
            Resuelve tus dudas más frecuentes
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  ...fadeUp,
                  transition: { duration: 0.5, delay: index * 0.05 }
                }}
                className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <p className="text-sm text-gray-700 text-center">
              <strong>Nota:</strong> Para autenticar tu identidad como vendedor y brindarte una mejor experiencia, 
              se solicitarán ciertos datos personales y de tu negocio. Toda tu información será tratada con 
              la máxima confidencialidad y solo se utilizará para los fines del servicio.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}








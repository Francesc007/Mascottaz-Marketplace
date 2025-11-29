"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Shield, Clock, MessageSquare, CheckCircle2, AlertTriangle, FileText, Users, Lock } from "lucide-react";

export default function HowWeProtectPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffaf0' }}>
      <Header />

      <main className="max-w-screen-2xl mx-auto px-2 md:px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
            <Shield className="w-10 h-10" style={{ color: 'var(--brand-blue)' }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cómo Protegemos tus Compras
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En Mascottaz, tu seguridad y confianza son nuestra prioridad. Conoce todas las medidas que implementamos para proteger tus compras.
          </p>
        </div>

        {/* Vendedores Verificados */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendedores Verificados</h2>
              <p className="text-gray-700 leading-relaxed">
                Todos nuestros vendedores pasan por un proceso de verificación exhaustivo. Revisamos su identificación oficial (INE), comprobante de domicilio y realizamos una verificación humana para asegurarnos de que son personas reales y confiables.
              </p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">¿Qué significa el sello "Vendedor Verificado"?</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Identidad verificada mediante documentos oficiales</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Domicilio confirmado con comprobante válido</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Verificación humana para prevenir fraudes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Compromiso con políticas de la plataforma</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Protección 48 Horas */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Protección de 48 Horas</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si un vendedor no responde a tus mensajes o consultas en un plazo de 48 horas después de tu compra, Mascottaz interviene automáticamente para ayudarte.
              </p>
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <h3 className="font-semibold text-yellow-900 mb-3">¿Qué pasa si el vendedor no responde?</h3>
                <ol className="space-y-3 text-yellow-800 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <span>Después de 48 horas sin respuesta, nuestro equipo de soporte se contacta directamente con el vendedor.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <span>Si el vendedor sigue sin responder, abrimos un ticket de soporte para investigar la situación.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <span>Te mantenemos informado en cada paso y trabajamos contigo para encontrar una solución.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">4.</span>
                    <span>En casos extremos, podemos suspender temporalmente al vendedor hasta resolver el problema.</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Proceso de Tickets */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sistema de Tickets de Soporte</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si tienes algún problema con tu compra, puedes abrir un ticket de soporte. Nuestro equipo revisa cada caso de manera individual y trabaja contigo para resolverlo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Tiempos de Respuesta</h3>
                  <ul className="space-y-1 text-green-800 text-sm">
                    <li>• Respuesta inicial: 24 horas</li>
                    <li>• Resolución promedio: 3-5 días hábiles</li>
                    <li>• Casos urgentes: 12 horas</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Qué Puedes Reportar</h3>
                  <ul className="space-y-1 text-green-800 text-sm">
                    <li>• Producto no recibido</li>
                    <li>• Producto diferente al anunciado</li>
                    <li>• Vendedor no responde</li>
                    <li>• Problemas con el envío</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <MessageSquare className="w-5 h-5" />
                  Abrir Ticket de Soporte
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Comunicación Directa */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Comunicación Directa con Vendedores</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Puedes contactar directamente a cualquier vendedor a través de nuestro sistema de mensajería. Todas las conversaciones quedan registradas para tu protección.
              </p>
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">Beneficios del Sistema de Mensajería</h3>
                <ul className="space-y-2 text-purple-800 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Historial completo de conversaciones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Notificaciones en tiempo real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Evidencia en caso de disputas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Comunicación rápida y segura</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Reseñas y Reputación */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sistema de Reseñas y Reputación</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Las reseñas de otros compradores te ayudan a tomar decisiones informadas. Solo los compradores que han realizado una compra pueden dejar reseñas verificadas.
              </p>
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-2">Cómo Funciona</h3>
                <ul className="space-y-2 text-orange-800 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Las reseñas verificadas provienen de compradores que completaron una compra</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Puedes ver el promedio de calificaciones y leer comentarios detallados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Las reseñas ayudan a identificar vendedores confiables</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recomendaciones para Compras Seguras</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Antes de Comprar</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Revisa las reseñas y calificaciones del vendedor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Verifica que el vendedor tenga el sello "Vendedor Verificado"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Lee la descripción del producto cuidadosamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Contacta al vendedor para aclarar dudas sobre envío, devoluciones o el producto</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Revisa las políticas de devolución del vendedor</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Después de Comprar</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Guarda todos los mensajes y confirmaciones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Verifica el producto al recibirlo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Si hay algún problema, contacta al vendedor primero</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Si no hay respuesta en 48h, abre un ticket de soporte</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Deja una reseña honesta para ayudar a otros compradores</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacidad y Seguridad */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacidad y Seguridad de Datos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Todos los documentos de verificación de vendedores se almacenan de forma segura y privada. Solo nuestro equipo de administración tiene acceso a esta información, y se utiliza exclusivamente para verificación.
              </p>
              <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">Compromiso con tu Privacidad</h3>
                <ul className="space-y-2 text-indigo-800 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Documentos almacenados en buckets privados y seguros</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Acceso restringido solo a personal autorizado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Derecho a solicitar eliminación de datos personales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Cumplimiento con normativas de protección de datos</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Link
                    href="/privacidad"
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm underline"
                  >
                    Lee nuestra política de privacidad completa →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Tienes alguna pregunta?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Nuestro equipo de soporte está aquí para ayudarte. Contáctanos si tienes dudas sobre cómo protegemos tus compras o si necesitas asistencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/support"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <MessageSquare className="w-5 h-5" />
              Contactar Soporte
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium"
            >
              <FileText className="w-5 h-5" />
              Ver Preguntas Frecuentes
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


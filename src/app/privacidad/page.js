"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Privacidad() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--brand-blue)' }}>
            Aviso de Privacidad
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                1. Responsable del Tratamiento de Datos
              </h2>
              <p className="mb-4">
                Mascottaz, con domicilio en México, es responsable del tratamiento de tus datos 
                personales. Este aviso describe cómo recopilamos, utilizamos, almacenamos y 
                protegemos tu información personal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                2. Información que Recopilamos
              </h2>
              <p className="mb-4">Recopilamos los siguientes tipos de información:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Información de identificación:</strong> nombre, dirección de correo electrónico, número de teléfono</li>
                <li><strong>Información de facturación:</strong> dirección, código postal, información de pago</li>
                <li><strong>Información de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas</li>
                <li><strong>Información de compras:</strong> historial de pedidos, productos comprados</li>
                <li><strong>Información de preferencias:</strong> intereses, preferencias de productos</li>
                <li><strong>Documentos de verificación (solo vendedores):</strong> INE (frente y reverso), comprobante de domicilio, selfie con INE</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                3. Uso de la Información
              </h2>
              <p className="mb-4">Utilizamos tu información personal para los siguientes fines:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Procesar y completar tus pedidos</li>
                <li>Comunicarnos contigo sobre tu cuenta y pedidos</li>
                <li>Enviar promociones, ofertas y actualizaciones (con tu consentimiento)</li>
                <li>Mejorar nuestros productos y servicios</li>
                <li>Personalizar tu experiencia en el sitio web</li>
                <li>Cumplir con obligaciones legales</li>
                <li>Prevenir fraudes y garantizar la seguridad</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                4. Compartir Información
              </h2>
              <p className="mb-4">
                No vendemos ni alquilamos tu información personal a terceros. Podemos compartir 
                tu información únicamente en las siguientes circunstancias:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Con proveedores de servicios que nos ayudan a operar nuestro negocio (procesadores de pago, servicios de envío)</li>
                <li>Cuando sea requerido por ley o autoridades competentes</li>
                <li>Para proteger nuestros derechos, propiedad o seguridad</li>
                <li>En caso de una fusión, adquisición o venta de activos (con previo aviso)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                5. Cookies y Tecnologías Similares
              </h2>
              <p className="mb-4">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar 
                el tráfico del sitio y personalizar el contenido. Puedes configurar tu navegador 
                para rechazar cookies, aunque esto puede afectar algunas funcionalidades del sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                6. Seguridad de los Datos
              </h2>
              <p className="mb-4">
                Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger 
                tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. 
                Sin embargo, ningún método de transmisión por Internet es 100% seguro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                6.1. Documentos de Verificación de Vendedores
              </h2>
              <p className="mb-4">
                Para vendedores que solicitan verificación, recopilamos y almacenamos documentos de identificación 
                (INE frente y reverso, comprobante de domicilio, y selfie con INE) con el único propósito de 
                verificar la identidad y prevenir fraudes.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">Almacenamiento y Acceso</h3>
                <ul className="list-disc pl-6 space-y-2 text-blue-800 text-sm">
                  <li>Los documentos se almacenan en <strong>buckets privados y seguros</strong> en Supabase Storage</li>
                  <li>No se generan URLs públicas para estos documentos</li>
                  <li>El acceso está <strong>restringido exclusivamente a administradores autorizados</strong> de Mascottaz</li>
                  <li>Los documentos solo se acceden mediante URLs firmadas temporales generadas por el sistema de administración</li>
                  <li>Ningún usuario externo, incluyendo otros vendedores o compradores, puede acceder a estos documentos</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-green-900 mb-2">Uso y Confidencialidad</h3>
                <ul className="list-disc pl-6 space-y-2 text-green-800 text-sm">
                  <li>Los documentos se utilizan <strong>únicamente para verificación de identidad</strong> y prevención de fraudes</li>
                  <li>No compartimos estos documentos con terceros, excepto cuando sea requerido por ley</li>
                  <li>Después de la verificación, los documentos se mantienen almacenados de forma segura para registro y auditoría</li>
                  <li>Tienes derecho a solicitar la eliminación de tus documentos de verificación en cualquier momento</li>
                </ul>
              </div>
              <p className="mb-4">
                Para solicitar la eliminación de tus documentos de verificación, puedes contactarnos a través de 
                nuestro <Link href="/support" className="text-blue-600 hover:text-blue-700 underline">servicio de soporte</Link> o 
                enviar un ticket de soporte indicando tu solicitud.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                7. Tus Derechos
              </h2>
              <p className="mb-4">Tienes derecho a:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Acceder a tus datos personales</li>
                <li>Rectificar datos inexactos o incompletos</li>
                <li>Cancelar el tratamiento de tus datos (derecho al olvido)</li>
                <li>Oponerte al tratamiento de tus datos</li>
                <li>Revocar tu consentimiento en cualquier momento</li>
                <li>Limitar el uso o divulgación de tus datos</li>
              </ul>
              <p className="mb-4">
                Para ejercer estos derechos, contáctanos a través de nuestro servicio de atención al cliente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                8. Retención de Datos
              </h2>
              <p className="mb-4">
                Conservaremos tu información personal durante el tiempo necesario para cumplir con 
                los fines descritos en este aviso, a menos que la ley requiera o permita un período 
                de retención más largo.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Documentos de Verificación</h3>
                <p className="text-yellow-800 text-sm mb-2">
                  Los documentos de verificación de vendedores (INE, comprobante de domicilio, selfie) 
                  se conservan mientras tu cuenta de vendedor esté activa y durante un período adicional 
                  de 2 años después de la desactivación o eliminación de tu cuenta, para fines de 
                  auditoría y cumplimiento legal. Después de este período, los documentos se eliminan 
                  permanentemente de nuestros sistemas.
                </p>
                <p className="text-yellow-800 text-sm">
                  Puedes solicitar la eliminación anticipada de tus documentos en cualquier momento 
                  a través de nuestro <Link href="/support" className="underline font-medium">servicio de soporte</Link>, 
                  sujeto a las obligaciones legales que puedan aplicarse.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                9. Menores de Edad
              </h2>
              <p className="mb-4">
                Nuestro sitio web no está dirigido a menores de 18 años. No recopilamos intencionalmente 
                información personal de menores. Si descubrimos que hemos recopilado información de un 
                menor, la eliminaremos de nuestros sistemas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                10. Cambios a este Aviso
              </h2>
              <p className="mb-4">
                Podemos actualizar este Aviso de Privacidad ocasionalmente. Te notificaremos sobre 
                cambios significativos publicando el nuevo aviso en esta página y actualizando la 
                fecha de "Última actualización".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                11. Contacto
              </h2>
              <p className="mb-4">
                Si tienes preguntas o inquietudes sobre este Aviso de Privacidad o sobre cómo 
                manejamos tus datos personales, puedes contactarnos a través de nuestro 
                <Link href="/support" className="text-blue-600 hover:text-blue-700 underline"> servicio de atención al cliente</Link>.
              </p>
              <p className="mb-4">
                Para solicitar la eliminación de tus documentos de verificación o ejercer tus derechos 
                de acceso, rectificación, cancelación u oposición (ARCO), puedes crear un ticket de 
                soporte indicando tu solicitud específica.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Última actualización: Diciembre 2025
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


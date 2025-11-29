"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function TerminosCondiciones() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--brand-blue)' }}>
            Términos y Condiciones
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                1. Aceptación de los Términos
              </h2>
              <p className="mb-4">
                Al acceder y utilizar el sitio web de Mascottaz, aceptas estar sujeto a estos Términos 
                y Condiciones de Uso. Si no estás de acuerdo con alguna parte de estos términos, 
                no debes utilizar nuestro sitio web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                2. Uso del Sitio Web
              </h2>
              <p className="mb-4">El uso de este sitio web está sujeto a las siguientes condiciones:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Debes ser mayor de 18 años o tener el consentimiento de un tutor legal</li>
                <li>La información proporcionada debe ser veraz y actualizada</li>
                <li>No puedes utilizar el sitio para fines ilegales o no autorizados</li>
                <li>No puedes intentar acceder a áreas restringidas del sitio</li>
                <li>No puedes interferir con el funcionamiento del sitio web</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                3. Registro de Cuenta
              </h2>
              <p className="mb-4">
                Para realizar compras en Mascottaz, deberás crear una cuenta proporcionando información 
                precisa y completa. Eres responsable de mantener la confidencialidad de tu contraseña 
                y de todas las actividades que ocurran bajo tu cuenta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                4. Productos y Precios
              </h2>
              <p className="mb-4">
                Nos esforzamos por proporcionar información precisa sobre nuestros productos. Sin embargo, 
                no garantizamos que las descripciones, precios u otra información del sitio sean 
                completamente precisas, completas, confiables, actuales o libres de errores.
              </p>
              <p className="mb-4">
                Nos reservamos el derecho de corregir cualquier error, inexactitud u omisión y de 
                cambiar o actualizar información en cualquier momento sin previo aviso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                5. Pedidos y Pagos
              </h2>
              <p className="mb-4">
                Al realizar un pedido, haces una oferta de compra que está sujeta a nuestra aceptación. 
                Nos reservamos el derecho de rechazar o cancelar cualquier pedido por cualquier razón, 
                incluyendo disponibilidad de productos, errores en la descripción o precio del producto, 
                o errores en tu pedido.
              </p>
              <p className="mb-4">
                Todos los precios están en pesos mexicanos (MXN) e incluyen IVA cuando corresponda. 
                Los métodos de pago aceptados se muestran durante el proceso de compra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                6. Propiedad Intelectual
              </h2>
              <p className="mb-4">
                Todo el contenido de este sitio web, incluyendo textos, gráficos, logotipos, iconos, 
                imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad 
                de Mascottaz o de sus proveedores de contenido y está protegido por las leyes de 
                propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                7. Limitación de Responsabilidad
              </h2>
              <p className="mb-4">
                Mascottaz no será responsable de ningún daño directo, indirecto, incidental, especial 
                o consecuente que resulte del uso o la imposibilidad de usar este sitio web o los 
                productos adquiridos a través del mismo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                8. Modificaciones
              </h2>
              <p className="mb-4">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los 
                cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. 
                Es tu responsabilidad revisar periódicamente estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                9. Ley Aplicable
              </h2>
              <p className="mb-4">
                Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier 
                disputa relacionada con estos términos será resuelta en los tribunales competentes 
                de México.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                10. Contacto
              </h2>
              <p className="mb-4">
                Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos a través 
                de nuestro servicio de atención al cliente.
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


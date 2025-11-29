"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Pagos() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--brand-blue)' }}>
            Política de Pagos
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-800 font-semibold">
                Importante: Mascottaz es una plataforma marketplace. Los pagos son gestionados directamente entre comprador y vendedor.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                1. Sobre Nuestro Modelo de Marketplace
              </h2>
              <p className="mb-4">
                Mascottaz funciona como una plataforma de encuentro entre compradores y vendedores. 
                <strong> No procesamos, gestionamos ni garantizamos pagos directamente</strong>. 
                Cada transacción es un acuerdo directo entre el comprador y el vendedor, quienes 
                deben acordar el método de pago y los términos de la transacción.
              </p>
              <p className="mb-4">
                Esto significa que los métodos de pago aceptados, los términos de pago (contado, 
                parcial, etc.), y cualquier detalle relacionado con el pago deben acordarse 
                directamente entre las partes involucradas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                2. Métodos de Pago
              </h2>
              <p className="mb-4">
                Los métodos de pago aceptados varían según cada vendedor. Algunos vendedores pueden 
                aceptar:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Transferencias bancarias</li>
                <li>Depósitos en efectivo</li>
                <li>Pagos con tarjeta (si el vendedor tiene terminal o procesador)</li>
                <li>Pagos en efectivo al recibir (contra entrega)</li>
                <li>Plataformas de pago digital (PayPal, Mercado Pago, etc.)</li>
                <li>Otros métodos acordados entre las partes</li>
              </ul>
              <p className="mb-4">
                Es <strong>muy importante</strong> que acuerdes el método de pago con el vendedor 
                antes de finalizar la compra, ya que no todos los vendedores aceptan los mismos métodos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                3. Responsabilidades del Vendedor
              </h2>
              <p className="mb-4">Cada vendedor debe:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Especificar claramente los métodos de pago que acepta</li>
                <li>Proporcionar información necesaria para realizar el pago (cuentas bancarias, datos de contacto, etc.)</li>
                <li>Confirmar la recepción del pago de manera oportuna</li>
                <li>Comunicar claramente los términos de pago (total, parcial, plazos, etc.)</li>
                <li>Mantener transparencia en todas las transacciones</li>
                <li>Proporcionar comprobantes de pago cuando sea necesario</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                4. Responsabilidades del Comprador
              </h2>
              <p className="mb-4">Como comprador, es importante que:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Acuerdes el método de pago con el vendedor antes de comprar</li>
                <li>Realices el pago según los términos acordados</li>
                <li>Conserves comprobantes de pago (transferencias, depósitos, etc.)</li>
                <li>Comuniques al vendedor cuando hayas realizado el pago</li>
                <li>Verifiques que estás enviando el pago a la cuenta o método correcto del vendedor</li>
                <li>Mantengas comunicación clara durante todo el proceso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                5. Seguridad en los Pagos
              </h2>
              <p className="mb-4">
                Aunque no procesamos pagos directamente, recomendamos encarecidamente:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Verificar la identidad del vendedor antes de realizar cualquier pago</li>
                <li>Usar métodos de pago que ofrezcan protección al comprador cuando sea posible</li>
                <li>No compartir información sensible de tarjetas o cuentas bancarias por canales no seguros</li>
                <li>Conservar todos los comprobantes de pago</li>
                <li>Ser cauteloso con ofertas que parezcan demasiado buenas para ser verdad</li>
                <li>Contactar al vendedor a través de los canales oficiales de la plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                6. Disputas de Pago
              </h2>
              <p className="mb-4">
                Si experimentas algún problema relacionado con pagos (pagos no recibidos, montos 
                incorrectos, problemas con métodos de pago, etc.), te recomendamos:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Contactar directamente al vendedor en primer lugar</li>
                <li>Proporcionar comprobantes de pago si es necesario</li>
                <li>Dar al vendedor un tiempo razonable para verificar y responder</li>
                <li>Si no obtienes respuesta, puedes contactarnos para que intentemos facilitar la comunicación</li>
                <li>En casos de fraude, contactar a tu banco o institución financiera y las autoridades correspondientes</li>
              </ol>
              <p className="mb-4">
                <strong>Importante:</strong> Mascottaz puede ayudar a facilitar la comunicación entre 
                comprador y vendedor, pero no podemos procesar reembolsos, garantizar resultados 
                específicos, ni intervenir en disputas financieras directas, ya que no gestionamos 
                los pagos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                7. Apoyo de la Plataforma
              </h2>
              <p className="mb-4">
                Aunque no gestionamos pagos directamente, estamos aquí para apoyarte. Si tienes 
                dificultades relacionadas con pagos, podemos:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Facilitar la comunicación entre comprador y vendedor</li>
                <li>Clarificar información sobre métodos de pago del vendedor</li>
                <li>Proporcionar orientación sobre mejores prácticas de seguridad</li>
                <li>Mediar en disputas cuando sea posible</li>
              </ul>
              <p className="mb-4">
                Sin embargo, no podemos procesar pagos, garantizar transacciones, ni asumir 
                responsabilidad por decisiones o acciones de los vendedores o compradores.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                8. Fase Inicial de la Plataforma
              </h2>
              <p className="mb-4">
                Estas políticas reflejan el modelo actual de Mascottaz durante su fase inicial. 
                Estamos comprometidos con mejorar continuamente la experiencia de compra y venta, 
                y es posible que en el futuro implementemos sistemas de pago integrados y servicios 
                adicionales de protección al comprador. Te mantendremos informado sobre cualquier 
                cambio significativo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                9. Contacto
              </h2>
              <p className="mb-4">
                Si tienes preguntas sobre esta política o necesitas asistencia relacionada con pagos, 
                nuestro equipo de atención al cliente está disponible para ayudarte.
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


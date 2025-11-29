"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Devoluciones() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--brand-blue)' }}>
            Política de Devoluciones
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-800 font-semibold">
                Importante: Mascottaz es una plataforma marketplace. Las devoluciones y reembolsos son gestionados directamente por cada vendedor.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                1. Sobre Nuestro Modelo de Marketplace
              </h2>
              <p className="mb-4">
                Mascottaz funciona como una plataforma de encuentro entre compradores y vendedores. 
                <strong> No gestionamos, procesamos ni garantizamos devoluciones o reembolsos</strong>, 
                ya que cada vendedor establece sus propias políticas de devolución y es responsable 
                de gestionarlas directamente con el comprador.
              </p>
              <p className="mb-4">
                Esto significa que los plazos para devoluciones, condiciones de aceptación, procesos 
                de devolución y reembolsos deben acordarse directamente entre el comprador y el vendedor, 
                siguiendo las políticas que cada vendedor haya establecido.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                2. Políticas Individuales de Vendedores
              </h2>
              <p className="mb-4">
                Cada vendedor en nuestra plataforma puede tener políticas de devolución diferentes. 
                Es <strong>muy importante</strong> que revises las políticas específicas del vendedor 
                antes de realizar una compra. Estas políticas pueden incluir:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Plazos para solicitar devoluciones (pueden variar de 7 a 30 días o más)</li>
                <li>Condiciones para aceptar devoluciones (producto sin usar, con empaque original, etc.)</li>
                <li>Productos que no aceptan devoluciones</li>
                <li>Procesos específicos para solicitar devoluciones</li>
                <li>Responsabilidad de costos de envío de devolución</li>
                <li>Tiempos estimados para procesar reembolsos</li>
              </ul>
              <p className="mb-4">
                Si un vendedor no especifica claramente sus políticas, te recomendamos contactarlo 
                directamente antes de comprar para aclarar cualquier duda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                3. Responsabilidades del Vendedor
              </h2>
              <p className="mb-4">Cada vendedor debe:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Establecer y publicar claramente sus políticas de devolución</li>
                <li>Proporcionar información de contacto para gestionar devoluciones</li>
                <li>Responder oportunamente a solicitudes de devolución</li>
                <li>Procesar devoluciones y reembolsos según sus políticas establecidas</li>
                <li>Comunicar claramente cualquier condición especial o restricción</li>
                <li>Mantener transparencia en todo el proceso de devolución</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                4. Responsabilidades del Comprador
              </h2>
              <p className="mb-4">Como comprador, es importante que:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Leas y comprendas las políticas de devolución del vendedor antes de comprar</li>
                <li>Contactes directamente al vendedor para iniciar cualquier proceso de devolución</li>
                <li>Respetes las condiciones establecidas por el vendedor (plazos, estado del producto, etc.)</li>
                <li>Proporciones información clara sobre el motivo de la devolución</li>
                <li>Empaques el producto de forma segura si se requiere devolución</li>
                <li>Mantengas comunicación clara y respetuosa con el vendedor</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                5. Proceso de Devolución
              </h2>
              <p className="mb-4">Aunque los procesos pueden variar según el vendedor, generalmente incluyen:</p>
              <ol className="list-decimal pl-6 space-y-3 mb-4">
                <li>
                  <strong>Contactar al vendedor:</strong> Comunícate directamente con el vendedor dentro 
                  del plazo establecido en sus políticas para solicitar la devolución.
                </li>
                <li>
                  <strong>Proporcionar información:</strong> El vendedor puede solicitar información 
                  como número de pedido, motivo de devolución, fotos del producto, etc.
                </li>
                <li>
                  <strong>Autorización:</strong> El vendedor revisará tu solicitud y te indicará si 
                  procede según sus políticas.
                </li>
                <li>
                  <strong>Enviar el producto:</strong> Si se autoriza, deberás enviar el producto de 
                  vuelta según las instrucciones del vendedor (dirección, método de envío, etc.).
                </li>
                <li>
                  <strong>Reembolso:</strong> Una vez que el vendedor reciba y verifique el producto, 
                  procesará el reembolso según sus políticas y métodos de pago acordados.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                6. Costos de Devolución
              </h2>
              <p className="mb-4">
                Los costos de envío de devolución son determinados por cada vendedor según sus políticas. 
                Algunos vendedores pueden:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Cubrir el costo completo del envío de devolución</li>
                <li>Compartir el costo con el comprador</li>
                <li>Requerir que el comprador cubra el costo completo</li>
                <li>Tener políticas diferentes según el motivo de la devolución</li>
              </ul>
              <p className="mb-4">
                Es importante aclarar estos costos con el vendedor antes de iniciar el proceso de devolución.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                7. Reembolsos
              </h2>
              <p className="mb-4">
                Los reembolsos son procesados directamente por cada vendedor. Los tiempos y métodos 
                de reembolso pueden variar según:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Las políticas del vendedor</li>
                <li>El método de pago original utilizado</li>
                <li>El tiempo que tome al vendedor verificar el producto devuelto</li>
                <li>Los procesos bancarios o de procesamiento de pagos</li>
              </ul>
              <p className="mb-4">
                <strong>Mascottaz no procesa reembolsos directamente</strong> y no puede garantizar 
                tiempos específicos, ya que esto depende completamente del vendedor y sus procesos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                8. Productos Defectuosos o Incorrectos
              </h2>
              <p className="mb-4">
                Si recibes un producto defectuoso o que no corresponde a lo que compraste, contacta 
                inmediatamente al vendedor. La mayoría de los vendedores tienen políticas especiales 
                para estos casos que pueden incluir:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Reemplazo inmediato sin costo adicional</li>
                <li>Reembolso completo incluyendo costos de envío</li>
                <li>Procesos acelerados de devolución</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                9. Apoyo de la Plataforma
              </h2>
              <p className="mb-4">
                Aunque no gestionamos devoluciones directamente, estamos aquí para apoyarte. Si tienes 
                dificultades para contactar a un vendedor o necesitas asistencia en una disputa relacionada 
                con devoluciones, podemos:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Facilitar la comunicación entre comprador y vendedor</li>
                <li>Clarificar las políticas del vendedor</li>
                <li>Mediar en disputas cuando sea posible</li>
                <li>Proporcionar orientación sobre el proceso</li>
              </ul>
              <p className="mb-4">
                <strong>Importante:</strong> Mascottaz puede ayudar a facilitar la comunicación, pero 
                no podemos garantizar resultados específicos, procesar reembolsos por cuenta propia, ni 
                obligar a un vendedor a aceptar una devolución que no esté dentro de sus políticas establecidas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                10. Fase Inicial de la Plataforma
              </h2>
              <p className="mb-4">
                Estas políticas reflejan el modelo actual de Mascottaz durante su fase inicial. 
                Estamos comprometidos con mejorar continuamente la experiencia de compra y venta, 
                y es posible que en el futuro implementemos servicios adicionales de gestión de devoluciones. 
                Te mantendremos informado sobre cualquier cambio significativo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                11. Contacto
              </h2>
              <p className="mb-4">
                Si tienes preguntas sobre esta política o necesitas asistencia relacionada con una devolución, 
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

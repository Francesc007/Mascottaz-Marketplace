"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PoliticaEnvio() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--brand-blue)' }}>
            Política de Envío
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-800 font-semibold">
                Importante: Mascottaz es una plataforma marketplace. Los envíos son gestionados directamente por cada vendedor.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                1. Sobre Nuestro Modelo de Marketplace
              </h2>
              <p className="mb-4">
                Mascottaz funciona como una plataforma de encuentro entre compradores y vendedores. 
                <strong> No gestionamos, controlamos ni garantizamos los envíos</strong>, ya que cada 
                vendedor es responsable de coordinar directamente con el comprador todos los aspectos 
                relacionados con la entrega de sus productos.
              </p>
              <p className="mb-4">
                Esto significa que los tiempos de entrega, costos de envío, métodos de envío y cualquier 
                detalle logístico deben acordarse directamente entre el comprador y el vendedor antes o 
                después de realizar la compra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                2. Responsabilidades del Vendedor
              </h2>
              <p className="mb-4">Cada vendedor en nuestra plataforma debe:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Proporcionar información clara y precisa sobre sus métodos de envío disponibles</li>
                <li>Especificar los tiempos estimados de entrega para cada método</li>
                <li>Indicar los costos de envío o cómo se calcularán</li>
                <li>Mantener información de contacto actualizada para coordinar envíos</li>
                <li>Responder oportunamente a las consultas de los compradores sobre envíos</li>
                <li>Proporcionar números de guía de rastreo cuando corresponda</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                3. Responsabilidades del Comprador
              </h2>
              <p className="mb-4">Como comprador, es importante que:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Revises la información de envío proporcionada por el vendedor antes de comprar</li>
                <li>Te pongas en contacto con el vendedor después de la compra para coordinar el envío</li>
                <li>Proporciones una dirección de entrega completa y correcta</li>
                <li>Estés disponible para recibir el paquete o coordines con el vendedor</li>
                <li>Verifiques el estado del paquete al momento de recibirlo</li>
                <li>Comuniques cualquier problema de entrega directamente al vendedor</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                4. Tiempos de Entrega
              </h2>
              <p className="mb-4">
                <strong>Mascottaz no controla ni garantiza los tiempos de entrega</strong>, ya que estos 
                dependen completamente del vendedor y del método de envío que elijan. Los tiempos pueden 
                variar significativamente según:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>El método de envío seleccionado por el vendedor</li>
                <li>La ubicación del vendedor y del comprador</li>
                <li>La empresa de paquetería utilizada</li>
                <li>Condiciones climáticas o situaciones extraordinarias</li>
                <li>El tiempo de procesamiento del vendedor</li>
              </ul>
              <p className="mb-4">
                Te recomendamos consultar directamente con el vendedor sobre los tiempos estimados antes 
                de realizar tu compra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                5. Costos de Envío
              </h2>
              <p className="mb-4">
                Los costos de envío son determinados y gestionados directamente por cada vendedor. 
                Estos costos pueden variar según:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>El peso y dimensiones del producto</li>
                <li>La distancia entre el vendedor y el comprador</li>
                <li>El método de envío seleccionado</li>
                <li>La empresa de paquetería utilizada</li>
              </ul>
              <p className="mb-4">
                Es importante que acuerdes el costo del envío con el vendedor antes de finalizar la compra, 
                ya que este costo puede no estar incluido en el precio del producto mostrado en la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                6. Seguimiento de Envíos
              </h2>
              <p className="mb-4">
                El seguimiento de envíos es responsabilidad del vendedor. Si el vendedor utiliza un 
                servicio de paquetería que proporciona números de guía, debería compartir esta información 
                contigo. Si no recibes información de seguimiento, contacta directamente al vendedor.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                7. Problemas con Envíos
              </h2>
              <p className="mb-4">
                Si experimentas algún problema con tu envío (retrasos, paquetes dañados, entregas 
                incorrectas, etc.), te recomendamos:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Contactar directamente al vendedor en primer lugar</li>
                <li>Proporcionar detalles específicos del problema (fotos si aplica)</li>
                <li>Dar al vendedor un tiempo razonable para responder y resolver</li>
                <li>Si no obtienes respuesta, puedes contactarnos para que intentemos facilitar la comunicación</li>
              </ol>
              <p className="mb-4">
                <strong>Importante:</strong> Mascottaz puede ayudar a facilitar la comunicación entre 
                comprador y vendedor, pero no podemos garantizar soluciones ni hacer reembolsos por 
                cuenta propia, ya que no gestionamos los envíos directamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                8. Apoyo de la Plataforma
              </h2>
              <p className="mb-4">
                Aunque no gestionamos envíos directamente, estamos aquí para apoyarte. Si tienes 
                dificultades para contactar a un vendedor o necesitas asistencia en una disputa relacionada 
                con envíos, podemos:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Facilitar la comunicación entre comprador y vendedor</li>
                <li>Clarificar información sobre políticas del vendedor</li>
                <li>Mediar en disputas cuando sea posible</li>
                <li>Proporcionar orientación sobre mejores prácticas</li>
              </ul>
              <p className="mb-4">
                Sin embargo, no podemos garantizar resultados específicos ni asumir responsabilidad 
                por decisiones o acciones de los vendedores.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                9. Fase Inicial de la Plataforma
              </h2>
              <p className="mb-4">
                Estas políticas reflejan el modelo actual de Mascottaz durante su fase inicial. 
                Estamos comprometidos con mejorar continuamente la experiencia de compra y venta, 
                y es posible que en el futuro implementemos servicios adicionales de gestión de envíos. 
                Te mantendremos informado sobre cualquier cambio significativo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                10. Contacto
              </h2>
              <p className="mb-4">
                Si tienes preguntas sobre esta política o necesitas asistencia relacionada con un envío, 
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

"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Garantias() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--brand-blue)' }}>
            Política de Garantías
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-800 font-semibold">
                Importante: Mascottaz es una plataforma marketplace. Las garantías son gestionadas directamente por cada vendedor o el fabricante.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                1. Sobre Nuestro Modelo de Marketplace
              </h2>
              <p className="mb-4">
                Mascottaz funciona como una plataforma de encuentro entre compradores y vendedores. 
                <strong> No ofrecemos garantías directas sobre los productos vendidos</strong>, ya que 
                cada vendedor es responsable de los productos que ofrece y puede tener políticas de 
                garantía diferentes según el tipo de producto y el fabricante.
              </p>
              <p className="mb-4">
                Las garantías pueden venir de dos fuentes principales:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Garantía del fabricante:</strong> Muchos productos incluyen garantías del fabricante que son válidas independientemente del vendedor</li>
                <li><strong>Garantía del vendedor:</strong> Algunos vendedores ofrecen garantías adicionales o políticas de satisfacción propias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                2. Garantías del Fabricante
              </h2>
              <p className="mb-4">
                Muchos productos vendidos en nuestra plataforma incluyen garantías del fabricante. 
                Estas garantías son gestionadas directamente por el fabricante y no por Mascottaz 
                ni por el vendedor. Para hacer válida una garantía del fabricante, generalmente necesitarás:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>El comprobante de compra original</li>
                <li>La documentación de garantía del producto (manual, tarjeta de garantía, etc.)</li>
                <li>Contactar directamente al fabricante según sus procedimientos</li>
                <li>Cumplir con los términos y condiciones específicos de la garantía del fabricante</li>
              </ul>
              <p className="mb-4">
                Te recomendamos conservar toda la documentación del producto y el comprobante de 
                compra para hacer válida cualquier garantía del fabricante.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                3. Políticas de Garantía de Vendedores
              </h2>
              <p className="mb-4">
                Algunos vendedores pueden ofrecer garantías adicionales o políticas de satisfacción 
                propias. Estas políticas pueden variar significativamente entre vendedores. Es 
                <strong> muy importante</strong> que revises las políticas específicas del vendedor 
                antes de realizar una compra, ya que pueden incluir:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Plazos de garantía (pueden variar de días a meses)</li>
                <li>Cobertura de la garantía (defectos, funcionamiento, satisfacción, etc.)</li>
                <li>Procesos para hacer válida la garantía</li>
                <li>Opciones disponibles (reparación, reemplazo, reembolso)</li>
                <li>Condiciones y exclusiones</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                4. Responsabilidades del Vendedor
              </h2>
              <p className="mb-4">Cada vendedor debe:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Proporcionar información clara sobre las garantías disponibles (del fabricante o propias)</li>
                <li>Incluir documentación de garantía cuando corresponda</li>
                <li>Honrar cualquier garantía o política de satisfacción que haya ofrecido</li>
                <li>Proporcionar información de contacto para gestionar garantías</li>
                <li>Responder oportunamente a solicitudes relacionadas con garantías</li>
                <li>Mantener transparencia sobre qué está y qué no está cubierto</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                5. Responsabilidades del Comprador
              </h2>
              <p className="mb-4">Como comprador, es importante que:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Revisas las políticas de garantía del vendedor antes de comprar</li>
                <li>Conserves toda la documentación del producto (comprobantes, manuales, tarjetas de garantía)</li>
                <li>Contactes al vendedor o fabricante según corresponda si necesitas hacer válida una garantía</li>
                <li>Proporciones información clara sobre el problema que experimentas</li>
                <li>Respetes los plazos establecidos en las políticas de garantía</li>
                <li>Mantengas el producto en condiciones que no anulen la garantía (uso normal, sin modificaciones, etc.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                6. Productos Defectuosos o con Problemas
              </h2>
              <p className="mb-4">
                Si recibes un producto defectuoso o que presenta problemas, te recomendamos:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Contactar inmediatamente al vendedor para informar el problema</li>
                <li>Proporcionar detalles específicos y fotos si es necesario</li>
                <li>Revisar las políticas de garantía del vendedor para entender tus opciones</li>
                <li>Si el producto tiene garantía del fabricante, también puedes contactar directamente al fabricante</li>
                <li>Dar al vendedor un tiempo razonable para responder y resolver</li>
              </ol>
              <p className="mb-4">
                La mayoría de los vendedores tienen políticas especiales para productos defectuosos 
                que pueden incluir reemplazo inmediato, reembolso completo, o reparación según corresponda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                7. Limitaciones y Exclusiones
              </h2>
              <p className="mb-4">
                Las garantías generalmente no cubren:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Daños causados por mal uso, negligencia o accidentes</li>
                <li>Modificaciones no autorizadas al producto</li>
                <li>Desgaste normal del producto</li>
                <li>Daños causados por condiciones ambientales extremas</li>
                <li>Productos que han sido reparados por terceros no autorizados</li>
                <li>Pérdida o robo del producto</li>
              </ul>
              <p className="mb-4">
                Es importante leer cuidadosamente los términos y condiciones específicos de cada garantía 
                para entender qué está y qué no está cubierto.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                8. Apoyo de la Plataforma
              </h2>
              <p className="mb-4">
                Aunque no gestionamos garantías directamente, estamos aquí para apoyarte. Si tienes 
                dificultades relacionadas con garantías, podemos:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Facilitar la comunicación entre comprador y vendedor</li>
                <li>Clarificar las políticas de garantía del vendedor</li>
                <li>Proporcionar orientación sobre cómo hacer válida una garantía del fabricante</li>
                <li>Mediar en disputas relacionadas con garantías cuando sea posible</li>
              </ul>
              <p className="mb-4">
                <strong>Importante:</strong> Mascottaz puede ayudar a facilitar la comunicación, pero 
                no podemos garantizar resultados específicos, procesar reembolsos por cuenta propia, ni 
                obligar a un vendedor o fabricante a honrar una garantía que no esté dentro de sus 
                términos establecidos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                9. Fase Inicial de la Plataforma
              </h2>
              <p className="mb-4">
                Estas políticas reflejan el modelo actual de Mascottaz durante su fase inicial. 
                Estamos comprometidos con mejorar continuamente la experiencia de compra y venta, 
                y es posible que en el futuro implementemos programas adicionales de protección al 
                comprador. Te mantendremos informado sobre cualquier cambio significativo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                10. Contacto
              </h2>
              <p className="mb-4">
                Si tienes preguntas sobre esta política o necesitas asistencia relacionada con garantías, 
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


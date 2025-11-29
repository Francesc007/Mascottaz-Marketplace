"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Cookies() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--brand-blue)' }}>
            Política de Cookies
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                1. ¿Qué son las Cookies?
              </h2>
              <p className="mb-4">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando 
                visitas un sitio web. Estas cookies permiten que el sitio web recuerde tus acciones 
                y preferencias durante un período de tiempo, por lo que no tienes que volver a 
                configurarlas cada vez que regresas al sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                2. Tipos de Cookies que Utilizamos
              </h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-4" style={{ color: 'var(--brand-blue)' }}>
                Cookies Esenciales
              </h3>
              <p className="mb-4">
                Estas cookies son necesarias para el funcionamiento del sitio web. Permiten funciones 
                básicas como la navegación y el acceso a áreas seguras del sitio.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4" style={{ color: 'var(--brand-blue)' }}>
                Cookies de Rendimiento
              </h3>
              <p className="mb-4">
                Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio 
                web, recopilando información de forma anónima. Esto nos permite mejorar el funcionamiento 
                del sitio.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4" style={{ color: 'var(--brand-blue)' }}>
                Cookies de Funcionalidad
              </h3>
              <p className="mb-4">
                Estas cookies permiten que el sitio web recuerde las elecciones que haces (como tu nombre 
                de usuario, idioma o región) y proporcionan características mejoradas y más personales.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4" style={{ color: 'var(--brand-blue)' }}>
                Cookies de Publicidad
              </h3>
              <p className="mb-4">
                Estas cookies se utilizan para hacer que los mensajes publicitarios sean más relevantes 
                para ti. Realizan funciones como evitar que el mismo anuncio aparezca continuamente y 
                asegurar que los anuncios se muestren correctamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                3. Cookies de Terceros
              </h2>
              <p className="mb-4">
                Algunas cookies son colocadas por servicios de terceros que aparecen en nuestras páginas. 
                Estos terceros pueden incluir proveedores de análisis, redes publicitarias y plataformas 
                de redes sociales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                4. Gestión de Cookies
              </h2>
              <p className="mb-4">
                Puedes controlar y/o eliminar las cookies como desees. Puedes eliminar todas las cookies 
                que ya están en tu dispositivo y puedes configurar la mayoría de los navegadores para 
                evitar que se coloquen.
              </p>
              <p className="mb-4">
                Sin embargo, si haces esto, es posible que tengas que ajustar manualmente algunas 
                preferencias cada vez que visites un sitio y que algunos servicios y funcionalidades 
                no funcionen.
              </p>
              <p className="mb-4">
                Para obtener más información sobre cómo gestionar las cookies en diferentes navegadores, 
                consulta la sección de ayuda de tu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                5. Consentimiento
              </h2>
              <p className="mb-4">
                Al continuar navegando en nuestro sitio web, aceptas el uso de cookies de acuerdo con 
                esta política. Si no estás de acuerdo, puedes desactivar las cookies en la configuración 
                de tu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                6. Cambios a esta Política
              </h2>
              <p className="mb-4">
                Podemos actualizar esta Política de Cookies ocasionalmente. Te recomendamos revisar 
                esta página periódicamente para estar informado sobre cómo utilizamos las cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                7. Contacto
              </h2>
              <p className="mb-4">
                Si tienes preguntas sobre nuestra Política de Cookies, puedes contactarnos a través 
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


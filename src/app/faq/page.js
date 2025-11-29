"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [supportStatus, setSupportStatus] = useState("");

  const faqs = [
    {
      category: "Pedidos y Compras",
      questions: [
        {
          q: "¿Cómo realizo un pedido?",
          a: "Para realizar un pedido, navega por nuestro catálogo, selecciona los productos que deseas y agrégalos al carrito. Al proceder al checkout, deberás ponerte en contacto con el vendedor para acordar los detalles de pago y envío. Recuerda que Mascottaz es una plataforma marketplace, por lo que cada transacción se coordina directamente entre comprador y vendedor."
        },
        {
          q: "¿Qué métodos de pago aceptan?",
          a: "Los métodos de pago varían según cada vendedor. Algunos pueden aceptar transferencias bancarias, depósitos, pagos con tarjeta, pagos en efectivo al recibir, o plataformas de pago digital. Es importante que acuerdes el método de pago con el vendedor antes de finalizar la compra, ya que no todos los vendedores aceptan los mismos métodos."
        },
        {
          q: "¿Puedo modificar o cancelar mi pedido?",
          a: "La posibilidad de modificar o cancelar un pedido depende de las políticas del vendedor y del estado de la transacción. Te recomendamos contactar directamente al vendedor lo antes posible si necesitas hacer cambios. Mascottaz puede ayudar a facilitar la comunicación, pero no podemos garantizar modificaciones o cancelaciones, ya que esto depende del vendedor."
        },
        {
          q: "¿Cómo sé si mi pedido fue confirmado?",
          a: "Después de agregar productos al carrito, deberás contactar al vendedor para confirmar la compra y acordar los detalles de pago y envío. El vendedor te confirmará cuando haya recibido tu pago y procesado tu pedido. Mantén la comunicación con el vendedor para estar al tanto del estado de tu compra."
        }
      ]
    },
    {
      category: "Envíos",
      questions: [
        {
          q: "¿Cuánto tiempo tarda en llegar mi pedido?",
          a: "Mascottaz no controla ni garantiza los tiempos de entrega, ya que estos dependen completamente del vendedor y del método de envío que elijan. Los tiempos pueden variar según la ubicación del vendedor, el método de envío seleccionado, y la empresa de paquetería utilizada. Te recomendamos consultar directamente con el vendedor sobre los tiempos estimados antes de realizar tu compra."
        },
        {
          q: "¿Hacen envíos a todo México?",
          a: "La cobertura de envíos depende de cada vendedor y los métodos de envío que ofrezcan. Algunos vendedores pueden enviar a toda la República Mexicana, mientras que otros pueden tener limitaciones geográficas. Es importante verificar con el vendedor si realiza envíos a tu ubicación antes de comprar."
        },
        {
          q: "¿Cuánto cuesta el envío?",
          a: "Los costos de envío son determinados y gestionados directamente por cada vendedor. Estos costos pueden variar según el peso, dimensiones, distancia y método de envío. Es importante que acuerdes el costo del envío con el vendedor antes de finalizar la compra, ya que este costo puede no estar incluido en el precio del producto mostrado en la plataforma."
        },
        {
          q: "¿Puedo rastrear mi pedido?",
          a: "El seguimiento de envíos es responsabilidad del vendedor. Si el vendedor utiliza un servicio de paquetería que proporciona números de guía, debería compartir esta información contigo. Si no recibes información de seguimiento, contacta directamente al vendedor. Mascottaz no gestiona el seguimiento de envíos directamente."
        }
      ]
    },
    {
      category: "Devoluciones y Reembolsos",
      questions: [
        {
          q: "¿Cuánto tiempo tengo para devolver un producto?",
          a: "Los plazos para devoluciones varían según cada vendedor. Cada vendedor puede tener políticas diferentes (7 días, 30 días, etc.). Es muy importante que revises las políticas específicas de devolución del vendedor antes de realizar una compra. Si un vendedor no especifica claramente sus políticas, te recomendamos contactarlo directamente antes de comprar."
        },
        {
          q: "¿Qué productos no se pueden devolver?",
          a: "Las políticas sobre qué productos pueden o no devolverse varían según cada vendedor. Algunos vendedores pueden no aceptar devoluciones de productos de higiene personal, alimentos, productos personalizados, o productos usados. Es fundamental que revises las políticas específicas del vendedor antes de comprar."
        },
        {
          q: "¿Quién paga el envío de la devolución?",
          a: "Los costos de envío de devolución son determinados por cada vendedor según sus políticas. Algunos vendedores pueden cubrir el costo completo, compartirlo con el comprador, o requerir que el comprador lo cubra completamente. Es importante aclarar estos costos con el vendedor antes de iniciar el proceso de devolución."
        },
        {
          q: "¿Cuánto tiempo tarda el reembolso?",
          a: "Los reembolsos son procesados directamente por cada vendedor. Los tiempos pueden variar según las políticas del vendedor, el método de pago original utilizado, y los procesos bancarios. Mascottaz no procesa reembolsos directamente y no puede garantizar tiempos específicos, ya que esto depende completamente del vendedor."
        }
      ]
    },
    {
      category: "Productos",
      questions: [
        {
          q: "¿Los productos son originales?",
          a: "Mascottaz es una plataforma marketplace donde diferentes vendedores ofrecen sus productos. Cada vendedor es responsable de la autenticidad y calidad de los productos que vende. Te recomendamos revisar las reseñas y calificaciones del vendedor, y contactarlo directamente si tienes dudas sobre la autenticidad de un producto antes de comprar."
        },
        {
          q: "¿Qué hago si recibo un producto defectuoso?",
          a: "Si recibes un producto defectuoso, contacta inmediatamente al vendedor. La mayoría de los vendedores tienen políticas especiales para productos defectuosos que pueden incluir reemplazo inmediato, reembolso completo, o reparación. Si no obtienes respuesta del vendedor, puedes contactarnos para que intentemos facilitar la comunicación."
        },
        {
          q: "¿Ofrecen garantía en los productos?",
          a: "Las garantías pueden venir del fabricante (válidas independientemente del vendedor) o del vendedor (políticas propias). Es importante que revises las políticas de garantía del vendedor antes de comprar. Te recomendamos conservar toda la documentación del producto y el comprobante de compra para hacer válida cualquier garantía."
        },
        {
          q: "¿Puedo ver más fotos de un producto?",
          a: "Si necesitas más información o fotos adicionales de un producto, contacta directamente al vendedor. La mayoría de los vendedores están dispuestos a proporcionar información adicional para ayudarte a tomar una decisión informada."
        }
      ]
    },
    {
      category: "Cuenta y Perfil",
      questions: [
        {
          q: "¿Cómo creo una cuenta?",
          a: "Puedes crear una cuenta haciendo clic en 'Iniciar Sesión' y luego en 'Crear cuenta'. Completa el formulario con tu información y confirma tu correo electrónico. Una vez creada tu cuenta, podrás comprar productos y, si lo deseas, registrarte como vendedor."
        },
        {
          q: "¿Puedo cambiar mi información de cuenta?",
          a: "Sí, puedes actualizar tu información personal, dirección y preferencias en cualquier momento desde la sección 'Mi Perfil' en tu cuenta."
        },
        {
          q: "Olvidé mi contraseña, ¿qué hago?",
          a: "Haz clic en 'Olvidé mi contraseña' en la página de inicio de sesión. Te enviaremos un enlace por correo electrónico para restablecer tu contraseña."
        },
        {
          q: "¿Cómo elimino mi cuenta?",
          a: "Desde tu perfil haz clic en el icono de configuración, elige “Editar perfil” y desplázate hasta el final del modal. Encontrarás el enlace “Eliminar cuenta”, que abre un cuestionario breve de tres preguntas y una confirmación final. Al confirmar, borramos inmediatamente tu información (perfil, fotos y datos asociados) y te redirigimos al inicio; si cancelas, tu cuenta se mantiene activa. Los vendedores cuentan con el mismo flujo dentro de la página de configuración de su tienda."
        }
      ]
    },
    {
      category: "Vender en Mascottaz",
      questions: [
        {
          q: "¿Cómo me registro como vendedor?",
          a: "Para vender en Mascottaz, dirígete al footer y selecciona “Vender en Mascottaz”. Completa el formulario con tus datos y crea tu tienda al instante: no necesitas una aprobación previa para empezar a cargar productos. Nuestro equipo valida la información posteriormente de forma confidencial para garantizar seguridad y confianza entre vendedores y compradores."
        },
        {
          q: "¿Cómo subo productos a la plataforma?",
          a: "En tu panel de vendedor puedes agregar productos indicando título, descripción clara, precio, inventario disponible, categoría, variaciones (tallas, colores, etc. si aplica) y fotos de alta calidad. Procura incluir toda la información necesaria para que el comprador pueda evaluar el producto sin dudas."
        },
        {
          q: "¿Cuáles son las comisiones y costos por vender?",
          a: "Por el momento, NO se cobra ninguna comisión por venta. Todo el mes de diciembre de 2025 será completamente gratis para todos los vendedores. Podrás publicar productos sin límites y sin pagar ninguna tarifa. Es importante estar atento a los anuncios oficiales, ya que a partir del 1 de enero de 2026 podrían aplicarse modificaciones a esta política. Te mantendremos informado sobre cualquier cambio futuro."
        },
        {
          q: "¿Cómo gestiono los envíos, devoluciones y atención al cliente?",
          a: "Como vendedor, eres completamente responsable de gestionar todos los aspectos relacionados con tus ventas. Debes acordar directamente con cada comprador los métodos de envío, costos y tiempos de entrega. También debes especificar claramente tu política de devoluciones (plazos, condiciones, costos). La plataforma puede ayudarte a contactar con compradores en caso de reclamos, pero no administramos envíos ni devoluciones directamente. Es fundamental mantener comunicación clara y oportuna con tus compradores."
        },
        {
          q: "¿Cómo recibo y gestiono los pedidos?",
          a: "Recibirás notificaciones cuando alguien compre uno de tus productos. Una vez que recibas la notificación, debes contactar al comprador para coordinar todos los detalles: confirmar el pedido, acordar el método y costo de envío, proporcionar información de pago, y coordinar la entrega. Mantén una comunicación activa y profesional con tus compradores para asegurar una experiencia positiva."
        },
        {
          q: "¿Cuáles son las buenas prácticas para vendedores?",
          a: "Para tener éxito como vendedor en Mascottaz, te recomendamos: usar fotos claras y de alta calidad que muestren el producto desde diferentes ángulos, mantener precios actualizados y competitivos, asegurar que el stock mostrado sea real y actualizado, responder rápidamente a las consultas de los compradores, proporcionar descripciones detalladas y honestas de tus productos, establecer políticas claras de envío y devolución, y mantener una comunicación profesional y respetuosa. Estas prácticas ayudan a generar confianza y mejorar tus ventas."
        },
        {
          q: "¿Habrá cambios en las políticas en el futuro?",
          a: "Sí, las políticas actuales aplican durante la fase inicial del marketplace. Estamos comprometidos con mejorar continuamente la plataforma y es posible que implementemos cambios y mejoras en el futuro. Especialmente importante: los vendedores deben mantenerse atentos a los anuncios oficiales, particularmente para los posibles cambios que podrían aplicarse a partir del 1 de enero de 2026. Te notificaremos con anticipación sobre cualquier modificación significativa a través de los canales oficiales de la plataforma."
        }
      ]
    },
    {
      category: "Otros",
      questions: [
        {
          q: "¿Cómo contacto con atención al cliente?",
          a: "Al final de esta página encontrarás nuestro formulario de atención. Déjanos tu nombre, correo y cuéntanos brevemente qué sucede; nuestro equipo revisa cada solicitud y te contactará en un plazo máximo de 24 horas. También puedes escribirnos por correo o teléfono si lo prefieres."
        },
        {
          q: "¿Ofrecen descuentos o promociones?",
          a: "Los descuentos y promociones son ofrecidos directamente por cada vendedor. Algunos vendedores pueden tener ofertas especiales, descuentos por volumen, o promociones estacionales. Te recomendamos revisar los productos y contactar a los vendedores para conocer sus ofertas actuales."
        },
        {
          q: "¿Tienen programa de puntos o recompensas?",
          a: "Actualmente no tenemos un programa de puntos o recompensas, pero estamos trabajando en mejoras continuas para la plataforma. Mantente al tanto de nuestras actualizaciones para conocer nuevas funcionalidades."
        },
        {
          q: "¿Qué hago si tengo un problema con un vendedor?",
          a: "Si experimentas algún problema con un vendedor (producto no recibido, problema de calidad, falta de comunicación, etc.), primero intenta resolverlo directamente con el vendedor. Si no obtienes respuesta o no se resuelve el problema, contáctanos y podemos ayudar a facilitar la comunicación o mediar en la disputa. Aunque no podemos garantizar resultados específicos, haremos nuestro mejor esfuerzo para ayudarte."
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fffaf0' }}>
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--brand-blue)' }}>
            Preguntas Frecuentes (FAQ)
          </h1>
          <p className="text-gray-600 mb-8">
            Encuentra respuestas a las preguntas más comunes sobre nuestra plataforma marketplace.
          </p>
          
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((faq, questionIndex) => {
                    const index = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === index;
                    
                    return (
                      <div
                        key={questionIndex}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-800 pr-4">
                            {faq.q}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-2 bg-gray-50">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-lg" style={{ backgroundColor: '#dbeafe' }}>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-blue)' }}>
              ¿No encontraste tu respuesta?
            </h3>
            <p className="text-gray-700 mb-4">
              Completa este formulario y nuestro equipo te contactará en menos de 24 horas.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSupportStatus("Gracias por escribirnos. Te contactaremos en un máximo de 24 horas.");
                setSupportForm({ name: "", email: "", message: "" });
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={supportForm.name}
                    onChange={(e) => setSupportForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={supportForm.email}
                    onChange={(e) => setSupportForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tunombre@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuéntanos qué sucede
                </label>
                <textarea
                  value={supportForm.message}
                  onChange={(e) => setSupportForm((prev) => ({ ...prev, message: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe brevemente tu situación..."
                />
              </div>
              {supportStatus && (
                <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  {supportStatus}
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-white font-semibold transition-colors"
                  style={{ backgroundColor: 'var(--brand-blue)' }}
                >
                  Enviar solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

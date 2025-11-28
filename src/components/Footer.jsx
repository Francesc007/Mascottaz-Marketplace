"use client";

import Link from "next/link";

export default function Footer() {
    return (
      <footer className="mt-20" style={{ backgroundColor: 'var(--interaction-blue)', color: '#1e3a8a' }}>
        <div className="mx-auto max-w-screen-2xl px-2 md:px-4 py-12">
          {/* Contenido principal del footer en 5 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Columna 1: Redes Sociales */}
            <div>
              <h3 className="text-lg font-bold mb-4">Síguenos</h3>
              <div className="space-y-3">
                <a 
                  href="#" 
                  className="flex items-center space-x-3 hover:text-blue-300 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
                
                <a 
                  href="#" 
                  className="flex items-center space-x-3 hover:text-pink-300 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
                
                <a 
                  href="#" 
                  className="flex items-center space-x-3 hover:text-gray-300 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <span>TikTok</span>
                </a>
              </div>
            </div>

            {/* Columna 2: Descarga de App */}
            <div>
              <h3 className="text-lg font-bold mb-4">Descarga la App</h3>
              <div className="space-y-3">
                <a 
                  href="#" 
                  className="flex items-center space-x-3 hover:text-blue-300 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>App Store</span>
                </a>
                
                <a 
                  href="#" 
                  className="flex items-center space-x-3 hover:text-green-300 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <span>Google Play</span>
                </a>
              </div>
            </div>

            {/* Columna 3: Información Legal */}
            <div>
              <h3 className="text-lg font-bold mb-4">Información Legal</h3>
              <div className="space-y-3">
                <a href="#" className="block hover:text-blue-300 transition-colors duration-200">
                  Términos y Condiciones
                </a>
                <a href="#" className="block hover:text-blue-300 transition-colors duration-200">
                  Aviso de Privacidad
                </a>
                <a href="#" className="block hover:text-blue-300 transition-colors duration-200">
                  Política de Cookies
                </a>
              </div>
            </div>

            {/* Columna 4: Ayuda y Soporte */}
            <div>
              <h3 className="text-lg font-bold mb-4">Ayuda y Soporte</h3>
              <div className="space-y-3">
                <Link href="/politica-envio" className="block transition-colors duration-200 hover:text-blue-800">
                  Política de Envío
                </Link>
                <Link href="/devoluciones" className="block transition-colors duration-200 hover:text-blue-800">
                  Política de Devoluciones
                </Link>
                <Link href="/faq" className="block transition-colors duration-200 hover:text-blue-800">
                  Preguntas Frecuentes (FAQ)
                </Link>
              </div>
            </div>

            {/* Columna 5: Vender en Mascottaz */}
            <div>
              <h3 className="text-lg font-bold mb-4">Vender en Mascottaz</h3>
              <div className="space-y-3">
                <Link 
                  href="/sell"
                  className="block transition-colors duration-200 hover:text-blue-800 font-medium"
                >
                  Vender en Mascottaz
                </Link>
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-gray-300 mt-8 pt-6">
            {/* Slogan con ícono - Texto más pequeño */}
            <div className="flex flex-col items-center justify-center mb-3">
              <div className="flex items-center gap-2">
                <svg 
                  className="w-4 h-4 md:w-5 md:h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--brand-blue)' }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
                <p className="text-xs md:text-sm font-semibold italic" style={{ color: 'var(--brand-blue)' }}>
                  Porque pensamos en su felicidad
                </p>
                <svg 
                  className="w-4 h-4 md:w-5 md:h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--brand-blue)' }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
              </div>
            </div>
            <p className="text-center text-sm" style={{ fontFamily: 'var(--font-body)' }}>
              © 2025 Mascottaz. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    );
  }
  
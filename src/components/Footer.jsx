export default function Footer() {
    return (
      <footer className="mt-20" style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
        <div className="container mx-auto px-4 py-12">
          {/* Contenido principal del footer en 4 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
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
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
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
                <a href="#" className="block hover:text-blue-300 transition-colors duration-200">
                  Política de Envío
                </a>
                <a href="#" className="block hover:text-blue-300 transition-colors duration-200">
                  Política de Devoluciones
                </a>
                <a href="#" className="block hover:text-blue-300 transition-colors duration-200">
                  Preguntas Frecuentes (FAQ)
                </a>
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-blue-300 mt-8 pt-6">
            <p className="text-center text-sm">
              © 2025 Pet Place. Todos los derechos reservados. Hecho con ❤️ por Francisco
            </p>
          </div>
        </div>
      </footer>
    );
  }
  
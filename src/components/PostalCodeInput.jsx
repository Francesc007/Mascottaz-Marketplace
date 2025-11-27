"use client";

import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { useAuth } from "../lib/auth";

/**
 * Componente de Código Postal - Versión nueva desde cero
 * Usa la API /api/cp para buscar códigos postales
 * Mantiene el CP solo si el usuario está autenticado
 */
export default function PostalCodeInput({ openModal, onModalClose }) {
  const [cp, setCp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [showInput, setShowInput] = useState(false);
  const { isAuthenticated, location, setLocation, logout } = useAuthStore();
  const { login, register } = useAuth();
  
  // Estados para el formulario de autenticación
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Cargar ubicación guardada si el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && location) {
      setResultado({
        municipio: location.city || location.municipio,
        estado: location.state || location.estado,
      });
    } else if (!isAuthenticated) {
      // Si no está autenticado, limpiar el resultado
      setResultado(null);
      setCp("");
    }
  }, [isAuthenticated, location]);

  // Detectar cuando el usuario cierra sesión
  useEffect(() => {
    if (!isAuthenticated && resultado) {
      setResultado(null);
      setCp("");
      setError("");
    }
  }, [isAuthenticated, resultado]);

  // Abrir modal cuando se recibe la prop openModal
  useEffect(() => {
    if (openModal) {
      setShowInput(true);
      if (onModalClose) {
        // Resetear el estado en el padre después de abrir
        setTimeout(() => onModalClose(), 0);
      }
    }
  }, [openModal, onModalClose]);

  const handleChange = async (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Solo números
    if (value.length <= 5) {
      setCp(value);
      setError("");
      setResultado(null);

      // Buscar automáticamente cuando tenga 5 dígitos
      if (value.length === 5) {
        await buscarCodigoPostal(value);
      }
    }
  };

  const buscarCodigoPostal = async (codigo) => {
    setLoading(true);
    setError("");
    setResultado(null);

    try {
      const response = await fetch(`/api/cp?cp=${codigo}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Código postal no encontrado");
        setResultado(null);
      } else {
        setError("");
        setResultado(data);
        setShowInput(false); // Cerrar el modal cuando se encuentra un resultado válido
        
        // Guardar en el store solo si el usuario está autenticado
        if (isAuthenticated) {
          setLocation({
            postalCode: codigo,
            municipio: data.municipio,
            estado: data.estado,
            city: data.municipio,
            state: data.estado,
          });
        }
      }
    } catch (err) {
      console.error("Error al buscar código postal:", err);
      setError("Error al buscar el código postal");
      setResultado(null);
    } finally {
      setLoading(false);
    }
  };

  // Si hay resultado, mostrar solo municipio y estado (sin input)
  if (resultado && !error) {
    return (
      <>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
          // En lugar de resetear, abrir el modal para ingresar nuevo CP
          setShowInput(true);
        }}>
        {/* Icono de ubicación - Azul marino con círculo blanco */}
        <svg
          className="w-8 h-8 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cuerpo del marcador en azul marino */}
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="#1e3a8a"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          />
          {/* Círculo del medio blanco */}
          <circle cx="12" cy="9" r="2.5" fill="white" />
        </svg>

        {/* Municipio y Estado - Texto más pequeño y centrado */}
        <div className="flex flex-col items-center">
          <span className="text-base font-semibold text-gray-800 leading-tight text-center">
            {resultado.municipio}
          </span>
          <span className="text-base font-semibold text-gray-800 leading-tight text-center">
            {resultado.estado}
          </span>
        </div>
      </div>

      {/* Modal para cambiar CP cuando ya hay uno guardado */}
      {showInput && (
        <>
          {/* Overlay transparente para cerrar el modal */}
          <div
            className="fixed inset-0 z-50"
            onClick={() => {
              setShowInput(false);
              setError("");
            }}
          />
          
          {/* Modal pequeño centrado */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
              className="bg-white rounded-lg shadow-2xl p-6 w-80 max-w-[90vw] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Texto CTA breve */}
              <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                Cambiar código postal
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Ingresa un nuevo código postal para actualizar tu ubicación
              </p>

              {/* Input del código postal */}
              <div className="relative mb-3">
                <input
                  type="text"
                  value={cp}
                  onChange={handleChange}
                  placeholder="Ej: 12345"
                  maxLength={5}
                  className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ backgroundColor: '#fff' }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && cp.length === 5 && !loading) {
                      buscarCodigoPostal(cp);
                    }
                  }}
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="animate-spin h-5 w-5"
                      style={{ color: '#1e3a8a' }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Mensaje de error */}
              {error && (
                <p className="text-sm text-red-600 mb-3 text-center">{error}</p>
              )}

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowInput(false);
                    setError("");
                    setCp("");
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (cp.length === 5) {
                      buscarCodigoPostal(cp);
                    }
                  }}
                  disabled={cp.length !== 5 || loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      </>
    );
  }

  return (
    <>
      {/* Botón "Tu ciudad" */}
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setShowInput(true)}
      >
        {/* Icono de ubicación - Azul marino con círculo blanco */}
        <svg
          className="w-8 h-8 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cuerpo del marcador en azul marino */}
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="#1e3a8a"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          />
          {/* Círculo del medio blanco */}
          <circle cx="12" cy="9" r="2.5" fill="white" />
        </svg>

        {/* Texto "Tu ciudad" */}
        <span className="text-base font-semibold text-gray-800">
          Tu ciudad
        </span>
      </div>

      {/* Modal pequeño para ingresar CP */}
      {showInput && !resultado && (
        <>
          {/* Overlay transparente para cerrar el modal */}
          <div
            className="fixed inset-0 z-50"
            onClick={() => {
              setShowInput(false);
              setError("");
            }}
          />
          
          {/* Modal pequeño centrado */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
              className="bg-white rounded-lg shadow-2xl p-6 w-80 max-w-[90vw] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {!isAuthenticated ? (
                <>
                  {/* Formulario de autenticación */}
                  <div>

                    {showRegister && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {showRegister && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirmar contraseña
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    {authError && (
                      <p className="text-sm text-red-600 mb-3 text-center">{authError}</p>
                    )}

                    <div className="flex gap-3 mb-3">
                      <button
                        onClick={async () => {
                          setAuthError("");
                          setAuthLoading(true);

                          if (showRegister) {
                            // Registrar
                            if (password !== confirmPassword) {
                              setAuthError("Las contraseñas no coinciden");
                              setAuthLoading(false);
                              return;
                            }
                            if (!fullName) {
                              setAuthError("El nombre es requerido");
                              setAuthLoading(false);
                              return;
                            }

                            const result = await register(email, password, {
                              fullName,
                              userType: "buyer",
                            });

                            if (result.success) {
                              setShowInput(false);
                              setEmail("");
                              setPassword("");
                              setConfirmPassword("");
                              setFullName("");
                              setShowRegister(false);
                              // El store se actualiza automáticamente en useAuth
                            } else {
                              setAuthError(result.error?.message || "Error al crear la cuenta");
                            }
                          } else {
                            // Login
                            const result = await login(email, password);

                            if (result.success) {
                              setShowInput(false);
                              setEmail("");
                              setPassword("");
                              setShowRegister(false);
                              // El store se actualiza automáticamente en useAuth
                            } else {
                              setAuthError(result.error?.message || "Error al iniciar sesión");
                            }
                          }

                          setAuthLoading(false);
                        }}
                        disabled={authLoading || !email || !password || (showRegister && (!fullName || password !== confirmPassword))}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        {authLoading ? "Cargando..." : showRegister ? "Crear cuenta" : "Iniciar sesión"}
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={() => {
                          setShowRegister(!showRegister);
                          setAuthError("");
                          setEmail("");
                          setPassword("");
                          setConfirmPassword("");
                          setFullName("");
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        {showRegister 
                          ? "¿Ya tienes cuenta? Inicia sesión" 
                          : "¿No tienes cuenta? Crear cuenta"}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setShowInput(false);
                        setAuthError("");
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                        setFullName("");
                        setShowRegister(false);
                      }}
                      className="w-full mt-3 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Contenido para usuarios autenticados */}
                  {/* Texto CTA breve */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                    Ingresa tu código postal
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Para mostrarte productos disponibles en tu área
                  </p>

                  {/* Input del código postal */}
                  <div className="relative mb-3">
                    <input
                      type="text"
                      value={cp}
                      onChange={handleChange}
                      placeholder="Ej: 12345"
                      maxLength={5}
                      className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ backgroundColor: '#fff' }}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && cp.length === 5 && !loading) {
                          buscarCodigoPostal(cp);
                        }
                      }}
                    />
                    {loading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg
                          className="animate-spin h-5 w-5"
                          style={{ color: '#1e3a8a' }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Mensaje de error */}
                  {error && (
                    <p className="text-sm text-red-600 mb-3 text-center">{error}</p>
                  )}

                  {/* Botones */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowInput(false);
                        setError("");
                        setCp("");
                      }}
                      className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        if (cp.length === 5) {
                          buscarCodigoPostal(cp);
                        }
                      }}
                      disabled={cp.length !== 5 || loading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      Buscar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}


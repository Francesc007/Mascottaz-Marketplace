"use client";

import { useState } from "react";

export default function SellerRegistrationForm({ isOpen, onClose }) {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    // Sección 1: Datos básicos
    fullNameOrCompany: "",
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    phone: "",
    // Sección 2: Datos financieros
    country: "",
    accountType: "",
    taxId: "",
    bankAccount: ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateSection1 = () => {
    const newErrors = {};

    if (!formData.fullNameOrCompany.trim()) {
      newErrors.fullNameOrCompany = "El nombre completo o razón social es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.storeName.trim()) {
      newErrors.storeName = "El nombre de la tienda es requerido";
    } else if (formData.storeName.length < 3) {
      newErrors.storeName = "El nombre de la tienda debe tener al menos 3 caracteres";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono de contacto es requerido";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "El formato del teléfono no es válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSection2 = () => {
    const newErrors = {};

    if (!formData.country) {
      newErrors.country = "El país de operación es requerido";
    }

    if (!formData.accountType) {
      newErrors.accountType = "El tipo de cuenta bancaria es requerido";
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = "El RFC o identificación fiscal es requerido";
    } else if (formData.taxId.length < 10) {
      newErrors.taxId = "El RFC debe tener al menos 10 caracteres";
    }

    if (!formData.bankAccount.trim()) {
      newErrors.bankAccount = "La CLABE interbancaria es requerida";
    } else if (formData.bankAccount.length < 18) {
      newErrors.bankAccount = "La CLABE debe tener 18 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validateSection1()) {
      setCurrentSection(2);
    }
  };

  const handleFinalize = (e) => {
    e.preventDefault();
    if (validateSection2()) {
      console.log("Datos completos del vendedor:", formData);
      alert("¡Registro de vendedor completado exitosamente!");
      onClose();
    }
  };

  const handleBack = () => {
    setCurrentSection(1);
  };

  const handleClose = () => {
    setFormData({
      fullNameOrCompany: "",
      email: "",
      password: "",
      confirmPassword: "",
      storeName: "",
      phone: "",
      country: "",
      accountType: "",
      taxId: "",
      bankAccount: ""
    });
    setErrors({});
    setCurrentSection(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🏪 Registro de Vendedor</h2>
            <p className="text-sm text-gray-600 mt-1">
              {currentSection === 1 
                ? "Sección 1: Datos de Identificación y Comerciales" 
                : "Sección 2: Datos Financieros"
              }
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={currentSection === 1 ? handleContinue : handleFinalize} className="p-6 space-y-4">
          {currentSection === 1 ? (
            <>
              {/* Sección 1: Datos básicos */}
              {/* Nombre Completo o Razón Social */}
              <div>
                <label htmlFor="fullNameOrCompany" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo o Razón Social de la Empresa
                </label>
                <input
                  type="text"
                  id="fullNameOrCompany"
                  name="fullNameOrCompany"
                  value={formData.fullNameOrCompany}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fullNameOrCompany ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ingresa tu nombre completo o razón social"
                />
                {errors.fullNameOrCompany && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullNameOrCompany}</p>
                )}
              </div>

              {/* Correo Electrónico */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico (Para Login)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Repite tu contraseña"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Nombre de la Tienda */}
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Tienda (URL deseada de la tienda)
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.storeName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="mi-tienda-pet"
                />
                {errors.storeName && (
                  <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Este será el nombre de tu tienda en la plataforma
                </p>
              </div>

              {/* Teléfono de Contacto */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Botón de continuar */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Continuar a Datos Financieros
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Sección 2: Datos financieros */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💳 <strong>Datos Financieros</strong><br/>
                  Esta información es necesaria para garantizar que recibas el pago de tus ventas de forma segura y transparente.
                </p>
              </div>

              {/* País de Operación */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  País de Operación
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecciona tu país</option>
                  <option value="MX">México</option>
                  <option value="CO">Colombia</option>
                  <option value="AR">Argentina</option>
                  <option value="CL">Chile</option>
                  <option value="PE">Perú</option>
                  <option value="ES">España</option>
                  <option value="US">Estados Unidos</option>
                </select>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
              </div>

              {/* Tipo de Cuenta Bancaria */}
              <div>
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Cuenta Bancaria
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.accountType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecciona el tipo de cuenta</option>
                  <option value="individual">Persona Física</option>
                  <option value="business">Persona Moral/Empresa</option>
                </select>
                {errors.accountType && (
                  <p className="text-red-500 text-sm mt-1">{errors.accountType}</p>
                )}
              </div>

              {/* RFC o Identificación Fiscal */}
              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">
                  RFC o Identificación Fiscal
                </label>
                <input
                  type="text"
                  id="taxId"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.taxId ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="RFC123456789"
                />
                {errors.taxId && (
                  <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Requerido para la conexión con el procesador de pagos
                </p>
              </div>

              {/* CLABE Interbancaria */}
              <div>
                <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 mb-1">
                  CLABE Interbancaria
                </label>
                <input
                  type="text"
                  id="bankAccount"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.bankAccount ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="123456789012345678"
                  maxLength="18"
                />
                {errors.bankAccount && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankAccount}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Número de cuenta bancaria donde recibirás el dinero
                </p>
              </div>

              {/* Texto de aceptación */}
              <div className="pt-2">
                <p className="text-xs text-gray-600 text-center">
                  Al hacer clic en Finalizar Registro, aceptas la conexión con nuestro procesador de pagos Stripe Connect para gestionar tus ingresos y comisiones.
                </p>
              </div>

              {/* Botones de navegación */}
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  ← Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Finalizar Registro de Vendedor
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

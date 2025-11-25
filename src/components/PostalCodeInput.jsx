"use client";

import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";

// Componente de marcador personalizado con azul marino y círculo blanco
const CustomMapPin = ({ className }) => (
  <svg
    className={className}
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
);

// Componente de spinner de carga
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
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
        style={{ color: '#1e3a8a' }}
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        style={{ color: '#1e3a8a' }}
      ></path>
    </svg>
  </div>
);

// Base de datos expandida de códigos postales (similar a cómo Amazon/Mercado Libre lo manejan)
const postalCodeDatabase = {
  // Ciudad de México
  "01000": { city: "Álvaro Obregón", state: "Ciudad de México" },
  "01010": { city: "Álvaro Obregón", state: "Ciudad de México" },
  "01020": { city: "Álvaro Obregón", state: "Ciudad de México" },
  "02000": { city: "Azcapotzalco", state: "Ciudad de México" },
  "02010": { city: "Azcapotzalco", state: "Ciudad de México" },
  "03000": { city: "Benito Juárez", state: "Ciudad de México" },
  "03010": { city: "Benito Juárez", state: "Ciudad de México" },
  "03020": { city: "Benito Juárez", state: "Ciudad de México" },
  "04000": { city: "Coyoacán", state: "Ciudad de México" },
  "04010": { city: "Coyoacán", state: "Ciudad de México" },
  "05000": { city: "Cuajimalpa", state: "Ciudad de México" },
  "06000": { city: "Cuauhtémoc", state: "Ciudad de México" },
  "06010": { city: "Cuauhtémoc", state: "Ciudad de México" },
  "06020": { city: "Cuauhtémoc", state: "Ciudad de México" },
  "07000": { city: "Gustavo A. Madero", state: "Ciudad de México" },
  "07010": { city: "Gustavo A. Madero", state: "Ciudad de México" },
  "08000": { city: "Iztacalco", state: "Ciudad de México" },
  "09000": { city: "Iztapalapa", state: "Ciudad de México" },
  "09010": { city: "Iztapalapa", state: "Ciudad de México" },
  "10000": { city: "Magdalena Contreras", state: "Ciudad de México" },
  "11000": { city: "Miguel Hidalgo", state: "Ciudad de México" },
  "11010": { city: "Miguel Hidalgo", state: "Ciudad de México" },
  "12000": { city: "Milpa Alta", state: "Ciudad de México" },
  "13000": { city: "Tláhuac", state: "Ciudad de México" },
  "14000": { city: "Tlalpan", state: "Ciudad de México" },
  "15000": { city: "Venustiano Carranza", state: "Ciudad de México" },
  "16000": { city: "Xochimilco", state: "Ciudad de México" },
  // Estados principales
  "20000": { city: "Aguascalientes", state: "Aguascalientes" },
  "20100": { city: "Aguascalientes", state: "Aguascalientes" },
  "21000": { city: "Mexicali", state: "Baja California" },
  "21010": { city: "Mexicali", state: "Baja California" },
  "22000": { city: "Tijuana", state: "Baja California" },
  "22010": { city: "Tijuana", state: "Baja California" },
  "22100": { city: "Tijuana", state: "Baja California" },
  "23000": { city: "La Paz", state: "Baja California Sur" },
  "24000": { city: "Campeche", state: "Campeche" },
  "25000": { city: "Saltillo", state: "Coahuila" },
  "25010": { city: "Saltillo", state: "Coahuila" },
  "26000": { city: "Colima", state: "Colima" },
  "27000": { city: "Torreón", state: "Coahuila" },
  "27010": { city: "Torreón", state: "Coahuila" },
  "28000": { city: "Tuxtla Gutiérrez", state: "Chiapas" },
  "29000": { city: "Chihuahua", state: "Chihuahua" },
  "29010": { city: "Chihuahua", state: "Chihuahua" },
  "31000": { city: "Durango", state: "Durango" },
  "36000": { city: "Guanajuato", state: "Guanajuato" },
  "37000": { city: "León", state: "Guanajuato" },
  "37010": { city: "León", state: "Guanajuato" },
  "37020": { city: "León", state: "Guanajuato" },
  "38000": { city: "Celaya", state: "Guanajuato" },
  "39000": { city: "Chilpancingo", state: "Guerrero" },
  "40000": { city: "Pachuca", state: "Hidalgo" },
  "44100": { city: "Guadalajara", state: "Jalisco" },
  "44110": { city: "Guadalajara", state: "Jalisco" },
  "44120": { city: "Guadalajara", state: "Jalisco" },
  "44130": { city: "Guadalajara", state: "Jalisco" },
  "44140": { city: "Guadalajara", state: "Jalisco" },
  "44150": { city: "Guadalajara", state: "Jalisco" },
  "44160": { city: "Guadalajara", state: "Jalisco" },
  "44170": { city: "Guadalajara", state: "Jalisco" },
  "44200": { city: "Zapopan", state: "Jalisco" },
  "44210": { city: "Zapopan", state: "Jalisco" },
  "44220": { city: "Zapopan", state: "Jalisco" },
  "44300": { city: "Tlaquepaque", state: "Jalisco" },
  "50000": { city: "Toluca", state: "Estado de México" },
  "50010": { city: "Toluca", state: "Estado de México" },
  "52000": { city: "Metepec", state: "Estado de México" },
  "54000": { city: "Naucalpan", state: "Estado de México" },
  "54010": { city: "Naucalpan", state: "Estado de México" },
  "55000": { city: "Ecatepec", state: "Estado de México" },
  "55010": { city: "Ecatepec", state: "Estado de México" },
  "58000": { city: "Morelia", state: "Michoacán" },
  "60000": { city: "Cuernavaca", state: "Morelos" },
  "61000": { city: "Tepic", state: "Nayarit" },
  "64000": { city: "Monterrey", state: "Nuevo León" },
  "64010": { city: "Monterrey", state: "Nuevo León" },
  "64020": { city: "Monterrey", state: "Nuevo León" },
  "64030": { city: "Monterrey", state: "Nuevo León" },
  "64040": { city: "Monterrey", state: "Nuevo León" },
  "64050": { city: "Monterrey", state: "Nuevo León" },
  "64060": { city: "Monterrey", state: "Nuevo León" },
  "64070": { city: "Monterrey", state: "Nuevo León" },
  "68000": { city: "Oaxaca", state: "Oaxaca" },
  "72000": { city: "Puebla", state: "Puebla" },
  "72010": { city: "Puebla", state: "Puebla" },
  "72020": { city: "Puebla", state: "Puebla" },
  "76000": { city: "Querétaro", state: "Querétaro" },
  "76010": { city: "Querétaro", state: "Querétaro" },
  "77000": { city: "Chetumal", state: "Quintana Roo" },
  "78000": { city: "San Luis Potosí", state: "San Luis Potosí" },
  "80000": { city: "Culiacán", state: "Sinaloa" },
  "83000": { city: "Hermosillo", state: "Sonora" },
  "86000": { city: "Villahermosa", state: "Tabasco" },
  "87000": { city: "Ciudad Victoria", state: "Tamaulipas" },
  "88000": { city: "Tlaxcala", state: "Tlaxcala" },
  "91000": { city: "Xalapa", state: "Veracruz" },
  "92000": { city: "Tampico", state: "Tamaulipas" },
  "97000": { city: "Mérida", state: "Yucatán" },
  "97010": { city: "Mérida", state: "Yucatán" },
  "98000": { city: "Zacatecas", state: "Zacatecas" },
};

export default function PostalCodeInput() {
  const { isAuthenticated, location, setLocation } = useAuthStore();
  const [postalCode, setPostalCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Si el usuario está autenticado, cargar su ubicación guardada
    if (isAuthenticated && location) {
      setPostalCode(location.postalCode || "");
    } else if (!isAuthenticated) {
      // Si no está autenticado, cargar del localStorage temporal
      const savedPostalCode = localStorage.getItem("tempPostalCode");
      if (savedPostalCode) {
        setPostalCode(savedPostalCode);
      }
    }
  }, [isAuthenticated, location]);

  // Efecto para desvanecer el mensaje después de 3 segundos
  useEffect(() => {
    if (showMessage && message) {
      const timer = setTimeout(() => {
        setShowMessage(false);
        setTimeout(() => setMessage(null), 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage, message]);

  const fetchLocationData = async (code) => {
    if (code.length !== 5) return null;

    setLoading(true);
    setMessage(null);
    setShowMessage(false);

    try {
      // Primero verificar base de datos local (método similar a Amazon/Mercado Libre)
      if (postalCodeDatabase[code]) {
        const locationData = {
          postalCode: code,
          city: postalCodeDatabase[code].city,
          state: postalCodeDatabase[code].state
        };

        // Si el usuario está autenticado, guardar en el store
        if (isAuthenticated) {
          setLocation(locationData);
        } else {
          localStorage.setItem("tempPostalCode", code);
          localStorage.setItem("tempLocation", JSON.stringify(locationData));
        }

        setLoading(false);
        return locationData;
      }

      // Si no está en la base local, intentar APIs externas
      let data = null;
      let success = false;

      // API 1: Sepomex (formato simplificado)
      try {
        const response = await fetch(`https://api-sepomex.hckdrk.mx/query/info_cp/${code}?type=simplified`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        
        if (response.ok) {
          const jsonData = await response.json();
          if (jsonData && (Array.isArray(jsonData) || jsonData.municipio || jsonData.estado || jsonData.response)) {
            data = jsonData;
            success = true;
          }
        }
      } catch (e) {
        // Continuar con siguiente API
      }

      // API 2: Sepomex (formato completo)
      if (!success) {
        try {
          const response = await fetch(`https://api-sepomex.hckdrk.mx/query/get_cp_info/${code}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          });
          
          if (response.ok) {
            const jsonData = await response.json();
            if (jsonData && (Array.isArray(jsonData) || jsonData.municipio || jsonData.estado || jsonData.response)) {
              data = jsonData;
              success = true;
            }
          }
        } catch (e) {
          // Continuar
        }
      }

      if (!success || !data) {
        throw new Error("Código postal no encontrado");
      }

      return processLocationData(data, code);
    } catch (err) {
      console.warn("Error al buscar código postal:", err);
      setMessage("Código postal no encontrado");
      setShowMessage(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const processLocationData = (data, code) => {
    let locationData = null;

    // Procesar diferentes formatos de respuesta
    if (Array.isArray(data) && data.length > 0) {
      const firstResult = data[0];
      const response = firstResult.response || firstResult;
      locationData = {
        postalCode: code,
        city: response.municipio || response.ciudad || firstResult.municipio || firstResult.ciudad || "Ciudad no disponible",
        state: response.estado || firstResult.estado || "Estado no disponible"
      };
    } else if (data.response) {
      const response = data.response;
      locationData = {
        postalCode: code,
        city: response.municipio || response.ciudad || "Ciudad no disponible",
        state: response.estado || "Estado no disponible"
      };
    } else if (data.municipio || data.estado) {
      locationData = {
        postalCode: code,
        city: data.municipio || data.ciudad || "Ciudad no disponible",
        state: data.estado || "Estado no disponible"
      };
    } else {
      throw new Error("Código postal no encontrado");
    }

    // Si el usuario está autenticado, guardar en el store
    if (isAuthenticated) {
      setLocation(locationData);
    } else {
      localStorage.setItem("tempPostalCode", code);
      localStorage.setItem("tempLocation", JSON.stringify(locationData));
    }

    return locationData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postalCode.trim().length === 5) {
      await fetchLocationData(postalCode.trim());
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Solo números
    if (value.length <= 5) {
      setPostalCode(value);
      setMessage(null);
      setShowMessage(false);
      if (value.length === 5) {
        fetchLocationData(value);
      }
    }
  };

  const getDisplayLocation = () => {
    if (isAuthenticated && location) {
      return location;
    } else if (!isAuthenticated) {
      const tempLocation = localStorage.getItem("tempLocation");
      if (tempLocation) {
        return JSON.parse(tempLocation);
      }
    }
    return null;
  };

  const displayLocation = getDisplayLocation();

  if (isEditing) {
    return (
      <div className="flex flex-col items-start gap-1">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <CustomMapPin className="w-7 h-7 flex-shrink-0" />
          <div className="relative">
            <input
              type="text"
              value={postalCode}
              onChange={handleChange}
              placeholder="CP"
              maxLength={5}
              className="w-32 px-3 py-2 text-lg font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              style={{ backgroundColor: '#fff' }}
              autoFocus
              onBlur={handleSubmit}
            />
            {loading && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </form>
        {message && (
          <span
            className={`text-base transition-opacity duration-300 ${
              showMessage ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ color: '#1e3a8a' }}
          >
            {message}
          </span>
        )}
      </div>
    );
  }

  // Mostrar ubicación solo si el usuario está autenticado - SIN RECUADRO
  if (isAuthenticated && displayLocation) {
    return (
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEditing(true)}>
        <span className="text-xl font-semibold text-gray-800">{displayLocation.city}</span>
        <CustomMapPin className="w-8 h-8 flex-shrink-0" />
        <span className="text-xl font-semibold text-gray-800">{displayLocation.state}</span>
      </div>
    );
  }

  // Si no está autenticado, mostrar solo el código postal o placeholder - SIN RECUADRO
  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-2 cursor-pointer"
    >
      <CustomMapPin className="w-7 h-7 flex-shrink-0" />
      <span className="text-lg font-semibold text-gray-700">
        {postalCode || "Código Postal"}
      </span>
    </button>
  );
}

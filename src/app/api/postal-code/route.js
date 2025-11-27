import { NextResponse } from 'next/server';

// Base de datos local expandida de códigos postales comunes
const postalCodeDatabase = {
  // Ciudad de México
  "01000": { estado: "Ciudad de México", municipio: "Álvaro Obregón", colonias: ["San Ángel"] },
  "01010": { estado: "Ciudad de México", municipio: "Álvaro Obregón", colonias: ["San Ángel"] },
  "01020": { estado: "Ciudad de México", municipio: "Álvaro Obregón", colonias: ["San Ángel"] },
  "02000": { estado: "Ciudad de México", municipio: "Azcapotzalco", colonias: ["Azcapotzalco Centro"] },
  "02010": { estado: "Ciudad de México", municipio: "Azcapotzalco", colonias: ["San Miguel"] },
  "03000": { estado: "Ciudad de México", municipio: "Benito Juárez", colonias: ["Del Valle"] },
  "03010": { estado: "Ciudad de México", municipio: "Benito Juárez", colonias: ["Del Valle"] },
  "03020": { estado: "Ciudad de México", municipio: "Benito Juárez", colonias: ["Del Valle"] },
  "04000": { estado: "Ciudad de México", municipio: "Coyoacán", colonias: ["Coyoacán"] },
  "04010": { estado: "Ciudad de México", municipio: "Coyoacán", colonias: ["Coyoacán"] },
  "05000": { estado: "Ciudad de México", municipio: "Cuajimalpa", colonias: ["Cuajimalpa"] },
  "06000": { estado: "Ciudad de México", municipio: "Cuauhtémoc", colonias: ["Centro"] },
  "06010": { estado: "Ciudad de México", municipio: "Cuauhtémoc", colonias: ["Centro"] },
  "06020": { estado: "Ciudad de México", municipio: "Cuauhtémoc", colonias: ["Centro"] },
  "07000": { estado: "Ciudad de México", municipio: "Gustavo A. Madero", colonias: ["Gustavo A. Madero"] },
  "07010": { estado: "Ciudad de México", municipio: "Gustavo A. Madero", colonias: ["Gustavo A. Madero"] },
  "08000": { estado: "Ciudad de México", municipio: "Iztacalco", colonias: ["Iztacalco"] },
  "09000": { estado: "Ciudad de México", municipio: "Iztapalapa", colonias: ["Iztapalapa"] },
  "09010": { estado: "Ciudad de México", municipio: "Iztapalapa", colonias: ["Iztapalapa"] },
  "10000": { estado: "Ciudad de México", municipio: "Magdalena Contreras", colonias: ["Magdalena Contreras"] },
  "11000": { estado: "Ciudad de México", municipio: "Miguel Hidalgo", colonias: ["Polanco"] },
  "11010": { estado: "Ciudad de México", municipio: "Miguel Hidalgo", colonias: ["Polanco"] },
  "12000": { estado: "Ciudad de México", municipio: "Milpa Alta", colonias: ["Milpa Alta"] },
  "13000": { estado: "Ciudad de México", municipio: "Tláhuac", colonias: ["Tláhuac"] },
  "14000": { estado: "Ciudad de México", municipio: "Tlalpan", colonias: ["Tlalpan"] },
  "15000": { estado: "Ciudad de México", municipio: "Venustiano Carranza", colonias: ["Venustiano Carranza"] },
  "16000": { estado: "Ciudad de México", municipio: "Xochimilco", colonias: ["Xochimilco"] },
  // Estados principales
  "20000": { estado: "Aguascalientes", municipio: "Aguascalientes", colonias: ["Centro"] },
  "20100": { estado: "Aguascalientes", municipio: "Aguascalientes", colonias: ["Centro"] },
  "21000": { estado: "Baja California", municipio: "Mexicali", colonias: ["Centro"] },
  "21010": { estado: "Baja California", municipio: "Mexicali", colonias: ["Centro"] },
  "22000": { estado: "Baja California", municipio: "Tijuana", colonias: ["Centro"] },
  "22010": { estado: "Baja California", municipio: "Tijuana", colonias: ["Centro"] },
  "22100": { estado: "Baja California", municipio: "Tijuana", colonias: ["Zona Río"] },
  "23000": { estado: "Baja California Sur", municipio: "La Paz", colonias: ["Centro"] },
  "24000": { estado: "Campeche", municipio: "Campeche", colonias: ["Centro"] },
  "25000": { estado: "Coahuila", municipio: "Saltillo", colonias: ["Centro"] },
  "25010": { estado: "Coahuila", municipio: "Saltillo", colonias: ["Centro"] },
  "26000": { estado: "Colima", municipio: "Colima", colonias: ["Centro"] },
  "27000": { estado: "Coahuila", municipio: "Torreón", colonias: ["Centro"] },
  "27010": { estado: "Coahuila", municipio: "Torreón", colonias: ["Centro"] },
  "28000": { estado: "Chiapas", municipio: "Tuxtla Gutiérrez", colonias: ["Centro"] },
  "29000": { estado: "Chihuahua", municipio: "Chihuahua", colonias: ["Centro"] },
  "29010": { estado: "Chihuahua", municipio: "Chihuahua", colonias: ["Centro"] },
  "31000": { estado: "Durango", municipio: "Durango", colonias: ["Centro"] },
  "36000": { estado: "Guanajuato", municipio: "Guanajuato", colonias: ["Centro"] },
  "37000": { estado: "Guanajuato", municipio: "León", colonias: ["Centro"] },
  "37010": { estado: "Guanajuato", municipio: "León", colonias: ["Centro"] },
  "37020": { estado: "Guanajuato", municipio: "León", colonias: ["Centro"] },
  "38000": { estado: "Guanajuato", municipio: "Celaya", colonias: ["Centro"] },
  "39000": { estado: "Guerrero", municipio: "Chilpancingo", colonias: ["Centro"] },
  "40000": { estado: "Hidalgo", municipio: "Pachuca", colonias: ["Centro"] },
  "44100": { estado: "Jalisco", municipio: "Guadalajara", colonias: ["Centro"] },
  "44110": { estado: "Jalisco", municipio: "Guadalajara", colonias: ["Centro"] },
  "44120": { estado: "Jalisco", municipio: "Guadalajara", colonias: ["Centro"] },
  "44130": { estado: "Jalisco", municipio: "Guadalajara", colonias: ["Centro"] },
  "44140": { estado: "Jalisco", municipio: "Guadalajara", colonias: ["Centro"] },
  "44150": { estado: "Jalisco", municipio: "Guadalajara", colonias: ["Centro"] },
  "44160": { estado: "Jalisco", municipio: "Guadalajara", colonias: ["Centro"] },
  "44170": { estado: "Jalisco", municipio: "Guadalajara", colonias: ["Centro"] },
  "44200": { estado: "Jalisco", municipio: "Zapopan", colonias: ["Centro"] },
  "44210": { estado: "Jalisco", municipio: "Zapopan", colonias: ["Centro"] },
  "44220": { estado: "Jalisco", municipio: "Zapopan", colonias: ["Centro"] },
  "44300": { estado: "Jalisco", municipio: "Tlaquepaque", colonias: ["Centro"] },
  "50000": { estado: "Estado de México", municipio: "Toluca", colonias: ["Centro"] },
  "50010": { estado: "Estado de México", municipio: "Toluca", colonias: ["Centro"] },
  "52000": { estado: "Estado de México", municipio: "Metepec", colonias: ["Centro"] },
  "54000": { estado: "Estado de México", municipio: "Naucalpan", colonias: ["Centro"] },
  "54010": { estado: "Estado de México", municipio: "Naucalpan", colonias: ["Centro"] },
  "55000": { estado: "Estado de México", municipio: "Ecatepec", colonias: ["Centro"] },
  "55010": { estado: "Estado de México", municipio: "Ecatepec", colonias: ["Centro"] },
  "58000": { estado: "Michoacán", municipio: "Morelia", colonias: ["Centro"] },
  "60000": { estado: "Morelos", municipio: "Cuernavaca", colonias: ["Centro"] },
  "61000": { estado: "Nayarit", municipio: "Tepic", colonias: ["Centro"] },
  "64000": { estado: "Nuevo León", municipio: "Monterrey", colonias: ["Centro"] },
  "64010": { estado: "Nuevo León", municipio: "Monterrey", colonias: ["Centro"] },
  "64020": { estado: "Nuevo León", municipio: "Monterrey", colonias: ["Centro"] },
  "64030": { estado: "Nuevo León", municipio: "Monterrey", colonias: ["Centro"] },
  "64040": { estado: "Nuevo León", municipio: "Monterrey", colonias: ["Centro"] },
  "64050": { estado: "Nuevo León", municipio: "Monterrey", colonias: ["Centro"] },
  "64060": { estado: "Nuevo León", municipio: "Monterrey", colonias: ["Centro"] },
  "64070": { estado: "Nuevo León", municipio: "Monterrey", colonias: ["Centro"] },
  "68000": { estado: "Oaxaca", municipio: "Oaxaca", colonias: ["Centro"] },
  "72000": { estado: "Puebla", municipio: "Puebla", colonias: ["Centro"] },
  "72010": { estado: "Puebla", municipio: "Puebla", colonias: ["Centro"] },
  "72020": { estado: "Puebla", municipio: "Puebla", colonias: ["Centro"] },
  "76000": { estado: "Querétaro", municipio: "Querétaro", colonias: ["Centro"] },
  "76010": { estado: "Querétaro", municipio: "Querétaro", colonias: ["Centro"] },
  "77000": { estado: "Quintana Roo", municipio: "Chetumal", colonias: ["Centro"] },
  "78000": { estado: "San Luis Potosí", municipio: "San Luis Potosí", colonias: ["Centro"] },
  "80000": { estado: "Sinaloa", municipio: "Culiacán", colonias: ["Centro"] },
  "83000": { estado: "Sonora", municipio: "Hermosillo", colonias: ["Centro"] },
  "86000": { estado: "Tabasco", municipio: "Villahermosa", colonias: ["Centro"] },
  "87000": { estado: "Tamaulipas", municipio: "Ciudad Victoria", colonias: ["Centro"] },
  "88000": { estado: "Tlaxcala", municipio: "Tlaxcala", colonias: ["Centro"] },
  "91000": { estado: "Veracruz", municipio: "Xalapa", colonias: ["Centro"] },
  "92000": { estado: "Tamaulipas", municipio: "Tampico", colonias: ["Centro"] },
  "97000": { estado: "Yucatán", municipio: "Mérida", colonias: ["Centro"] },
  "97010": { estado: "Yucatán", municipio: "Mérida", colonias: ["Centro"] },
  "98000": { estado: "Zacatecas", municipio: "Zacatecas", colonias: ["Centro"] },
};

/**
 * Procesa diferentes formatos de respuesta de APIs de códigos postales
 */
function processLocationData(data, code) {
  let locationData = null;

  // Formato 1: Array con objetos
  if (Array.isArray(data) && data.length > 0) {
    const firstResult = data[0];
    const response = firstResult.response || firstResult;
    
    // Extraer colonias si están disponibles
    let colonias = [];
    if (Array.isArray(firstResult.colonias)) {
      colonias = firstResult.colonias;
    } else if (firstResult.colonias) {
      colonias = [firstResult.colonias];
    } else if (response.colonias) {
      colonias = Array.isArray(response.colonias) ? response.colonias : [response.colonias];
    }

    locationData = {
      postalCode: code,
      estado: response.estado || firstResult.estado || response.Estado || firstResult.Estado || "Estado no disponible",
      municipio: response.municipio || response.ciudad || firstResult.municipio || firstResult.ciudad || response.Municipio || firstResult.Municipio || "Municipio no disponible",
      colonias: colonias.length > 0 ? colonias : ["Colonia no disponible"]
    };
  }
  // Formato 2: Objeto con propiedad response
  else if (data.response) {
    const response = data.response;
    let colonias = [];
    if (Array.isArray(response.colonias)) {
      colonias = response.colonias;
    } else if (response.colonias) {
      colonias = [response.colonias];
    }

    locationData = {
      postalCode: code,
      estado: response.estado || response.Estado || "Estado no disponible",
      municipio: response.municipio || response.ciudad || response.Municipio || "Municipio no disponible",
      colonias: colonias.length > 0 ? colonias : ["Colonia no disponible"]
    };
  }
  // Formato 3: Objeto directo
  else if (data.municipio || data.estado || data.Municipio || data.Estado) {
    let colonias = [];
    if (Array.isArray(data.colonias)) {
      colonias = data.colonias;
    } else if (data.colonias) {
      colonias = [data.colonias];
    }

    locationData = {
      postalCode: code,
      estado: data.estado || data.Estado || "Estado no disponible",
      municipio: data.municipio || data.ciudad || data.Municipio || "Municipio no disponible",
      colonias: colonias.length > 0 ? colonias : ["Colonia no disponible"]
    };
  }

  return locationData;
}

/**
 * Busca código postal en múltiples APIs externas
 */
async function fetchFromSepomexAPI(code) {
  const endpoints = [
    // API COPOMEX - Primera opción (más confiable)
    {
      url: `https://api.copomex.com/query/info_cp/${code}?type=simplified&token=pruebas`,
      name: 'COPOMEX',
      processResponse: (data) => {
        // Manejar diferentes formatos de respuesta de COPOMEX
        if (data && !data.error) {
          // Formato 1: data.response existe
          if (data.response) {
            const response = data.response;
            return {
              postalCode: code,
              estado: response.estado || response.Estado || response.estado_nombre || 'Estado no disponible',
              municipio: response.municipio || response.Municipio || response.municipio_nombre || 'Municipio no disponible',
              colonias: response.colonias || (response.colonia ? [response.colonia] : (response.colonias_array || ['Colonia no disponible']))
            };
          }
          // Formato 2: datos directos en el objeto
          if (data.estado || data.municipio) {
            return {
              postalCode: code,
              estado: data.estado || data.Estado || 'Estado no disponible',
              municipio: data.municipio || data.Municipio || 'Municipio no disponible',
              colonias: data.colonias || (data.colonia ? [data.colonia] : ['Colonia no disponible'])
            };
          }
          // Formato 3: array de resultados
          if (Array.isArray(data) && data.length > 0) {
            const first = data[0];
            return {
              postalCode: code,
              estado: first.estado || first.Estado || 'Estado no disponible',
              municipio: first.municipio || first.Municipio || 'Municipio no disponible',
              colonias: first.colonias || ['Colonia no disponible']
            };
          }
        }
        return null;
      }
    },
    // API SEPOMEX - formato simplificado
    {
      url: `https://api-sepomex.hckdrk.mx/query/info_cp/${code}?type=simplified`,
      name: 'SEPOMEX Simplified',
      processResponse: (data) => processLocationData(data, code)
    },
    // API SEPOMEX - formato completo
    {
      url: `https://api-sepomex.hckdrk.mx/query/get_cp_info/${code}`,
      name: 'SEPOMEX Full',
      processResponse: (data) => processLocationData(data, code)
    },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        // Timeout de 10 segundos
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const jsonData = await response.json();
        
        // Usar el procesador específico del endpoint si existe, sino usar el genérico
        const processed = endpoint.processResponse 
          ? endpoint.processResponse(jsonData)
          : processLocationData(jsonData, code);
        
        if (processed && processed.estado && processed.municipio) {
          return processed;
        }
      }
    } catch (error) {
      // Continuar con el siguiente endpoint
      console.log(`Error en endpoint ${endpoint.name}:`, error.message);
      continue;
    }
  }

  // Si ninguna API funcionó, intentar con OpenStreetMap Nominatim como último recurso
  try {
    // Buscar usando geocodificación directa (buscar por código postal en México)
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${code}&country=mx&format=json&addressdetails=1&limit=1&accept-language=es`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'PetPlace-MVP/1.0',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(8000)
      }
    );

    if (nominatimResponse.ok) {
      const nominatimData = await nominatimResponse.json();
      if (nominatimData && nominatimData.length > 0) {
        const result = nominatimData[0];
        const address = result.address || {};
        
        return {
          postalCode: code,
          estado: address.state || address.region || 'Estado no disponible',
          municipio: address.city || address.town || address.municipality || 'Municipio no disponible',
          colonias: address.suburb ? [address.suburb] : ['Colonia no disponible']
        };
      }
    }
  } catch (error) {
    console.log('Error en Nominatim:', error.message);
  }

  return null;
}

/**
 * Handler principal de la API route
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    // Validar que el código postal tenga 5 dígitos
    if (!code || code.length !== 5 || !/^\d{5}$/.test(code)) {
      return NextResponse.json(
        { error: 'Código postal inválido. Debe tener 5 dígitos numéricos.' },
        { status: 400 }
      );
    }

    // 1. Primero verificar base de datos local (más rápido)
    if (postalCodeDatabase[code]) {
      const localData = postalCodeDatabase[code];
      return NextResponse.json({
        success: true,
        data: {
          postalCode: code,
          estado: localData.estado,
          municipio: localData.municipio,
          colonias: localData.colonias
        }
      });
    }

    // 2. Si no está en la base local, intentar API externa
    const apiData = await fetchFromSepomexAPI(code);
    
    if (apiData) {
      return NextResponse.json({
        success: true,
        data: apiData
      });
    }

    // 3. Si ninguna fuente funcionó, retornar error
    return NextResponse.json(
      { 
        success: false,
        error: 'Código postal no encontrado. Por favor, verifica que el código sea correcto.' 
      },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error en API de código postal:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al buscar el código postal. Por favor, intenta de nuevo más tarde.' 
      },
      { status: 500 }
    );
  }
}


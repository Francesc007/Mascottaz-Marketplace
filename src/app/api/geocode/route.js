import { NextResponse } from 'next/server';

/**
 * API route para geocodificación inversa
 * Convierte coordenadas (lat, lng) a código postal usando OpenStreetMap Nominatim
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    // Validar coordenadas
    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Se requieren las coordenadas lat y lng' },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Coordenadas inválidas' },
        { status: 400 }
      );
    }

    // Usar OpenStreetMap Nominatim para geocodificación inversa (gratuita)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=es`,
        {
          method: 'GET',
          headers: {
            'User-Agent': 'PetPlace-MVP/1.0',
            'Accept': 'application/json'
          },
          signal: AbortSignal.timeout(10000)
        }
      );

      if (!response.ok) {
        throw new Error('Error en la API de geocodificación');
      }

      const data = await response.json();

      if (!data || !data.address) {
        return NextResponse.json(
          { error: 'No se pudo obtener la información de ubicación' },
          { status: 404 }
        );
      }

      const address = data.address;
      
      // Extraer código postal (puede estar en diferentes campos según el país)
      let postalCode = address.postcode || address.postal_code || address.postal;
      
      // Si no hay código postal directo, intentar obtenerlo de la respuesta completa
      if (!postalCode && data.display_name) {
        // Buscar código postal de 5 dígitos en el nombre de visualización
        const cpMatch = data.display_name.match(/\b\d{5}\b/);
        if (cpMatch) {
          postalCode = cpMatch[0];
        }
      }

      // Extraer estado y municipio/ciudad
      const estado = address.state || address.region || address.province || '';
      const municipio = address.city || address.town || address.municipality || address.county || '';
      const colonia = address.suburb || address.neighbourhood || address.quarter || '';

      // Si encontramos código postal, buscar información completa en nuestra API
      if (postalCode && postalCode.length === 5) {
        // Llamar a nuestra API de código postal para obtener información completa
        try {
          const cpResponse = await fetch(
            `${request.nextUrl.origin}/api/postal-code?code=${postalCode}`,
            {
              method: 'GET',
              headers: { 'Accept': 'application/json' }
            }
          );

          if (cpResponse.ok) {
            const cpData = await cpResponse.json();
            if (cpData.success && cpData.data) {
              return NextResponse.json({
                success: true,
                data: {
                  postalCode: postalCode,
                  estado: cpData.data.estado || estado,
                  municipio: cpData.data.municipio || municipio,
                  colonias: cpData.data.colonias || (colonia ? [colonia] : []),
                  coordinates: {
                    lat: latitude,
                    lng: longitude
                  }
                }
              });
            }
          }
        } catch (err) {
          // Si falla la búsqueda en nuestra API, usar los datos de Nominatim
          console.log('No se pudo obtener información completa del CP:', err);
        }
      }

      // Si no hay código postal o no se pudo obtener información completa, retornar lo que tenemos
      if (!postalCode) {
        return NextResponse.json(
          { error: 'No se pudo determinar el código postal desde las coordenadas' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          postalCode: postalCode,
          estado: estado || 'Estado no disponible',
          municipio: municipio || 'Municipio no disponible',
          colonias: colonia ? [colonia] : ['Colonia no disponible'],
          coordinates: {
            lat: latitude,
            lng: longitude
          }
        }
      });

    } catch (error) {
      console.error('Error en geocodificación inversa:', error);
      return NextResponse.json(
        { error: 'Error al obtener la ubicación. Por favor, intenta de nuevo.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error en API de geocodificación:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}





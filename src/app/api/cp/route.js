import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * API Route para buscar códigos postales en el archivo codigos_postales.txt
 * GET /api/cp?cp=XXXXX
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cp = searchParams.get('cp');

    // Validar que se proporcione el código postal
    if (!cp) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro cp (código postal)' },
        { status: 400 }
      );
    }

    // Validar formato del código postal (5 dígitos)
    if (!/^\d{5}$/.test(cp)) {
      return NextResponse.json(
        { error: 'El código postal debe tener 5 dígitos numéricos' },
        { status: 400 }
      );
    }

    // Obtener la ruta del archivo
    const filePath = join(process.cwd(), 'data', 'codigos_postales.txt');

    // Leer el archivo con codificación UTF-8
    const fileContent = await readFile(filePath, 'utf-8');

    // Dividir en líneas
    const lines = fileContent.split('\n');

    // Saltar las primeras 2 líneas (copyright y headers)
    const dataLines = lines.slice(2);

    // Array para almacenar los resultados
    const resultados = [];

    // Procesar cada línea
    for (const line of dataLines) {
      // Saltar líneas vacías
      if (!line.trim()) continue;

      // Dividir por el delimitador pipe "|"
      const columns = line.split('|');

      // Validar que tenga al menos 6 columnas (d_codigo, d_asenta, D_mnpio, d_estado, d_ciudad)
      if (columns.length < 6) continue;

      const codigoPostal = columns[0]?.trim();
      const colonia = columns[1]?.trim();
      const municipio = columns[3]?.trim();
      const estado = columns[4]?.trim();
      const ciudad = columns[5]?.trim();

      // Verificar que el código postal coincida
      if (codigoPostal === cp) {
        // Validar que todos los campos necesarios existan
        if (colonia && municipio && estado && ciudad) {
          resultados.push({
            colonia,
            municipio,
            estado,
            ciudad,
          });
        }
      }
    }

    // Si no se encontraron resultados
    if (resultados.length === 0) {
      return NextResponse.json(
        { error: 'Código postal no encontrado' },
        { status: 404 }
      );
    }

    // Si hay un solo resultado, retornarlo como objeto
    // Si hay múltiples resultados, retornarlos como array
    if (resultados.length === 1) {
      return NextResponse.json({
        cp,
        colonia: resultados[0].colonia,
        municipio: resultados[0].municipio,
        estado: resultados[0].estado,
        ciudad: resultados[0].ciudad,
      });
    } else {
      // Para múltiples resultados, retornar el primero (municipio y estado son iguales)
      return NextResponse.json({
        cp,
        colonia: resultados[0].colonia,
        municipio: resultados[0].municipio,
        estado: resultados[0].estado,
        ciudad: resultados[0].ciudad,
        totalColonias: resultados.length,
        todasLasColonias: resultados.map(r => r.colonia),
      });
    }

  } catch (error) {
    console.error('Error al leer el archivo de códigos postales:', error);
    
    // Verificar si el error es porque el archivo no existe
    if (error.code === 'ENOENT') {
      return NextResponse.json(
        { error: 'Archivo de códigos postales no encontrado' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}





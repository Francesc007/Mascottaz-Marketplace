import cpdata from "../lib/buscarCP.js";

export function buscarCP(codigoPostal) {
  const cp = codigoPostal.toString().trim();

  return cpdata.filter(
    (item) => item.d_codigo === cp
  );
}
  // Validar que el código postal tenga 5 dígitos
  if (!cp || cp.length !== 5 || !/^\d{5}$/.test(cp)) {
    return null;
  }

  // Filtrar solo registros válidos (que tengan d_codigo de 5 dígitos y no sean headers)
  // Excluir los primeros 2 registros que son metadata/headers
  const resultados = cpdata
    .slice(2) // Saltar los primeros 2 registros (headers)
    .filter((item) => {
      // Validar que sea un objeto válido con los campos necesarios
      if (!item || typeof item !== 'object') {
        return false;
      }

      // Validar d_codigo
      const codigo = item.d_codigo;
      if (!codigo || typeof codigo !== 'string' || codigo.length !== 5 || !/^\d{5}$/.test(codigo)) {
        return false;
      }

      // Validar que coincida con el código buscado
      if (codigo !== cp) {
        return false;
      }

      // Validar que tenga municipio y estado
      const municipio = item.D_mnpio;
      const estado = item.c_estado || item.d_estado; // Usar c_estado primero, luego d_estado como fallback

      if (!municipio || !estado || typeof municipio !== 'string' || typeof estado !== 'string') {
        return false;
      }

      // Excluir si el municipio o estado son iguales a los headers
      if (municipio === 'D_mnpio' || estado === 'd_estado' || estado === 'd_ciudad') {
        return false;
      }

      return true;
    });

  if (resultados.length === 0) {
    return null; // CP no encontrado
  }

  // Tomamos el primer resultado, suficiente para mostrar el municipio y estado
  const dato = resultados[0];

  // Extraer municipio
  const municipio = dato.D_mnpio;
  
  // Extraer estado - preferir c_estado que es más consistente
  let estado = dato.c_estado;
  
  // Si c_estado no existe o es inválido, usar d_estado
  if (!estado || estado.length < 2 || estado === 'd_estado' || estado === 'd_ciudad') {
    estado = dato.d_estado;
  }

  // Validar que los valores sean strings válidos y no sean headers o códigos
  if (!municipio || 
      typeof municipio !== 'string' || 
      municipio.length < 2 || 
      municipio === 'D_mnpio' ||
      /^[A-Z0-9]{1,3}$/i.test(municipio)) { // Rechazar si parece un código corto
    return null;
  }

  if (!estado || 
      typeof estado !== 'string' || 
      estado.length < 2 || 
      estado === 'd_estado' ||
      estado === 'd_ciudad' ||
      /^[A-Z0-9]{1,3}$/i.test(estado)) { // Rechazar si parece un código corto
    return null;
  }

  // Limpiar y retornar
  const municipioLimpio = municipio.trim();
  const estadoLimpio = estado.trim();

  // Validación final: asegurar que no sean solo números o caracteres especiales
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\.]+$/.test(municipioLimpio) || 
      !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\.]+$/.test(estadoLimpio)) {
    return null;
  }

  return {
    municipio: municipioLimpio,
    estado: estadoLimpio,
  };
}




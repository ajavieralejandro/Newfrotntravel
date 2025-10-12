// src/utils/compartir/generarUrlCompartir.ts

/**
 * Genera la URL completa para compartir un paquete
 * Prioriza el dominio de la agencia sobre window.location.origin
 * para funcionar correctamente en entornos multitenancy
 */
export const generarUrlCompartir = (
  paqueteId: string | number,
  dominioAgencia?: string | null,
  urlAgencia?: string | null
): string => {
  // 1. Intentar usar variable de entorno para producción
  const baseUrlEnv = import.meta.env.VITE_PUBLIC_URL;
  if (baseUrlEnv) {
    return `${baseUrlEnv}/paquetes-busqueda/${paqueteId}`;
  }

  // 2. Usar URL de la agencia si está disponible (más específica)
  if (urlAgencia && urlAgencia.trim()) {
    const url = urlAgencia.endsWith('/') ? urlAgencia.slice(0, -1) : urlAgencia;
    return `${url}/paquetes-busqueda/${paqueteId}`;
  }

  // 3. Usar dominio de la agencia si está disponible
  if (dominioAgencia && dominioAgencia.trim()) {
    // Asegurar que tenga protocolo
    const dominio = dominioAgencia.startsWith('http') 
      ? dominioAgencia 
      : `https://${dominioAgencia}`;
    const url = dominio.endsWith('/') ? dominio.slice(0, -1) : dominio;
    return `${url}/paquetes-busqueda/${paqueteId}`;
  }
  
  // 4. Fallback a window.location.origin (comportamiento actual)
  const baseUrl = window.location.origin;
  return `${baseUrl}/paquetes-busqueda/${paqueteId}`;
};

/**
 * Versión simplificada que recibe directamente el dominio base
 * Útil si se puede obtener el dominio desde otra fuente
 */
export const generarUrlCompartirConDominio = (
  paqueteId: string | number,
  dominioBase?: string
): string => {
  const baseUrl = dominioBase || window.location.origin;
  return `${baseUrl}/paquetes-busqueda/${paqueteId}`;
};

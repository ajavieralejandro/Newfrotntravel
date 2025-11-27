// src/services/paquetes/paquetesDestacadosService.ts

import { PaqueteData } from "../../interfaces/PaqueteData";

/** Estructura de la respuesta que devuelve tu endpoint Laravel */
interface RespuestaPaginada {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  data: PaqueteData[];
  // otros campos que no usamos ahora:
  // from?: number;
  // to?: number;
  // path?: string;
  // condiciones?: any;
  // atlas_diag?: any;
}

/** URL base de tu backend */
const API_BASE = "https://travelconnect.com.ar";

/**
 * Obtiene paquetes destacados paginados desde el backend Laravel.
 * Usa el endpoint /paquetes-paginados que ya mezcla:
 *   - paquetes propios de la agencia
 *   - paquetes externos (Atlas / AllSeasons) importados y persistidos
 *
 * @param page      Número de página (default: 1)
 * @param perPage   Cantidad por página (default: 9)
 * @param idAgencia ID de la agencia (opcional, pero recomendado)
 */
export const obtenerPaquetesDestacadosPaginados = async (
  page: number = 1,
  perPage: number = 9,
  idAgencia?: number
): Promise<{
  paquetes: PaqueteData[];
  paginaActual: number;
  ultimaPagina: number;
  total: number;
}> => {
  try {
    // Armamos los query params
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("per_page", String(perPage));

    // El backend espera "id" como ID de la agencia
    if (idAgencia !== undefined) {
      params.append("id", String(idAgencia));
    }

    const url = `${API_BASE}/paquetes-paginados?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const raw = await response.json();
    const data = raw as RespuestaPaginada;

    const paquetes: PaqueteData[] = data.data ?? [];

    return {
      paquetes,
      paginaActual: Number(data.current_page ?? 1),
      ultimaPagina: Number(data.last_page ?? 1),
      total: Number(data.total ?? paquetes.length),
    };
  } catch (error) {
    console.error("Error al obtener paquetes paginados:", error);
    return {
      paquetes: [],
      paginaActual: 1,
      ultimaPagina: 1,
      total: 0,
    };
  }
};

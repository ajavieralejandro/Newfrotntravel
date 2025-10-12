import axios from "axios";
import { PaqueteData } from "../../interfaces/PaqueteData";

interface RespuestaPaginada {
  current_page: number;
  last_page: number;
  total: number;
  data: PaqueteData[];
}

/**
 * Obtiene paquetes destacados paginados desde el backend.
 * @param page Número de página (default: 1)
 * @param perPage Cantidad por página (default: 8)
 * @param idAgencia ID de la agencia (opcional)
 */
export const obtenerPaquetesDestacadosPaginados = async (
  page: number = 1,
  perPage: number = 8,
  idAgencia?: number // ✅ ID debe ser tipo number
): Promise<{
  paquetes: PaqueteData[];
  paginaActual: number;
  ultimaPagina: number;
  total: number;
}> => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("per_page", perPage.toString());

    // ✅ Campo correcto según el backend: "id"
    if (idAgencia !== undefined) {
      params.append("id", idAgencia.toString());
    }

    const response = await axios.get<RespuestaPaginada>(
      `https://travelconnect.com.ar/paquetes-paginados?${params.toString()}`,
      {
        headers: {
          Origin: "https://tuviaje.travelconnect.com.ar",
          Accept: "application/json",
        },
      }
    );

    return {
      paquetes: response.data.data,
      paginaActual: response.data.current_page,
      ultimaPagina: response.data.last_page,
      total: response.data.total,
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

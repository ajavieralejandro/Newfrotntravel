import axios from "axios";
import { PaqueteData,HotelDetalle } from "../../interfaces/PaqueteData";
import type { ApiResponse } from "../../interfaces/ApiResponse";

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
  page: number = 0,
  perPage: number = 9,
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

   // const response = await axios.get<RespuestaPaginada>(
   //   `https://travelconnect.com.ar/tgx/search?country=&city=&check_in=&check_out=&ages=&client=travelspirit&access=32146&page=1&per_page=20`,
   //   {
   //     headers: {
   //       Accept: "application/json",
   //     },
   //   }
   // );
    const response = await fetch(`https://travelconnect.com.ar/tgx/search?country=&city=&check_in=&check_out=&ages=&client=travelspirit&access=32146&page=${page.toString()}&per_page=${perPage.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
        
      });

     const rawData = await response.json();
    const apiResp = rawData as ApiResponse;
    var paquetes: PaqueteData[] = [];
         // ✅ Mapeamos cada hotel a un PaqueteData
         paquetes  = (apiResp.options ?? []).map((o, index) => {
  // Buscamos el hotel correspondiente
  const hotelMatch = apiResp.hotels?.find(h => h.hotelCode === o.hotelCode);

  const hotelDetalle: HotelDetalle = {
    hotelName: o.hotelName ?? "Sin nombre",
    hotelCode: o.hotelCode ?? "",
    price: {
      gross: o.price?.gross ?? 0,
      currency: o.price?.currency ?? "USD",
    },
    roomCode: o.rooms?.[0]?.code ?? undefined,
    roomDescription: o.rooms?.[0]?.description ?? undefined,
    boardCode: o.boardCode ?? undefined,
    cancelPolicy: { refundable: o.cancelPolicy?.refundable ?? false },
    imageUrl:
      hotelMatch?.medias?.map(m => m.url) ??
      ["https://dummyimage.com/400x300/e0e0e0/555555.png&text=Sin+imagen+disponible"],

    // ✅ NUEVO: agregamos location correctamente
    location: hotelMatch
      ? {
          address: hotelMatch.location?.address ?? "",
          city: hotelMatch.location?.city ?? "",
          country: hotelMatch.location?.country ?? "",
          coordinates: {
            latitude: Number(hotelMatch.location?.coordinates?.latitude ?? 0),
            longitude: Number(hotelMatch.location?.coordinates?.longitude ?? 0),
          },
        }
      : undefined,
  };

  return {
    id: index + 1,
    titulo: hotelDetalle.hotelName,
    descripcion: `Alojamiento en ${hotelDetalle.hotelName}`,
    pais: hotelDetalle.location?.country ?? "",
    ciudad: hotelDetalle.location?.city ?? "",
    ciudad_iata: null,
    fecha_vigencia_desde: "01-11-2025",
    fecha_vigencia_hasta: "30-11-2025",
    cant_noches: 1,
    tipo_producto: "hotel",
    activo: true,
    prioridad: "media",
    imagen_principal:
      hotelDetalle.imageUrl?.[0] ??
      "https://dummyimage.com/400x300/e0e0e0/555555.png&text=Sin+imagen+disponible",
    edad_menores: 12,
    transporte: null,
    tipo_moneda: hotelDetalle.price.currency,
    descuento: "0",
    componentes: null,
    hotel: null,
    hotelDetalle: [hotelDetalle],
    galeria_imagenes:
      hotelDetalle.imageUrl ??
      ["https://dummyimage.com/400x300/e0e0e0/555555.png&text=Sin+imagen+disponible"],
    salidas: [],
  };
});


    return {
      paquetes: paquetes,
      paginaActual: apiResp.meta.pagination.page,
      ultimaPagina: apiResp.meta.pagination.total_pages,
      total: apiResp.meta.pagination.total,
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

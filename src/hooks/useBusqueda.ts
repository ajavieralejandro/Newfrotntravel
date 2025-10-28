import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormulario } from "../contextos/formulario/FormularioContext";
import { useDatosAgencia } from "../contextos/agencia/DatosAgenciaContext";
import type { HotelDetalle, PaqueteData } from "../interfaces/PaqueteData";
import type { PaqueteDataNew } from "../interfaces/PaqueteDataNew";
import type { ApiResponse } from "../interfaces/ApiResponse";
import { Countries } from "../interfaces/Countries";


const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "https://travelconnect.com.ar/tgx/search";

export const useBusqueda = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    ciudadOrigen,
    destino,
    fechaSalida,
    viajeros, // { adultos, menores }
    fechaVuelta,
    noches,
    resetFormulario,
  } = useFormulario();
  const { datosAgencia } = useDatosAgencia();

  const guardarValoresPrevios = () => {
    localStorage.setItem(
      "valoresPrevios",
      JSON.stringify({
        ciudadOrigen,
        destino,
        fechaSalida,
        viajeros,
        fechaVuelta,
        noches,
      })
    );
  };

  function parseCiudadPais(input: string) {
  // Expresión regular para capturar:
  // 1️⃣ Ciudad antes del guion
  // 2️⃣ País después del guion y antes del paréntesis
  // 3️⃣ Código opcional entre paréntesis
  const regex = /^(.+?)\s*-\s*(.+?)\s*\((\w{3})\)?$/;

  const match = input.trim().match(regex);

  if (match) {
    const ciudad = match[1].trim();
    const pais = match[2].trim();
    const codigo = match[3]?.trim();
    return { ciudad, pais, codigo };
  }

  // Si no hay paréntesis o formato distinto
  const partes = input.split("-");
  return {
    ciudad: partes[0]?.trim() ?? "",
    pais: partes[1]?.trim().split("(")[0].trim() ?? "",
    codigo: input.match(/\((\w{3})\)/)?.[1] ?? "",
  };
}

function formatearFecha(fecha: Date): string {
  // Convierte la fecha a ISO y toma solo la parte YYYY-MM-DD
  return fecha.toISOString().split("T")[0];
}

function getCountryCode(countryName: string): string | undefined {
  const found = Countries.find(
    (c) => c.name.toUpperCase().trim() === countryName.toUpperCase().trim()
  );
  return found?.code;
}
  const handleClick = async () => {
     if (!destino) {
      alert("Por favor, ingresá un destino antes de buscar.");
      return;
    }

    setLoading(true);

          const country = parseCiudadPais(destino).pais
      const city = parseCiudadPais(destino).ciudad

      const selected = Countries.find(c => c.name === country);

      const queryParams = new URLSearchParams({
        country: getCountryCode(country) ?? "",
        city: city,
        check_in: fechaSalida ? formatearFecha(fechaSalida) : "",
        check_out: fechaVuelta ? formatearFecha(fechaVuelta) : "",
        ages: "",
        //ages: Array(viajeros.adultos)
         // .fill(30)
         // .concat(Array(viajeros.menores).fill(10))
         // .join(","),
       // currency: "USD",
       // language: "es",
       // nationality: "AR",
        client: "travelspirit",
        access: "32146",
       // testMode: "false",
       // aggregate: "1",
      });

      const url = `${API_BASE_URL}?${queryParams.toString()}`;


    const payload = {
      ciudadOrigen: ciudadOrigen ?? "",
      destino: destino ?? "",
      fechaSalida: fechaSalida ? fechaSalida.toISOString() : null,
      viajeros, // { adultos, menores }
      agencia_id: datosAgencia?.idAgencia,
    };

    console.log("📤 Enviando solicitud con los siguientes datos:", payload);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
        
      });

      const rawData = await response.json();
      console.log("wahtaaa" , rawData)

       // ✅ Cast seguro
    // const paquetes: ApiResponse = rawData as ApiResponse;

      var paquetes: PaqueteData[] = [];

      if (response.status === 502) {
        console.warn("⚠️ No se encontraron paquetes para la búsqueda.");
        paquetes = [];
      } else if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      } else {
        //paquetes = (await response.json()) as PaqueteDataNew[];
      }

     // console.log("📦 Paquetes recibidos:", paquetes);



          // casteo seguro a la interfaz que modela la respuesta del API
    const apiResp = rawData as ApiResponse;

     // ✅ Mapeamos cada hotel a un PaqueteData
     paquetes  = (apiResp.options ?? []).map((o, index) => {
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
          apiResp.hotels
            ?.find(h => h.hotelCode === o.hotelCode)
            ?.medias
            ?.map(m => m.url) ??
          ["https://dummyimage.com/400x300/e0e0e0/555555.png&text=Sin+imagen+disponible"],
            };

      return {
        id: index + 1,
        titulo: hotelDetalle.hotelName,
        descripcion: `Alojamiento en ${hotelDetalle.hotelName}`,
        pais: "",
        ciudad: "",
        ciudad_iata: null,
        fecha_vigencia_desde: "01-11-2025",
        fecha_vigencia_hasta: "30-11-2025",
        cant_noches: 1,
        tipo_producto: "hotel",
        activo: true,
        prioridad: "media",
        imagen_principal: hotelDetalle.imageUrl?.[0] ?? "https://dummyimage.com/400x300/e0e0e0/555555.png&text=Sin+imagen+disponible",
        edad_menores: 12,
        transporte: null,
        tipo_moneda: hotelDetalle.price.currency,
        descuento: "0",
        componentes: null,
        hotel: null,
        hotelDetalle: [hotelDetalle],
        galeria_imagenes: hotelDetalle.imageUrl ?? ["https://dummyimage.com/400x300/e0e0e0/555555.png&text=Sin+imagen+disponible"],
        salidas: [],
      };
    });









      localStorage.setItem("resultadosBusqueda", JSON.stringify(paquetes));
      // ✅ Guardar valores ANTES del reset para persistir la última búsqueda
      guardarValoresPrevios();
      window.dispatchEvent(new Event("actualizarPaquetes"));
      navigate("/paquetes-busqueda");
      // ✅ Reset DESPUÉS de guardar y navegar
      resetFormulario();
    } catch (error) {
      console.error("❌ Error en la búsqueda:", error);
      alert("Hubo un error en la búsqueda. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleClick };
};

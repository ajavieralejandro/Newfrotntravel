import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormulario } from "../contextos/formulario/FormularioContext";
import { useDatosAgencia } from "../contextos/agencia/DatosAgenciaContext";
import type { HotelDetalle, PaqueteData } from "../interfaces/PaqueteData";
import type { ApiResponse } from "../interfaces/ApiResponse";
import { Countries } from "../interfaces/Countries";
import type { Dayjs } from "dayjs";

const TGX_SEARCH_URL =
  import.meta.env.VITE_TGX_URL ?? "https://travelconnect.com.ar/tgx/search";

const API_BASE_URL_PAQUETE =
  import.meta.env.VITE_API_URL ?? "https://travelconnect.com.ar";

export const useBusqueda = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    salida: ciudadOrigen,
    destino,
    fechaSalidaVuelos: fechaSalida,
    pasajeros: viajeros,
    fechaSalidaHotel: fechaVuelta,

    noches,
    destinoHotel,
    fechaEntradaHotel,
    fechaSalidaHotel,

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

  /* ================== DESTINO: SOPORTAR FORMATOS FLEXIBLES ================== */
  function parseCiudadPais(input: string) {
    const trimmed = (input ?? "").trim();
    if (!trimmed) return { ciudad: "", pais: "", codigo: "" };

    // 1) "Ciudad - País (ABC)"
    const regex = /^(.+?)\s*-\s*(.+?)\s*\((\w{3})\)?$/;
    const match = trimmed.match(regex);
    if (match) {
      const ciudad = match[1].trim();
      const pais = match[2].trim();
      const codigo = match[3]?.trim();
      return { ciudad, pais, codigo };
    }

    // 2) "Ciudad - País"
    if (trimmed.includes("-")) {
      const partes = trimmed.split("-");
      return {
        ciudad: partes[0]?.trim() ?? "",
        pais: partes[1]?.trim().split("(")[0].trim() ?? "",
        codigo: trimmed.match(/\((\w{3})\)/)?.[1] ?? "",
      };
    }

    // 3) "Ciudad, País"
    if (trimmed.includes(",")) {
      const partes = trimmed.split(",");
      return {
        ciudad: partes[0]?.trim() ?? "",
        pais: partes[1]?.trim() ?? "",
        codigo: "",
      };
    }

    // 4) Solo ciudad (ej: "Austin", "Miami Beach")
    return {
      ciudad: trimmed,
      pais: "",
      codigo: "",
    };
  }

  /* ================== FECHAS: ARG (DD/MM/YYYY) → YYYY-MM-DD ================== */
  function formatearFecha(
    fecha: Date | Dayjs | string | null
  ): string {
    if (!fecha) return "";

    // String
    if (typeof fecha === "string") {
      const trimmed = fecha.trim();

      // "DD/MM/YYYY" (formato argentino)
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
        const [dd, mm, yyyy] = trimmed.split("/");
        return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
      }

      // Ya viene "YYYY-MM-DD"
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
      }

      // Cualquier cosa que entienda Date
      const d = new Date(trimmed);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      return "";
    }

    // Date
    if (fecha instanceof Date) {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0");
      const day = String(fecha.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // Dayjs (o similar)
    const anyFecha = fecha as any;
    if (typeof anyFecha.format === "function") {
      return anyFecha.format("YYYY-MM-DD");
    }
    if (typeof anyFecha.toDate === "function") {
      const d: Date = anyFecha.toDate();
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    }

    return "";
  }

  function getCountryCode(countryName: string): string | undefined {
    const found = Countries.find(
      (c) =>
        c.name.toUpperCase().trim() === countryName.toUpperCase().trim()
    );
    return found?.code;
  }

  function buildAges(): string {
    if (!viajeros) return "";
    const adultos = viajeros.adultos ?? 1;
    const menores = viajeros.menores ?? 0;

    const edadesAdultos = Array(adultos).fill(30); // dummy
    const edadesMenores = Array(menores).fill(10); // dummy

    return [...edadesAdultos, ...edadesMenores].join(",");
  }

  const handleClick = async () => {
    setLoading(true);
    const pestanaActual = localStorage.getItem("pestanaActiva") || "paquetes";

    /* ================== HOTELES ================== */
    if (pestanaActual === "hoteles") {
      try {
        if (!destinoHotel) {
          alert("Por favor seleccioná un destino de hotel.");
          setLoading(false);
          return;
        }

        if (!fechaEntradaHotel || !fechaSalidaHotel) {
          alert("Por favor seleccioná fechas de entrada y salida para el hotel.");
          setLoading(false);
          return;
        }

        const { ciudad, pais } = parseCiudadPais(destinoHotel);

        if (!ciudad) {
          alert("No se pudo interpretar el destino del hotel. Elegí un destino válido.");
          setLoading(false);
          return;
        }

        const countryCode = pais ? (getCountryCode(pais) ?? "") : "";

        const checkIn = formatearFecha(fechaEntradaHotel);
        const checkOut = formatearFecha(fechaSalidaHotel);

        console.log("🧪 DEBUG hoteles", {
          destinoHotel,
          ciudad,
          pais,
          countryCode,
          rawEntrada: fechaEntradaHotel,
          rawSalida: fechaSalidaHotel,
          checkIn,
          checkOut,
          ages: buildAges(),
        });

        const queryParams = new URLSearchParams({
          country: countryCode,
          city: ciudad,
          check_in: checkIn,
          check_out: checkOut,
          ages: buildAges(),
          client: "travelspirit",
          access: "32146",
        });

        const url = `${TGX_SEARCH_URL}?${queryParams.toString()}`;
        console.log("🌐 Llamando TGX:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // Manejo explícito de 502 (HTML u otro formato)
        if (response.status === 502) {
          console.warn("TGX devolvió 502 (Bad Gateway) para hoteles.");
          alert(
            "No se pudieron obtener tarifas de hotel en este momento. " +
            "Probá cambiar las fechas o intentá más tarde."
          );
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        const rawData = await response.json();
        console.log("🔙 Respuesta TGX bruta:", rawData);

        const apiResp = rawData as ApiResponse;

        // Errores propios de TGX (ALL_PROCESSES_FAILED, BOOKDATE, etc.)
        if (apiResp.errors && apiResp.errors.length > 0) {
          console.error("Errores TGX:", apiResp.errors, apiResp.warnings);
          const mainError = apiResp.errors[0];
          alert(
            `No se pudieron obtener tarifas de hotel.\n\n${mainError.description}` +
              (apiResp.warnings?.[0]?.description
                ? `\n\nDetalle: ${apiResp.warnings[0].description}`
                : "")
          );
          setLoading(false);
          return;
        }

        let paquetes: PaqueteData[] = [];

        paquetes = (apiResp.options ?? []).map((o, index) => {
          const hotelMatch = apiResp.hotels?.find(
            (h) => h.hotelCode === o.hotelCode
          );

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
              hotelMatch?.medias?.map((m) => m.url) ?? [
                "https://dummyimage.com/400x300/e0e0e0/555555.png&text=Sin+imagen+disponible",
              ],
            location: hotelMatch
              ? {
                  address: hotelMatch.location?.address ?? "",
                  city: hotelMatch.location?.city ?? "",
                  country: hotelMatch.location?.country ?? "",
                  coordinates: {
                    latitude: Number(
                      hotelMatch.location?.coordinates?.latitude ?? 0
                    ),
                    longitude: Number(
                      hotelMatch.location?.coordinates?.longitude ?? 0
                    ),
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
              hotelDetalle.imageUrl ?? [
                "https://dummyimage.com/400x300/e0e0e0/555555.png&text=Sin+imagen+disponible",
              ],
            salidas: [],
          };
        });

        localStorage.setItem("resultadosBusqueda", JSON.stringify(paquetes));
        guardarValoresPrevios();
        window.dispatchEvent(new Event("actualizarPaquetes"));
        navigate("/paquetes-busqueda");
        localStorage.setItem("pestanaActiva", pestanaActual);
      } catch (error) {
        console.error("❌ Error en la búsqueda de hoteles:", error);
        alert(
          "Hubo un error en la búsqueda de hoteles. Por favor, intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    /* ================== PAQUETES ================== */
    try {
      const payload = {
        ciudadOrigen: ciudadOrigen ?? "",
        destino: destino ?? "",
        fechaSalida: fechaSalida ? fechaSalida.toISOString() : null,
        viajeros,
        agencia_id: datosAgencia?.idAgencia,
      };

      console.log("📤 Enviando solicitud de paquetes:", payload);

      const response = await fetch(`${API_BASE_URL_PAQUETE}/importar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let paquetes: PaqueteData[] = [];

      if (response.status === 404) {
        console.warn("No se encontraron paquetes para la búsqueda.");
        paquetes = [];
      } else if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      } else {
        paquetes = (await response.json()) as PaqueteData[];
      }

      console.log("🎒 Paquetes recibidos:", paquetes);

      localStorage.setItem("resultadosBusqueda", JSON.stringify(paquetes));
      guardarValoresPrevios();
      window.dispatchEvent(new Event("actualizarPaquetes"));
      navigate("/paquetes-busqueda");
    } catch (error) {
      console.error("❌ Error en la búsqueda de paquetes:", error);
      alert("Hubo un error en la búsqueda. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleClick };
};

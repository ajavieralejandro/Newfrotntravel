// hooks/useBusquedaPorCarta.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PaqueteData } from "../interfaces/PaqueteData";

export const useBusquedaPorCarta = () => {
  const [loading, setLoading] = useState(false);
  const [paqueteActivo, setPaqueteActivo] = useState<PaqueteData | null>(null);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);

  const navigate = useNavigate();

  const buscarPorId = async (id: String) => {
    setLoading(true);
    setErrorBusqueda(null);
/** 
    try {
      const response = await fetch(`https://travelconnect.com.ar/get_paquete2/${idPaquete}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn("⚠️ NO SE ENCONTRÓ EL PAQUETE.");
          setPaqueteActivo(null);
          setErrorBusqueda("No se encontró el paquete solicitado.");
          return;
        }
        throw new Error(`ERROR AL BUSCAR PAQUETE. CÓDIGO: ${response.status}`);
      }

      // Sin transformador: usamos lo que venga.
      const responseData: unknown = await response.json();
      const dataArr: PaqueteData[] = Array.isArray(responseData)
        ? (responseData as PaqueteData[])
        : Array.isArray((responseData as any)?.data)
        ? ((responseData as any).data as PaqueteData[])
        : (responseData as any)?.data
        ? [((responseData as any).data as PaqueteData)]
        : responseData
        ? [responseData as PaqueteData]
        : [];

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log("🧩 Paquete(s) recibido(s) (sin transformar):", dataArr);
      }

      if (dataArr.length === 0) {
        setPaqueteActivo(null);
        setErrorBusqueda("No se encontró el paquete solicitado.");
        return;
      }
*/
      let paqStr = localStorage.getItem("paqueteAct");
      if (!paqStr) {
        setErrorBusqueda("No se encontró el paquete almacenado.");
        setLoading(false);
        return;
      }

      // ✅ Parsear el JSON a objeto
      const paq = JSON.parse(paqStr) as PaqueteData;

      // ✅ Guardar en estado
      setPaqueteActivo(paq);
      localStorage.setItem("resultadosBusqueda", JSON.stringify(Array.isArray(paq)));
      window.dispatchEvent(new Event("actualizarPaquetes"));

      if (!window.location.pathname.includes("/paquetes-busqueda")) {
        navigate("/paquetes-busqueda");
      }
 //   } catch (error) {
 //     console.error("❌ ERROR AL BUSCAR PAQUETE POR ID:", error);
 //     setErrorBusqueda("Ocurrió un error al buscar el paquete. Intentalo más tarde.");
 //   } finally {
      setLoading(false);
 //   }
  };

  const limpiarPaqueteActivo = () => setPaqueteActivo(null);
  const limpiarErrorBusqueda = () => setErrorBusqueda(null);

  return {
    buscarPorId,
    loading,
    paqueteActivo,
    errorBusqueda,
    limpiarPaqueteActivo,
    limpiarErrorBusqueda,
  };
};

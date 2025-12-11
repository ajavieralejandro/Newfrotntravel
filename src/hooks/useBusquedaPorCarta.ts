// hooks/useBusquedaPorCarta.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PaqueteData } from "../interfaces/PaqueteData";

export const useBusquedaPorCarta = () => {
  const [loading, setLoading] = useState(false);
  const [paqueteActivo, setPaqueteActivo] = useState<PaqueteData | null>(null);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);

  const navigate = useNavigate();

  const buscarPorId = async (idParam: string) => {
    setLoading(true);
    setErrorBusqueda(null);

    try {
      // 👇 Aseguramos string limpio (no number, no NaN)
      const id = String(idParam).trim();

      if (!id) {
        setErrorBusqueda("ID de paquete inválido.");
        setPaqueteActivo(null);
        return;
      }

      const url = `/get_paquete2/${encodeURIComponent(id)}`;
      // console.log("Buscando paquete por ID:", id, "URL:", url);

      const resp = await fetch(url);

      if (!resp.ok) {
        if (resp.status === 404) {
          setErrorBusqueda("Paquete no encontrado.");
        } else {
          setErrorBusqueda("Ocurrió un error al buscar el paquete.");
        }
        setPaqueteActivo(null);
        return;
      }

      const body = await resp.json();

      const paquete = body?.data as PaqueteData | undefined;

      if (!paquete) {
        setErrorBusqueda("Paquete no encontrado.");
        setPaqueteActivo(null);
        return;
      }

      // ✅ Guardar en estado
      setPaqueteActivo(paquete);

      // ✅ Seguir usando localStorage como antes
      localStorage.setItem("paqueteAct", JSON.stringify(paquete));
      localStorage.setItem("resultadosBusqueda", JSON.stringify([paquete]));
      window.dispatchEvent(new Event("actualizarPaquetes"));

      // Si no estás ya en /paquetes-busqueda, te lleva
      if (!window.location.pathname.includes("/paquetes-busqueda")) {
        navigate(`/paquetes-busqueda/${encodeURIComponent(id)}`);
      }
    } catch (error) {
      console.error("Error buscando paquete:", error);
      setErrorBusqueda("Ocurrió un error al buscar el paquete.");
      setPaqueteActivo(null);
    } finally {
      setLoading(false);
    }
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

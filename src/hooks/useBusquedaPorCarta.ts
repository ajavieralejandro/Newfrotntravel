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

      localStorage.setItem("resultadosBusqueda", JSON.stringify([paq]));
      window.dispatchEvent(new Event("actualizarPaquetes"));

      if (!window.location.pathname.includes("/paquetes-busqueda")) {
        navigate("/paquetes-busqueda");
      }
      setLoading(false);

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

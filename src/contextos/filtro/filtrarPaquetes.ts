// contextos/filtro/filtrarPaquetes.ts
import { PaqueteData } from "../../interfaces/PaqueteData";
import { Filtros } from "./FiltrosYOrdenamientoContext";
import { cumpleFiltrosDeRango } from "./cumpleFiltrosDeRangos";
import { cumpleFiltrosDeSeleccionMultiple } from "./cumpleFiltrosDeSeleccionMultiple";
import { cumpleFiltrosBooleanos } from "./cumpleFiltrosBooleanos";

/**
 * Aplica todos los filtros activos sobre una lista de paquetes.
 * Devuelve solo los que cumplan con los criterios actuales.
 */
export const filtrarPaquetes = (
  paquetes: PaqueteData[],
  filtros: Filtros
): PaqueteData[] => {
  const q = filtros.busquedaNombre?.trim().toLowerCase() ?? "";

  return paquetes.filter((paquete) => {
    const pasaRango = cumpleFiltrosDeRango(paquete, filtros);
    const pasaMultiple = cumpleFiltrosDeSeleccionMultiple(paquete, filtros);
    const pasaBooleano = cumpleFiltrosBooleanos(paquete, filtros);

    const pasaBusquedaNombre =
      q === "" || (paquete.titulo ?? "").toLowerCase().includes(q);

    return pasaRango && pasaMultiple && pasaBooleano && pasaBusquedaNombre;
  });
};

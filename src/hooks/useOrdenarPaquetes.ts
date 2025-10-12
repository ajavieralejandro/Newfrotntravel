import { useFiltrosYOrdenamiento } from "../contextos/filtro/FiltrosYOrdenamientoContext";
import { ordenarPaquetes } from "../contextos/filtro/ordenarPaquetes";
import { PaqueteData } from "../interfaces/PaqueteData";

/**
 * Hook que devuelve los paquetes ordenados según el contexto global.
 * Utiliza `ordenarPaquetes` para aplicar los criterios definidos por el usuario.
 */
export const usePaquetesOrdenados = (paquetes: PaqueteData[]): PaqueteData[] => {
  const { ordenamientos, prioridadOrdenamientos } = useFiltrosYOrdenamiento();
  return ordenarPaquetes(paquetes, ordenamientos, prioridadOrdenamientos);
};

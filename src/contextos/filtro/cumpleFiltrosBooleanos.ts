import { PaqueteData } from "../../interfaces/PaqueteData";
import { Filtros } from "./FiltrosYOrdenamientoContext";

export const cumpleFiltrosBooleanos = (
  paquete: PaqueteData,
  filtros: Filtros
): boolean => {
  // ✅ Venta online: pasa si alguna salida tiene venta_online = true/1
  if (filtros.ventaOnline) {
    const hayVentaOnline = Array.isArray(paquete.salidas) &&
      paquete.salidas.some((s) => Number(s.venta_online) === 1);
    if (!hayVentaOnline) return false;
  }

  return true;
};

import { PaqueteData } from "../../interfaces/PaqueteData";
import { Filtros } from "./FiltrosYOrdenamientoContext";

const norm = (v?: string | null) => (v ?? "").toString().trim().toLowerCase();
const normU = (v?: string | null) => (v ?? "").toString().trim().toUpperCase();
const toNum = (v: number | string | null | undefined): number => {
  if (v === null || v === undefined) return NaN;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isNaN(n) ? NaN : n;
};

export const cumpleFiltrosDeSeleccionMultiple = (
  paquete: PaqueteData,
  filtros: Filtros
): boolean => {
  // 1) Ciudad
  if (
    filtros.ciudades.length > 0 &&
    !filtros.ciudades.map(norm).includes(norm(paquete.ciudad))
  ) return false;

  // 2) Hoteles (paquete.hotel puede ser objeto o array)
  if (filtros.hoteles.length > 0) {
    const hoteles = Array.isArray(paquete.hotel)
      ? paquete.hotel
      : paquete.hotel
      ? [paquete.hotel]
      : [];
    const nombresHotel = hoteles.map((h) => norm(h?.nombre));
    const seleccion = filtros.hoteles.map(norm);
    const hayMatchHotel = nombresHotel.some((n) => seleccion.includes(n));
    if (!hayMatchHotel) return false;
  }

  // 3) Habitaciones: pasa si alguna salida tiene precio > 0 para alguno de los tipos elegidos
  if (filtros.habitaciones.length > 0) {
    const tipos = filtros.habitaciones; // ["single","doble","triple","cuadruple","familia_1","familia_2"]
    const hayTipoDisponible = Array.isArray(paquete.salidas) && paquete.salidas.some((s) =>
      tipos.some((t) => {
        const key = `${t}_precio` as keyof typeof s;
        const val = toNum((s as any)[key]);
        return !Number.isNaN(val) && val > 0;
      })
    );
    if (!hayTipoDisponible) return false;
  }

  // 4) Aerolíneas (ida o vuelta en alguna salida)
  if (filtros.aerolineas.length > 0) {
    const buscadas = filtros.aerolineas.map(norm);
    const hayAero = Array.isArray(paquete.salidas) && paquete.salidas.some((s) => {
      const ida = norm(s.ida_linea_aerea);
      const vuelta = norm(s.vuelta_linea_aerea);
      return buscadas.includes(ida) || buscadas.includes(vuelta);
    });
    if (!hayAero) return false;
  }

  // 5) Ciudades de origen del vuelo (ida o vuelta) en alguna salida
  if (filtros.ciudadesOrigenVuelo.length > 0) {
    const buscadas = filtros.ciudadesOrigenVuelo.map(norm);
    const hayOrigen = Array.isArray(paquete.salidas) && paquete.salidas.some((s) => {
      const ida = norm(s.ida_origen_ciudad);
      const vuelta = norm(s.vuelta_origen_ciudad);
      return buscadas.includes(ida) || buscadas.includes(vuelta);
    });
    if (!hayOrigen) return false;
  }

  // 6) Ciudades de destino del vuelo (ida o vuelta) en alguna salida
  if (filtros.ciudadesDestinoVuelo.length > 0) {
    const buscadas = filtros.ciudadesDestinoVuelo.map(norm);
    const hayDestino = Array.isArray(paquete.salidas) && paquete.salidas.some((s) => {
      const ida = norm(s.ida_destino_ciudad);
      const vuelta = norm(s.vuelta_destino_ciudad);
      return buscadas.includes(ida) || buscadas.includes(vuelta);
    });
    if (!hayDestino) return false;
  }

  // 7) Tipo de moneda (a nivel paquete)
  if (
    filtros.tipoMoneda.length > 0 &&
    !filtros.tipoMoneda.map(normU).includes(normU(paquete.tipo_moneda))
  ) return false;

  return true;
};

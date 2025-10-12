import { PaqueteData } from "../../interfaces/PaqueteData";
import { Filtros } from "./FiltrosYOrdenamientoContext";

const toNumber = (v: number | string | null | undefined): number => {
  if (v === null || v === undefined) return NaN;
  if (typeof v === "number") return v;
  const s = String(v).replace(",", ".").trim();
  const n = parseFloat(s);
  return Number.isNaN(n) ? NaN : n;
};

const parseDDMMYYYY = (s?: string | null): Date | null => {
  if (!s) return null;
  const [dd, mm, yyyy] = s.split("-");
  const d = Number(dd), m = Number(mm), y = Number(yyyy);
  if (!d || !m || !y) return null;
  // Mes en JS es 0-indexado
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const cumpleFiltrosDeRango = (paquete: PaqueteData, filtros: Filtros): boolean => {
  // 1) PRECIO: doble_precio de la PRIMER salida
  const s0 = paquete.salidas?.[0];
  const precio = toNumber(s0?.doble_precio);
  const [minPrecio, maxPrecio] = filtros.precio;
  // Si no hay precio válido y el usuario fijó un mínimo > 0, no pasa
  if (Number.isNaN(precio)) {
    if (minPrecio > 0) return false;
  } else {
    if (precio < minPrecio || precio > maxPrecio) return false;
  }

  // 2) DURACIÓN: (vuelta - inicio) de la PRIMER salida, en noches (días)
  const inicio =
    parseDDMMYYYY(s0?.fecha_desde) ??
    parseDDMMYYYY(s0?.ida_origen_fecha);
  const fin =
    parseDDMMYYYY(s0?.fecha_hasta) ??
    parseDDMMYYYY(s0?.vuelta_destino_fecha);

  let noches = 0;
  if (inicio && fin) {
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    noches = Math.max(0, Math.round((fin.getTime() - inicio.getTime()) / MS_PER_DAY));
  } else {
    // Fallback si faltan fechas en la primera salida
    noches = typeof paquete.cant_noches === "number" ? paquete.cant_noches : 0;
  }

  const [minNoches, maxNoches] = filtros.duracion;
  if (noches < minNoches || noches > maxNoches) return false;

  // 3) ESTRELLAS: desde paquete.hotel (objeto o array)
  const hoteles = Array.isArray(paquete.hotel)
    ? paquete.hotel
    : paquete.hotel
    ? [paquete.hotel]
    : [];

  const estrellasHoteles = hoteles
    .map((h) => toNumber(h?.categoria_hotel as any))
    .filter((n) => !Number.isNaN(n));

  const [minEst, maxEst] = filtros.estrellas;

  // Si el usuario dejó el rango por defecto (0–5), no restringimos por estrellas.
  const rangoEstrellasPorDefecto = minEst === 0 && maxEst === 5;

  if (!rangoEstrellasPorDefecto) {
    const hayAlgunaEnRango =
      estrellasHoteles.length > 0 &&
      estrellasHoteles.some((e) => e >= minEst && e <= maxEst);
    if (!hayAlgunaEnRango) return false;
  }

  return true;
};

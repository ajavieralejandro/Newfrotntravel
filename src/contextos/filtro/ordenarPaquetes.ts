// contextos/filtro/ordenarPaquetes.ts
import { PaqueteData } from "../../interfaces/PaqueteData";
import { Ordenamientos } from "./FiltrosYOrdenamientoContext";

// Utils
const toNumber = (v: number | string | null | undefined): number => {
  if (v === null || v === undefined) return NaN;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v).replace(",", ".").trim());
  return Number.isNaN(n) ? NaN : n;
};

const parseDDMMYYYY = (s?: string | null): number | null => {
  if (!s) return null;
  const [dd, mm, yyyy] = s.split("-");
  const d = Number(dd), m = Number(mm), y = Number(yyyy);
  if (!d || !m || !y) return null;
  const t = new Date(y, m - 1, d).getTime();
  return Number.isNaN(t) ? null : t;
};

const firstSalida = (p: PaqueteData) => Array.isArray(p.salidas) ? p.salidas[0] : undefined;

/** Precio base: doble_precio de la PRIMER salida */
const precioBase = (p: PaqueteData): number => {
  const s0 = firstSalida(p);
  return toNumber(s0?.doble_precio);
};

/** Timestamp de fecha de salida para ordenar (PRIMER salida) */
const tsSalida = (p: PaqueteData): number => {
  const s0 = firstSalida(p);
  // Prioridad: fecha_desde -> ida_origen_fecha -> fecha_viaje
  const a =
    parseDDMMYYYY(s0?.fecha_desde) ??
    parseDDMMYYYY(s0?.ida_origen_fecha) ??
    parseDDMMYYYY(s0?.fecha_viaje);
  return a ?? NaN;
};

/** Duración (noches) desde PRIMER salida: (fin - inicio) */
const nochesDesdePrimeraSalida = (p: PaqueteData): number => {
  const s0 = firstSalida(p);
  const ini =
    parseDDMMYYYY(s0?.fecha_desde) ??
    parseDDMMYYYY(s0?.ida_origen_fecha);
  const fin =
    parseDDMMYYYY(s0?.fecha_hasta) ??
    parseDDMMYYYY(s0?.vuelta_destino_fecha);

  if (ini != null && fin != null) {
    const MS = 24 * 60 * 60 * 1000;
    return Math.max(0, Math.round((fin - ini) / MS));
  }
  // Fallback al campo del paquete si falta alguna de las fechas
  return typeof p.cant_noches === "number" ? p.cant_noches : 0;
};

// ---- Ordenamiento principal ----

/**
 * Ordena un arreglo de paquetes según el conjunto de ordenamientos y su prioridad.
 */
export const ordenarPaquetes = (
  paquetes: PaqueteData[],
  ordenamientos: Ordenamientos,
  prioridades: (keyof Ordenamientos)[]
): PaqueteData[] => {
  const out = [...paquetes];

  // Aplicamos cada criterio (último = mayor prioridad)
  for (let i = prioridades.length - 1; i >= 0; i--) {
    const campo = prioridades[i];
    const orden = ordenamientos[campo];
    if (!orden) continue;

    out.sort((a, b) => {
      let av: number | string;
      let bv: number | string;

      switch (campo) {
        case "precio": {
          av = precioBase(a);
          bv = precioBase(b);
          // Missing price: empujar al final en ambos sentidos
          if (Number.isNaN(av)) av = orden === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
          if (Number.isNaN(bv)) bv = orden === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
          break;
        }
        case "salida": {
          av = tsSalida(a);
          bv = tsSalida(b);
          if (Number.isNaN(av)) av = orden === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
          if (Number.isNaN(bv)) bv = orden === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
          break;
        }
        case "duracion": {
          av = nochesDesdePrimeraSalida(a);
          bv = nochesDesdePrimeraSalida(b);
          break;
        }
        case "nombre": {
          av = (a.titulo ?? "").toLowerCase().trim();
          bv = (b.titulo ?? "").toLowerCase().trim();
          break;
        }
        default:
          av = 0;
          bv = 0;
      }

      if (av < bv) return orden === "asc" ? -1 : 1;
      if (av > bv) return orden === "asc" ? 1 : -1;

      // Tiebreak estable por id
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });
  }

  return out;
};

import React, { createContext, useContext, useState, useEffect } from "react";

/** Orden ascendente/descendente o sin ordenar */
type Orden = "asc" | "desc" | null;

/**
 * Filtros activos de la UI.
 * Nota:
 * - `precio` será evaluado como el `doble_precio` de la **primera salida** del paquete.
 * - `duracion` será evaluada como (fecha de vuelta − fecha de inicio) de la **primera salida**.
 */
export interface Filtros {
  ciudades: string[];
  hoteles: string[];
  estrellas: [number, number];      // Rango 0–5 (coercer string|number)
  precio: [number, number];         // Usado contra salida[0].doble_precio (coercer string)
  duracion: [number, number];       // En noches, desde salida[0] (vuelta - inicio)
  habitaciones: string[];           // ["single","doble","triple","cuadruple","familia_1","familia_2"]
  aerolineas: string[];             // Desde salidas (ida/vuelta)
  ciudadesOrigenVuelo: string[];    // Desde salidas
  ciudadesDestinoVuelo: string[];   // Desde salidas
  tipoMoneda: string[];             // paquete.tipo_moneda
  ventaOnline: boolean;             // true => alguna salida con venta_online truthy
  busquedaNombre: string;           // título (y opcionalmente ciudad/hotel en helpers)
  /** NUEVO: rango de fechas para filtrar salidas (formato "DD-MM-YYYY") */
  fecha: { desde: string | null; hasta: string | null };
}

/** Campos soportados para ordenar */
export interface Ordenamientos {
  salida: Orden;    // fecha más cercana (salida[0] o min entre salidas)
  precio: Orden;    // mismo criterio que filtros: salida[0].doble_precio
  nombre: Orden;    // título
  duracion: Orden;  // noches desde salida[0]
}

interface FiltrosYOrdenamientoContextType {
  filtros: Filtros;
  ordenamientos: Ordenamientos;
  prioridadOrdenamientos: (keyof Ordenamientos)[];
  setFiltros: (nuevosFiltros: Partial<Filtros>) => void;
  setOrdenamientos: (campo: keyof Ordenamientos, orden: Orden) => void;
  setPrioridadOrdenamientos: (prioridades: (keyof Ordenamientos)[]) => void;
  resetFiltrosYOrdenamientos: () => void;
}

/** Estado inicial de filtros */
export const filtrosIniciales: Filtros = {
  ciudades: [],
  hoteles: [],
  estrellas: [0, 5],
  precio: [0, 100000000],
  duracion: [1, 30],
  habitaciones: [],
  aerolineas: [],
  ciudadesOrigenVuelo: [],
  ciudadesDestinoVuelo: [],
  tipoMoneda: [],
  ventaOnline: false,
  busquedaNombre: "",
  fecha: { desde: null, hasta: null }, // 👈 NUEVO
};

/** Estado inicial de ordenamientos */
const ordenamientosIniciales: Ordenamientos = {
  salida: null,
  precio: null,
  nombre: null,
  duracion: null,
};

// Contexto
const FiltrosYOrdenamientoContext = createContext<
  FiltrosYOrdenamientoContextType | undefined
>(undefined);

// Provider
export const FiltrosYOrdenamientoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filtros, setFiltrosState] = useState<Filtros>(filtrosIniciales);
  const [ordenamientos, setOrdenamientosState] =
    useState<Ordenamientos>(ordenamientosIniciales);
  const [prioridadOrdenamientos, setPrioridadOrdenamientos] = useState<
    (keyof Ordenamientos)[]
  >([]);

  const setFiltros = (nuevosFiltros: Partial<Filtros>) => {
    setFiltrosState((prev) => ({ ...prev, ...nuevosFiltros }));
  };

  const setOrdenamientos = (campo: keyof Ordenamientos, orden: Orden) => {
    setOrdenamientosState((prev) => ({ ...prev, [campo]: orden }));
    setPrioridadOrdenamientos((prev) => {
      const sinCampo = prev.filter((p) => p !== campo);
      return [...sinCampo, campo];
    });
  };

  const resetFiltrosYOrdenamientos = () => {
    setFiltrosState(filtrosIniciales);
    setOrdenamientosState(ordenamientosIniciales);
    setPrioridadOrdenamientos([]);
    localStorage.removeItem("filtros");
    localStorage.removeItem("ordenamientos");
    localStorage.removeItem("prioridadOrdenamientos");
  };

  // Rehidratación desde localStorage (best-effort)
  useEffect(() => {
    try {
      const filtrosLS = localStorage.getItem("filtros");
      const ordenamientosLS = localStorage.getItem("ordenamientos");
      const prioridadesLS = localStorage.getItem("prioridadOrdenamientos");

      if (filtrosLS) setFiltrosState({ ...filtrosIniciales, ...JSON.parse(filtrosLS) });
      if (ordenamientosLS)
        setOrdenamientosState({ ...ordenamientosIniciales, ...JSON.parse(ordenamientosLS) });
      if (prioridadesLS) setPrioridadOrdenamientos(JSON.parse(prioridadesLS));
    } catch {
      // Si hay datos viejos/rotos en LS, volvemos a defaults
      setFiltrosState(filtrosIniciales);
      setOrdenamientosState(ordenamientosIniciales);
      setPrioridadOrdenamientos([]);
    }
  }, []);

  // Persistencia en localStorage
  useEffect(() => {
    localStorage.setItem("filtros", JSON.stringify(filtros));
    localStorage.setItem("ordenamientos", JSON.stringify(ordenamientos));
    localStorage.setItem("prioridadOrdenamientos", JSON.stringify(prioridadOrdenamientos));
  }, [filtros, ordenamientos, prioridadOrdenamientos]);

  return (
    <FiltrosYOrdenamientoContext.Provider
      value={{
        filtros,
        ordenamientos,
        prioridadOrdenamientos,
        setFiltros,
        setOrdenamientos,
        setPrioridadOrdenamientos,
        resetFiltrosYOrdenamientos,
      }}
    >
      {children}
    </FiltrosYOrdenamientoContext.Provider>
  );
};

// Hook
export const useFiltrosYOrdenamiento = () => {
  const ctx = useContext(FiltrosYOrdenamientoContext);
  if (!ctx) throw new Error("useFiltrosYOrdenamiento debe usarse dentro de FiltrosYOrdenamientoProvider");
  return ctx;
};

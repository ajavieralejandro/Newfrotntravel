// contextos/paquetes/PaquetesContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import type { PaqueteData } from "../../interfaces/PaqueteData";
import {
  buscarPaquetes as buscarPaquetesService,
  fetchPaquetes as fetchPaquetesService,
  type BusquedaQuery,
  type ListadoParams,
} from "../../services/paquetes/consultaService";

type SimpleQuery = Omit<BusquedaQuery, "signal">;

interface PaquetesContextProps {
  paquetes: PaqueteData[];
  cargando: boolean;
  error: string | null;
  queryActual: SimpleQuery | null;

  /** Acciones */
  buscarPaquetes: (query: SimpleQuery) => Promise<void>;
  refrescar: () => Promise<void>;

  /** Compat: mantener API previa para setear manualmente */
  cargarPaquetes: (nuevosPaquetes: PaqueteData[]) => void;
}

const PaquetesContext = createContext<PaquetesContextProps | undefined>(undefined);

export const PaquetesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paquetes, setPaquetes] = useState<PaqueteData[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryActual, setQueryActual] = useState<SimpleQuery | null>(null);

  /** AbortController para cancelar fetches en curso */
  const abortRef = useRef<AbortController | null>(null);
  const cancelInFlight = () => {
    abortRef.current?.abort();
    abortRef.current = null;
  };

  useEffect(() => {
    return () => cancelInFlight(); // cancelar al desmontar
  }, []);

  const cargarPaquetes = useCallback((nuevosPaquetes: PaqueteData[]) => {
    setPaquetes(nuevosPaquetes ?? []);
  }, []);

  const buscarPaquetes = useCallback(async (query: SimpleQuery) => {
    setCargando(true);
    setError(null);
    setQueryActual(query ?? null);

    cancelInFlight();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const resultado = await buscarPaquetesService({ ...query, signal: controller.signal });
      setPaquetes(resultado);
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") {
        console.error("Error en buscarPaquetes:", e);
        setError("No se pudieron cargar los paquetes.");
        setPaquetes([]);
      }
    } finally {
      setCargando(false);
    }
  }, []);

  const refrescar = useCallback(async () => {
    // Si hay query previa, re-ejecuta la búsqueda; si no, trae listado base
    if (queryActual) {
      await buscarPaquetes(queryActual);
      return;
    }

    setCargando(true);
    setError(null);

    cancelInFlight();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const resultado = await fetchPaquetesService({ signal: controller.signal } as ListadoParams);
      setPaquetes(resultado);
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") {
        console.error("Error al refrescar paquetes:", e);
        setError("No se pudieron refrescar los paquetes.");
        setPaquetes([]);
      }
    } finally {
      setCargando(false);
    }
  }, [queryActual, buscarPaquetes]);

  const value = useMemo(
    () => ({
      paquetes,
      cargando,
      error,
      queryActual,
      buscarPaquetes,
      refrescar,
      cargarPaquetes,
    }),
    [paquetes, cargando, error, queryActual, buscarPaquetes, refrescar, cargarPaquetes]
  );

  return <PaquetesContext.Provider value={value}>{children}</PaquetesContext.Provider>;
};

export const usePaquetes = (): PaquetesContextProps => {
  const context = useContext(PaquetesContext);
  if (!context) throw new Error("usePaquetes debe ser usado dentro de un PaquetesProvider");
  return context;
};

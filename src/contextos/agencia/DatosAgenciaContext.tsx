import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { DatosAgencia } from "../../interfaces/datosAgencia";
import { fetchDatosAgencia } from "../../services/agencia/datosAgenciaService";

/** Tipo del contexto */
interface DatosAgenciaContextType {
  datosAgencia: DatosAgencia | null;
  cargando: boolean;
}

/** Contexto (no exportar para evitar conflictos con HMR) */
const DatosAgenciaContext = createContext<DatosAgenciaContextType | null>(null);

/** Provider (sí, es un componente) */
export const DatosAgenciaProvider = ({ children }: { children: ReactNode }) => {
  const [datosAgencia, setDatosAgencia] = useState<DatosAgencia | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const datos = await fetchDatosAgencia();
        setDatosAgencia(datos);
      } catch (error) {
        console.error("Error al cargar datos de la agencia:", error);
        setDatosAgencia(null);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  return (
    <DatosAgenciaContext.Provider value={{ datosAgencia, cargando }}>
      {children}
    </DatosAgenciaContext.Provider>
  );
};

/** Hook general */
export const useDatosAgencia = () => {
  const contexto = useContext(DatosAgenciaContext);
  if (!contexto) {
    throw new Error("useDatosAgencia debe ser usado dentro de un DatosAgenciaProvider");
  }
  return contexto;
};

/** Hooks específicos */
export const useDatosGenerales = () => {
  const { datosAgencia } = useDatosAgencia();
  return datosAgencia
    ? {
        idAgencia: datosAgencia.idAgencia,
        nombreAgencia: datosAgencia.nombreAgencia,
        dominio: datosAgencia.dominio,
        url: datosAgencia.url,
        logoAgencia: datosAgencia.logoAgencia,
        tipografiaAgencia: datosAgencia.tipografiaAgencia,
        colorTipografiaAgencia: datosAgencia.colorTipografiaAgencia,
        color: datosAgencia.color,
        colorFondoApp: datosAgencia.colorFondoApp,
        terminosYCondiciones: datosAgencia.terminosYCondiciones,
      }
    : null;
};

export const useHeader = () => useDatosAgencia().datosAgencia?.header ?? null;
export const useBuscador = () => useDatosAgencia().datosAgencia?.buscador ?? null;
export const usePublicidadCliente = () => useDatosAgencia().datosAgencia?.publicidadCliente ?? null;
export const useTarjetas = () => useDatosAgencia().datosAgencia?.tarjetas ?? null;
export const useBannerRegistro = () => useDatosAgencia().datosAgencia?.bannerRegistro ?? null;
export const useFooter = () => useDatosAgencia().datosAgencia?.footer ?? null;
export const useQuienesSomos = () => useDatosAgencia().datosAgencia?.quienesSomos ?? null;

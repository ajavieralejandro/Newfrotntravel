import { useState, useEffect } from "react";
import { Grid, Box, CircularProgress, Button } from "@mui/material";
import TarjetaPaquete from "./TarjetaPaquete";
import MensajeSinPaquetes from "./MensajeSinPaquetes";
import { useTarjetas } from "../../contextos/agencia/DatosAgenciaContext";
import { useFiltrosYOrdenamiento } from "../../contextos/filtro/FiltrosYOrdenamientoContext";
import { filtrarPaquetes } from "../../contextos/filtro/filtrarPaquetes";
import { usePaquetesOrdenados } from "../../hooks/useOrdenarPaquetes";
import type { PaqueteData } from "../../interfaces/PaqueteData";

interface ListadoPaquetesProps {
  paquetes?: PaqueteData[];
}

function parsePaquetesFromLocalStorage(key = "resultadosBusqueda"): PaqueteData[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is PaqueteData =>
        typeof (p as PaqueteData)?.id === "number" && (p as PaqueteData).id !== -1
    );
  } catch {
    return [];
  }
}

const ListadoPaquetes: React.FC<ListadoPaquetesProps> = ({ paquetes: paquetesProp }) => {
  const [paquetes, setPaquetes] = useState<PaqueteData[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cantidadVisible, setCantidadVisible] = useState(10);

  const tarjeta = useTarjetas();
  const { filtros } = useFiltrosYOrdenamiento();

  const cargarPaquetes = () => {
    const paquetesParseados = parsePaquetesFromLocalStorage("resultadosBusqueda");
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("🔍 Paquetes cargados y listos:", paquetesParseados);
    }
    setPaquetes(paquetesParseados);
    setCargando(false);
  };

  useEffect(() => {
    if (!paquetesProp) {
      cargarPaquetes();
      const actualizarPaquetes = () => cargarPaquetes();
      window.addEventListener("actualizarPaquetes", actualizarPaquetes);
      return () => {
        window.removeEventListener("actualizarPaquetes", actualizarPaquetes);
      };
    } else {
      setPaquetes(paquetesProp ?? []);
      setCargando(false);
    }
  }, [paquetesProp]);

  const cargarMas = () => setCantidadVisible((prev) => prev + 10);

  const listaBase = paquetesProp ?? paquetes;
  const listaFiltrada = paquetesProp ? listaBase : filtrarPaquetes(listaBase, filtros);
  const listaFinal = usePaquetesOrdenados(listaFiltrada);

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "left" }}>
      {cargando ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress size={40} />
        </Box>
      ) : listaFinal.length === 0 ? (
        <MensajeSinPaquetes />
      ) : (
        <>
          <Grid container >
            {listaFinal.slice(0, cantidadVisible).map((paquete, index) => (
              <Grid
                item
                xs={11}
                sm={11}
                md={12}
                key={paquete.id}
                sx={{ display: "flex", justifyContent: "left", mb: index !== listaFinal.length - 1 ? { xs: 2, sm: 3, md: 3 } : 0 }}
              >
                <TarjetaPaquete paquete={paquete} cargando={false} />
              </Grid>
            ))}
          </Grid>

          {!paquetesProp && cantidadVisible < listaFinal.length && (
            <Button
              variant="contained"
              onClick={cargarMas}
              sx={{
                mt: 3,
                borderRadius: "25px",
                backgroundColor: tarjeta?.color.primario,
                color: tarjeta?.tipografiaColor,
                fontWeight: "bold",
              }}
            >
              Ver más
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default ListadoPaquetes;

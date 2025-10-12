import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import ModalOrdenamiento from "./ModalOrdenamiento";
import {
  useFiltrosYOrdenamiento,
  type Ordenamientos,
} from "../../contextos/filtro/FiltrosYOrdenamientoContext";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";

type Criterio = keyof Ordenamientos; // "precio" | "salida" | "nombre" | "duracion"
type Orden = "asc" | "desc";

const labels: Record<Criterio, string> = {
  precio: "Precio (doble, 1ª salida)",
  salida: "Fecha de salida",
  nombre: "Nombre",
  duracion: "Duración",
};

const OrdenarPaquetes = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    ordenamientos,
    prioridadOrdenamientos,
    setOrdenamientos,
    setPrioridadOrdenamientos,
  } = useFiltrosYOrdenamiento();

  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();

  const colorPrimario =
    tarjetas?.color?.primario || datosGenerales?.color?.primario || "#1976d2";
  const colorTexto =
    tarjetas?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#fff";
  const tipografia =
    tarjetas?.tipografia || datosGenerales?.tipografiaAgencia || "Verdana, sans-serif";

  // Activo = el último en prioridad
  const criterioActivo = prioridadOrdenamientos.at(-1) as Criterio | undefined;
  const ordenActivo = criterioActivo ? (ordenamientos[criterioActivo] as Orden | null) : null;

  const flecha = ordenActivo === "asc" ? "↑" : ordenActivo === "desc" ? "↓" : "";
  const labelCriterio = criterioActivo ? labels[criterioActivo] : null;

  const handleOrdenar = (criterio: Criterio, orden: Orden) => {
    // Definimos que el único criterio activo sea el elegido:
    // 1) prioridad sólo con ese criterio
    setPrioridadOrdenamientos([criterio]);
    // 2) setear su orden; NO tocamos el resto para no ensuciar prioridad con nulls
    setOrdenamientos(criterio, orden);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
      {isMobile ? (
        <Tooltip title={labelCriterio && ordenActivo ? `Orden: ${labelCriterio} (${flecha})` : "Ordenar"}>
          <IconButton
            aria-label="Abrir ordenamiento"
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: colorPrimario,
              color: colorTexto,
              "&:hover": {
                backgroundColor: `${colorPrimario}cc`,
              },
              borderRadius: "50%",
              p: { xs: 1, sm: 1.2 },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <SortIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          aria-label="Abrir ordenamiento"
          onClick={() => setOpen(true)}
          variant="contained"
          startIcon={<SortIcon />}
          sx={{
            backgroundColor: colorPrimario,
            color: colorTexto,
            fontWeight: "bold",
            fontFamily: tipografia,
            borderRadius: "50px",
            px: { xs: 2, sm: 3 },
            py: { xs: 0.8, sm: 1 },
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: `${colorPrimario}cc`,
              transform: "scale(1.02)",
            },
          }}
        >
          {labelCriterio && ordenActivo
            ? `Orden: ${labelCriterio} (${flecha})`
            : "Ordenar"}
        </Button>
      )}

      <ModalOrdenamiento
        open={open}
        onClose={() => setOpen(false)}
        onAplicar={(criterio, orden) => {
          handleOrdenar(criterio, orden);
          setOpen(false);
        }}
        colorPrimario={colorPrimario}
        tipografia={tipografia}
      />
    </Box>
  );
};

export default OrdenarPaquetes;

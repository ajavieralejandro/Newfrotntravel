import { useState, useMemo } from "react";
import {
  
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Badge,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ModalFiltros from "./ModalFiltros";
import {
  useFiltrosYOrdenamiento,
  
} from "../../contextos/filtro/FiltrosYOrdenamientoContext";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";

const BotonFiltros = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { filtros } = useFiltrosYOrdenamiento();

  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();

  const colorPrimario =
    tarjetas?.color?.primario || datosGenerales?.color?.primario || "#1976d2";
  const colorTexto =
    tarjetas?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#ffffff";
  const tipografia =
    tarjetas?.tipografia || datosGenerales?.tipografiaAgencia || "Verdana, sans-serif";

  // Contador de filtros activos (expeditivo): arrays/boolean/texto.
  // Nota: no contamos rangos porque sus límites son dinámicos por dataset.
  const filtrosActivos = useMemo(() => {
    let c = 0;
    if (filtros.busquedaNombre.trim()) c++;
    if (filtros.ventaOnline) c++;
    if (filtros.ciudades.length) c++;
    if (filtros.hoteles.length) c++;
    if (filtros.habitaciones.length) c++;
    if (filtros.aerolineas.length) c++;
    if (filtros.ciudadesOrigenVuelo.length) c++;
    if (filtros.ciudadesDestinoVuelo.length) c++;
    if (filtros.tipoMoneda.length) c++;
    // Si querés incluir rangos, comparar contra filtrosIniciales.* o pasar límites desde Modal.
    return c;
  }, [filtros]);

  return (
    <>
      {isMobile ? (
        <Tooltip title="Abrir filtros">
          <Badge color="error" badgeContent={filtrosActivos || null} overlap="circular">
            <IconButton
              aria-label="Abrir filtros"
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: colorPrimario,
                color: colorTexto,
                "&:hover": { backgroundColor: `${colorPrimario}cc` },
                borderRadius: "50%",
                p: { xs: 1.5, sm: 1.2 },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Badge>
        </Tooltip>
      ) : (
        <Badge color="error" badgeContent={filtrosActivos || null}>
          <Button
            aria-label="Abrir filtros"
            onClick={() => setOpen(true)}
            variant="contained"
            startIcon={<FilterListIcon />}
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
                transform: "scale(1.02)"
              },
            }}
          >
            {filtrosActivos > 0 ? `Filtros (${filtrosActivos})` : "Filtros"}
          </Button>
        </Badge>
      )}

      <ModalFiltros open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default BotonFiltros;

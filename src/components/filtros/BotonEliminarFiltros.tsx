
import {
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import { useFiltrosYOrdenamiento } from "../../contextos/filtro/FiltrosYOrdenamientoContext";

const BotonEliminarFiltros = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { resetFiltrosYOrdenamientos } = useFiltrosYOrdenamiento();

  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();

  const colorPrimario =
    tarjetas?.color?.primario || datosGenerales?.color?.primario || "#1976d2";
  const colorTexto =
    tarjetas?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#fff";
  const tipografia =
    tarjetas?.tipografia || datosGenerales?.tipografiaAgencia || "Verdana, sans-serif";

  const handleReset = () => {
    resetFiltrosYOrdenamientos();
  };

  return isMobile ? (
    <Tooltip title="Borrar filtros">
      <IconButton
        aria-label="Borrar filtros"
        onClick={handleReset}
        sx={{
          backgroundColor: colorPrimario,
          color: colorTexto,
          "&:hover": { backgroundColor: `${colorPrimario}cc` },
          borderRadius: "50%",
          p: { xs: 1, sm: 1.2 },
          transition: "all 0.2s ease-in-out",
        }}
      >
        <RestartAltIcon />
      </IconButton>
    </Tooltip>
  ) : (
    <Button
      aria-label="Borrar filtros"
      onClick={handleReset}
      variant="outlined"
      startIcon={<RestartAltIcon />}
      sx={{
        borderColor: colorTexto,
        color: colorTexto,
        fontWeight: "bold",
        fontFamily: tipografia,
        borderRadius: "50px",
        px: { xs: 2, sm: 3 },
        py: { xs: 0.8, sm: 1 },
        fontSize: { xs: "0.8rem", sm: "0.9rem" },
        "&:hover": {
          borderColor: `${colorTexto}cc`,
          backgroundColor: `${colorTexto}14`,
        },
      }}
    >
      Borrar filtros
    </Button>
  );
};

export default BotonEliminarFiltros;

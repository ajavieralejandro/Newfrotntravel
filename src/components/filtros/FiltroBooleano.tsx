import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useTarjetas } from "../../contextos/agencia/DatosAgenciaContext";
import { Filtros } from "../../contextos/filtro/FiltrosYOrdenamientoContext";

interface FiltroBooleanoProps {
  label: string;
  campo: "ventaOnline";
  filtros: Filtros;
  setFiltros: (f: Filtros) => void;
}

const FiltroBooleano = ({ label, campo, filtros, setFiltros }: FiltroBooleanoProps) => {
  const tarjetas = useTarjetas();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const valor = Boolean(filtros[campo]);
  const primary = tarjetas?.color?.primario || "#1976d2";

  const handleToggle = () => {
    setFiltros({ ...filtros, [campo]: !valor });
  };

  return (
    <Box sx={{ mb: isMobile ? 3 : 4 }}>
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          fontWeight: "bold",
          color: tarjetas?.tipografiaColorContenido || "#333",
          fontFamily: tarjetas?.tipografia || "Verdana, sans-serif",
        }}
      >
        {label}
      </Typography>

      <FormControlLabel
        aria-label={label}
        control={
          <Switch
            checked={valor}
            onChange={handleToggle}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: primary },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: primary,
              },
            }}
          />
        }
        label={valor ? "Sí" : "No"}
        sx={{
          fontFamily: tarjetas?.tipografia || "Verdana, sans-serif",
          color: tarjetas?.tipografiaColorContenido || "#333",
        }}
      />
    </Box>
  );
};

export default FiltroBooleano;

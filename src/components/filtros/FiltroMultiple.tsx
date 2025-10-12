import React from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useTarjetas } from "../../contextos/agencia/DatosAgenciaContext";
import PublicIcon from "@mui/icons-material/Public";
import HotelIcon from "@mui/icons-material/Hotel";
import KingBedIcon from "@mui/icons-material/KingBed";
import FlightIcon from "@mui/icons-material/Flight";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Filtros } from "../../contextos/filtro/FiltrosYOrdenamientoContext";

type CampoMultiple =
  | "ciudades"
  | "hoteles"
  | "habitaciones"
  | "aerolineas"
  | "ciudadesOrigenVuelo"
  | "ciudadesDestinoVuelo"
  | "tipoMoneda";

interface FiltroMultipleProps {
  label: string;
  campo: CampoMultiple;
  opciones: string[];
  filtros: Filtros;
  setFiltros: (f: Filtros) => void;
}

const iconos: Record<CampoMultiple, React.ReactNode> = {
  ciudades: <PublicIcon fontSize="small" />,
  hoteles: <HotelIcon fontSize="small" />,
  habitaciones: <KingBedIcon fontSize="small" />,
  aerolineas: <FlightIcon fontSize="small" />,
  ciudadesOrigenVuelo: <PublicIcon fontSize="small" />,
  ciudadesDestinoVuelo: <PublicIcon fontSize="small" />,
  tipoMoneda: <MonetizationOnIcon fontSize="small" />,
};

const FiltroMultiple = ({ label, campo, opciones, filtros, setFiltros }: FiltroMultipleProps) => {
  const tarjetas = useTarjetas();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const seleccionadas = (filtros[campo] as string[]) ?? [];

  const toggleOpcion = (opcion: string) => {
    const yaEsta = seleccionadas.includes(opcion);
    const nuevaLista = yaEsta
      ? seleccionadas.filter((item) => item !== opcion)
      : [...seleccionadas, opcion];

    setFiltros({ ...filtros, [campo]: nuevaLista } as Filtros);
  };

  return (
    <Box
      sx={{
        backgroundColor: `${tarjetas?.color?.primario || "#1976d2"}15`,
        border: `1px solid ${tarjetas?.color?.primario || "#1976d2"}33`,
        borderRadius: 3,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        p: isMobile ? 2 : 3,
        mb: isMobile ? 3 : 4,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mb: 2,
          fontWeight: "bold",
          color: tarjetas?.tipografiaColorContenido || "#333",
          fontFamily: tarjetas?.tipografia || "Verdana, sans-serif",
        }}
      >
        {iconos[campo]} {label}
      </Typography>

      <FormGroup>
        {opciones.map((opcion) => (
          <FormControlLabel
            key={opcion}
            control={
              <Checkbox
                checked={seleccionadas.includes(opcion)}
                onChange={() => toggleOpcion(opcion)}
                sx={{
                  color: tarjetas?.color?.primario,
                  "&.Mui-checked": {
                    color: tarjetas?.color?.primario,
                  },
                }}
              />
            }
            label={opcion}
            sx={{
              color: tarjetas?.tipografiaColorContenido || "#333",
              fontFamily: tarjetas?.tipografia || "Verdana, sans-serif",
              fontSize: "0.85rem",
              mb: 1,
            }}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default FiltroMultiple;

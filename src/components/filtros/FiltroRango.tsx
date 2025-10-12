import {
  Box,
  Typography,
  Slider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useTarjetas } from "../../contextos/agencia/DatosAgenciaContext";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarRateIcon from "@mui/icons-material/StarRate";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Filtros } from "../../contextos/filtro/FiltrosYOrdenamientoContext";
import { useMemo } from "react";

interface FiltroRangoProps {
  label: string;
  campo: "precio" | "duracion" | "estrellas";
  min: number;
  max: number;
  filtros: Filtros;
  setFiltros: (f: Filtros) => void;
}

const iconos = {
  precio: <MonetizationOnIcon fontSize="small" />,
  duracion: <AccessTimeIcon fontSize="small" />,
  estrellas: <StarRateIcon fontSize="small" />,
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const formatValor = (campo: FiltroRangoProps["campo"], v: number) => {
  if (campo === "precio") return new Intl.NumberFormat().format(v);
  if (campo === "duracion") return `${v}`;
  return `${v}`;
};

const FiltroRango = ({ label, campo, min, max, filtros, setFiltros }: FiltroRangoProps) => {
  const tarjetas = useTarjetas();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const valor = filtros[campo]; // tuple [min,max]

  // Aseguramos que el Slider siempre reciba un valor dentro de [min,max]
  const valorClampeado = useMemo<[number, number]>(() => {
    const [a, b] = Array.isArray(valor) ? valor : [min, max];
    return [clamp(a ?? min, min, max), clamp(b ?? max, min, max)];
  }, [valor, min, max]);

  const handleChange = (_: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) return;
    const [a, b] = newValue as [number, number];
    setFiltros({ ...filtros, [campo]: [a, b] } as Filtros);
  };

  const primary = tarjetas?.color?.primario || "#1976d2";

  return (
    <Box
      sx={{
        backgroundColor: `${primary}15`,
        border: `1px solid ${primary}55`,
        borderRadius: 3,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
        p: isMobile ? 2 : 3,
        mb: isMobile ? 3 : 4,
        textAlign: "center",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          fontFamily: tarjetas?.tipografia || "Verdana, sans-serif",
          fontWeight: "bold",
          color: tarjetas?.tipografiaColorContenido || "#333",
          mb: 2,
        }}
      >
        {iconos[campo]} {label}
      </Typography>

      <Slider
        value={valorClampeado}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={(v) => formatValor(campo, v)}
        valueLabelFormat={(v) => formatValor(campo, v)}
        min={min}
        max={max}
        step={campo === "estrellas" || campo === "duracion" ? 1 : undefined}
        sx={{
          color: primary,
          "& .MuiSlider-track": { border: "none" },
          "& .MuiSlider-thumb": {
            width: 20,
            height: 20,
            backgroundColor: "#fff",
            border: `2px solid ${primary}`,
            "&:hover": { boxShadow: `0 0 0 6px ${primary}33` },
          },
          "& .MuiSlider-rail": { opacity: 0.3, backgroundColor: "#999" },
        }}
      />
    </Box>
  );
};

export default FiltroRango;

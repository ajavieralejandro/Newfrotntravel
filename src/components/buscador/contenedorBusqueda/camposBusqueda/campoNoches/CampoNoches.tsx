import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import { useBuscador, useDatosGenerales } from "../../../../../contextos/agencia/DatosAgenciaContext";

const INPUT_HEIGHT = 36;

interface CampoNochesProps {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
  fuente?: string;
  colorTexto?: string;
  colorUnderline?: string;
  colorFocus?: string;
}

const CampoNoches: React.FC<CampoNochesProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  fuente = "Verdana, sans-serif",
  colorTexto = "#000",
  colorUnderline = "#a73439",
  colorFocus = "white",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (/^\d*$/.test(v)) {
      onChange(Number(v));
    }
  };
    const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const tipografia =
    buscador?.tipografia || datosGenerales?.tipografiaAgencia || "Verdana, sans-serif";
  const underline = buscador?.color?.primario || datosGenerales?.color?.primario || "#a73439";
  return (
    <Box display="flex" flexDirection="column" gap={0.75}>
      {/* Label con ícono */}
      <Box display="flex" alignItems="center" gap={0.75}>
        <HotelIcon sx={{ color: underline, fontSize: 20 }} />
        <Typography
          sx={{
            color: colorTexto,
            fontWeight: 500,
            fontFamily: tipografia,
            fontSize: "1rem",
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* Input con mismo estilo que Destino del hotel */}
      <TextField
        value={value ?? ""}
        onChange={handleChange}
        fullWidth
        variant="standard"
        size="small"
        InputProps={{
          readOnly: disabled,
          sx: {
            fontFamily: fuente,
            color: colorTexto,
            height: INPUT_HEIGHT,
            "&:before": { borderBottom: `2px solid ${underline}` },
            "&:after": { borderBottom: `2px solid ${colorFocus}` },
          },
        }}
        sx={{
          "& .MuiInputBase-input": {
            height: INPUT_HEIGHT,
            padding: 0,
            fontSize: "0.95rem",
            lineHeight: `${INPUT_HEIGHT}px`,
          },
        }}
      />
    </Box>
  );
};

export default CampoNoches;

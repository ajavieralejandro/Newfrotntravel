import React from "react";
import { Box, Typography } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import EventIcon from "@mui/icons-material/Event";
import { Dayjs } from "dayjs";
import { useBuscador, useDatosGenerales } from "../../../../../contextos/agencia/DatosAgenciaContext";

interface CampoFechaProps {
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  colorTexto?: string;
  colorUnderline?: string;
  colorFocus?: string;
  fuente?: string;
}

const INPUT_HEIGHT = 36;

const CampoFecha: React.FC<CampoFechaProps> = ({
  label,
  value,
  onChange,
  colorTexto = "#000",
  colorUnderline = "#a73439",
  colorFocus = "white",
  fuente = "Poppins, sans-serif",
}) => {

  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const tipografia =
      buscador?.tipografia || datosGenerales?.tipografiaAgencia || "Verdana, sans-serif";
  const underline = buscador?.color?.primario || datosGenerales?.color?.primario || "#a73439";

  return (
    <Box display="flex" flexDirection="column" gap={0.75} width="100%">
      <Box display="flex" alignItems="center" gap={0.75}>
        <EventIcon sx={{ color: underline, fontSize: 20 }} />
        <Typography
          sx={{
            color: colorTexto,
            fontWeight: 100,
            fontFamily: tipografia,
            fontSize: "1rem",
          }}
        >
          {label}
        </Typography>
      </Box>

      <DesktopDatePicker
        format="DD/MM/YYYY"
        value={value}
        onChange={(nv) => onChange(nv && nv.isValid() ? nv.startOf("day") : null)}
        slotProps={{
          textField: {
            fullWidth: true,
            variant: "standard",
            sx: {
              backgroundColor: "transparent",
              fontFamily: fuente,
              "& .MuiInputBase-root": {
                color: colorTexto,
                height: INPUT_HEIGHT,
                "&:before": { borderBottom: `2px solid ${underline}` },
                "&:hover:not(.Mui-disabled, .Mui-error):before": { borderBottom: `2px solid ${underline}` },
                "&:after": { borderBottom: `2px solid ${colorFocus}` },
              },
              "& .MuiInputBase-input": {
                height: INPUT_HEIGHT,
                padding: 0,
                fontSize: "0.95rem",
                lineHeight: `${INPUT_HEIGHT}px`,
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default CampoFecha;

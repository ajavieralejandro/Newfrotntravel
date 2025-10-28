import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";
import { useBuscador, useDatosGenerales } from "../../../../../contextos/agencia/DatosAgenciaContext";
import { useFormulario } from "../../../../../contextos/formulario/FormularioContext";

const INPUT_HEIGHT = 36;
const makeInputSx = (text: string, underline: string, focus: string, font: string) => ({
  backgroundColor: "transparent",
  borderRadius: 0,
  fontFamily: font,
  "& .MuiInputBase-root": {
    color: text,
    height: INPUT_HEIGHT,
    alignItems: "center",
    px: 0,
    "&:before": { borderBottom: `2px solid ${underline}` },
    "&:hover:not(.Mui-disabled, .Mui-error):before": { borderBottom: `2px solid ${underline}` },
    "&:after": { borderBottom: `2px solid ${focus}` },
  },
  "& .MuiInputBase-input": {
    height: INPUT_HEIGHT,
    lineHeight: `${INPUT_HEIGHT}px`,
    padding: 0,
    fontSize: "0.95rem",
  },
  "& .MuiFormHelperText-root": {
    minHeight: 18,
    fontSize: "0.72rem",
    marginLeft: 0,
    marginTop: 4,
  },
});

interface CampoFechaProps {
  label: "Fecha de Ida" | "Fecha de Vuelta";
}

const CampoFecha: React.FC<CampoFechaProps> = ({ label }) => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const {
    fechaSalida,
    setFechaSalida,
    fechaVuelta,
    setFechaVuelta,
    uiValues,
    setUIValues,
    errors,
  } = useFormulario();

  const text =
    buscador?.inputColor || buscador?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#000";
  const font = buscador?.tipografia || datosGenerales?.tipografiaAgencia || "Poppins, sans-serif";
  const underline = buscador?.color?.primario || datosGenerales?.color?.primario || "#a73439";
  const focus = buscador?.color?.terciario || datosGenerales?.color?.terciario || "#e52822";

  // 🟢 Restaurar fecha desde localStorage
  useEffect(() => {
    const valores = localStorage.getItem("valoresPrevios");
    if (valores) {
      const { fechaSalida: fSalida, fechaVuelta: fVuelta } = JSON.parse(valores);
      if (label === "Fecha de Ida" && fSalida && !fechaSalida) {
        const fecha = new Date(fSalida);
        setFechaSalida(fecha);
        setUIValues({ fechaSalidaDisplay: dayjs(fecha).format("DD/MM/YYYY") });
      } else if (label === "Fecha de Vuelta" && fVuelta && !fechaVuelta) {
        const fecha = new Date(fVuelta);
        setFechaVuelta(fecha);
        setUIValues({ fechaVueltaDisplay: dayjs(fecha).format("DD/MM/YYYY") });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🟢 Actualizar display cuando cambia la fecha
  useEffect(() => {
    if (label === "Fecha de Ida") {
      if (fechaSalida)
        setUIValues({ fechaSalidaDisplay: dayjs(fechaSalida).format("DD/MM/YYYY") });
      else setUIValues({ fechaSalidaDisplay: "" });
    } else {
      if (fechaVuelta)
        setUIValues({ fechaVueltaDisplay: dayjs(fechaVuelta).format("DD/MM/YYYY") });
      else setUIValues({ fechaVueltaDisplay: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaSalida, fechaVuelta]);

  if (!datosGenerales) return null;

  const fechaDayjs =
    label === "Fecha de Ida"
      ? fechaSalida
        ? dayjs(fechaSalida)
        : null
      : fechaVuelta
      ? dayjs(fechaVuelta)
      : null;

  const fieldError =
    label === "Fecha de Ida" ? errors.fechaSalida : errors.fechaVuelta;

  return (
    <Box display="flex" flexDirection="column" gap={0.75} alignItems="flex-start" width="100%">
      <Box display="flex" alignItems="center" gap={0.75}>
        <EventIcon sx={{ color: underline, fontSize: 20 }} />
        <Typography sx={{ color: "#000", fontWeight: 500, fontFamily: font, fontSize: "1rem" }}>
          {label}
        </Typography>
      </Box>

      <DesktopDatePicker
        format="DD/MM/YYYY"
        value={fechaDayjs}
        onChange={(nv) => {
          const fecha = nv ? nv.toDate() : null;
          if (label === "Fecha de Ida") {
            setFechaSalida(fecha);
            setUIValues({
              fechaSalidaDisplay: fecha ? dayjs(fecha).format("DD/MM/YYYY") : "",
            });
          } else {
            setFechaVuelta(fecha);
            setUIValues({
              fechaVueltaDisplay: fecha ? dayjs(fecha).format("DD/MM/YYYY") : "",
            });
          }
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            variant: "standard",
            size: "small",
            error: Boolean(fieldError),
            helperText: fieldError || " ",
            placeholder: "Seleccioná fecha",
            sx: makeInputSx(text, underline, focus, font),
          } as any,
        }}
      />
    </Box>
  );
};

export default CampoFecha;

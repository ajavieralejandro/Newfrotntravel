import React, { useEffect, useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { useBuscador, useDatosGenerales } from "../../../../../contextos/agencia/DatosAgenciaContext";
import { useFormulario } from "../../../../../contextos/formulario/FormularioContext";
import ModalViajeros from "./ModalViajeros";

const INPUT_HEIGHT = 36;
const makeInputSx = (text: string, underline: string, focus: string, font: string) => ({
  backgroundColor: "transparent",
  borderRadius: 0,
  fontFamily: font,
  cursor: "pointer",
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

interface CampoPasajerosProps { label: string; }

const CampoPasajeros: React.FC<CampoPasajerosProps> = ({ label }) => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const { viajeros, setViajeros, uiValues, setUIValues, errors } = useFormulario();
  const [modalAbierto, setModalAbierto] = useState(false);

  const text =
    buscador?.inputColor || buscador?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#000";
  const font = buscador?.tipografia || datosGenerales?.tipografiaAgencia || "Poppins, sans-serif";
  const underline = buscador?.color?.primario || datosGenerales?.color?.primario || "#a73439";
  const focus = buscador?.color?.terciario || datosGenerales?.color?.terciario || "#e52822";

  useEffect(() => {
    const valoresGuardados = localStorage.getItem("valoresPrevios");
    if (valoresGuardados && (!viajeros || (viajeros.adultos === 0 && viajeros.menores === 0))) {
      const { viajeros: vg } = JSON.parse(valoresGuardados);
      if (vg) {
        setViajeros(vg);
        const resumen = `${vg.adultos || 0} adulto${vg.adultos === 1 ? "" : "s"}${vg.menores ? ` y ${vg.menores} menor${vg.menores === 1 ? "" : "es"}` : ""}`;
        setUIValues({ viajerosDisplay: resumen });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const resumen = viajeros?.adultos || viajeros?.menores
      ? `${viajeros.adultos || 0} adulto${viajeros.adultos === 1 ? "" : "s"}${viajeros.menores ? ` y ${viajeros.menores} menor${viajeros.menores === 1 ? "" : "es"}` : ""}`
      : "";
    setUIValues({ viajerosDisplay: resumen });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viajeros]);

  if (!datosGenerales) return null;

  const resumen = uiValues.viajerosDisplay || "";
  const fieldError = errors.viajeros;

  return (
    <Box display="flex" flexDirection="column" gap={0.75}>
      <Box display="flex" alignItems="center" gap={0.75}>
        <PeopleIcon sx={{ color: underline, fontSize: 20 }} />
        <Typography sx={{ color: "#000", fontWeight: 500, fontFamily: font, fontSize: "1rem" }}>
          {label}
        </Typography>
      </Box>

      <TextField
        value={resumen}
        placeholder="Seleccionar"
        onClick={() => setModalAbierto(true)}
        fullWidth
        variant="standard"
        size="small"
        error={Boolean(fieldError)}
        helperText={fieldError || " "}
        InputProps={{ readOnly: true }}
        sx={makeInputSx(text, underline, focus, font)}
      />

      <ModalViajeros
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onAplicar={(adultos, menores) => { setViajeros({ adultos, menores }); setModalAbierto(false); }}
      />
    </Box>
  );
};

export default CampoPasajeros;

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

// ✅ AHORA EL TIPO ES CORRECTO
interface CampoPasajerosProps {
  label: string;
  value: { adultos: number; menores: number };
  onChange: (value: { adultos: number; menores: number }) => void;
}

const CampoPasajeros: React.FC<CampoPasajerosProps> = ({ label }) => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();

  // 🔥  Esto viene de tu formulario y SIEMPRE es {adultos, menores}
  const { pasajeros, setPasajeros, uiValues, setUIValues, errors } = useFormulario();

  const [modalAbierto, setModalAbierto] = useState(false);

  const text = buscador?.inputColor || buscador?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#000";
  const font = buscador?.tipografia || datosGenerales?.tipografiaAgencia || "Poppins, sans-serif";
  const underline = buscador?.color?.primario || datosGenerales?.color?.primario || "#a73439";
  const focus = buscador?.color?.terciario || datosGenerales?.color?.terciario || "#e52822";

  // Cargar valores guardados
  useEffect(() => {
    const valoresGuardados = localStorage.getItem("valoresPrevios");
    if (valoresGuardados && pasajeros.adultos === 0 && pasajeros.menores === 0) {
      const { pasajeros: saved } = JSON.parse(valoresGuardados);
      if (saved) {
        setPasajeros(saved);
        const resumen = `${saved.adultos} adulto${saved.adultos === 1 ? "" : "s"}${
          saved.menores ? ` y ${saved.menores} menor${saved.menores === 1 ? "" : "es"}` : ""
        }`;
        setUIValues({ pasajerosDisplay: resumen });
      }
    }
  }, []);

  // Actualizar display
  useEffect(() => {
    const resumen =
      pasajeros.adultos || pasajeros.menores
        ? `${pasajeros.adultos} adulto${pasajeros.adultos === 1 ? "" : "s"}${
            pasajeros.menores ? ` y ${pasajeros.menores} menor${pasajeros.menores === 1 ? "" : "es"}` : ""
          }`
        : "";

    setUIValues({ pasajerosDisplay: resumen });
  }, [pasajeros]);

  if (!datosGenerales) return null;

  const resumen = uiValues.pasajerosDisplay || "";
  const fieldError = errors.pasajeros;

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
        onAplicar={(adultos, menores) => {
          setPasajeros({ adultos, menores });
          setModalAbierto(false);
        }}
      />
    </Box>
  );
};

export default CampoPasajeros;

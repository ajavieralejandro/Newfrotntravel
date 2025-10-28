import React, { useEffect, useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
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

interface CampoNochesProps {
  label: string;
}

const CampoNoches: React.FC<CampoNochesProps> = ({ label }) => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const { noches, setNoches, uiValues, setUIValues, errors } = useFormulario();

  const [valorLocal, setValorLocal] = useState<string>("");

  // 🔹 Restaurar desde localStorage una sola vez
  useEffect(() => {
    if (!noches) {
      const valores = localStorage.getItem("valoresPrevios");
      if (valores) {
        const { noches: guardadas } = JSON.parse(valores);
        if (guardadas) {
          setNoches(guardadas);
          setValorLocal(guardadas);
          setUIValues({ nochesDisplay: guardadas });
        }
      }
    } else {
      setValorLocal(noches);
    }
  }, [noches, setNoches, setUIValues]);

  const text = buscador?.inputColor || buscador?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#000";
  const font = buscador?.tipografia || datosGenerales?.tipografiaAgencia || "Poppins, sans-serif";
  const underline = buscador?.color?.primario || datosGenerales?.color?.primario || "#a73439";
  const focus = buscador?.color?.terciario || datosGenerales?.color?.terciario || "#e52822";
  const fieldError = errors?.noches;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setValorLocal(value);
      setNoches(value);
      setUIValues({ nochesDisplay: value });
    }
  };

  if (!datosGenerales) return null;

  return (
    <Box display="flex" flexDirection="column" gap={0.75}>
      <Box display="flex" alignItems="center" gap={0.75}>
        <HotelIcon sx={{ color: underline, fontSize: 20 }} />
        <Typography sx={{ color: "#000", fontWeight: 500, fontFamily: font, fontSize: "1rem" }}>
          {label}
        </Typography>
      </Box>

      <TextField
        value={valorLocal}
        placeholder="Ej: 5"
        onChange={handleChange}
        fullWidth
        variant="standard"
        size="small"
        error={Boolean(fieldError)}
        helperText={fieldError || " "}
        sx={makeInputSx(text, underline, focus, font)}
      />
    </Box>
  );
};

export default CampoNoches;

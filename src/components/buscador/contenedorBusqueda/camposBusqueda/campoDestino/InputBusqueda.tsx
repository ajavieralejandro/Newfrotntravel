import React from "react";
import { TextField } from "@mui/material";
import { useDatosGenerales, useBuscador } from "../../../../../contextos/agencia/DatosAgenciaContext";

interface InputBusquedaProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
  setMostrarSugerencias: (value: boolean) => void;
}

const InputBusqueda: React.FC<InputBusquedaProps> = ({ busqueda, setBusqueda, setMostrarSugerencias }) => {
  const datosGenerales = useDatosGenerales();
  const buscador = useBuscador();

  // Fondo del input = secundario
  const fondoInput =
    buscador?.inputFondoColor ||
    buscador?.color?.secundario ||
    datosGenerales?.color?.secundario ||
    "#FFFFFF";

  // Color del texto/placeholder
  const colorTipografia =
    buscador?.inputColor ||
    buscador?.tipografiaColor ||
    datosGenerales?.colorTipografiaAgencia ||
    "#000000";

  // Tipografía
  const tipografia =
    buscador?.tipografia ||
    datosGenerales?.tipografiaAgencia ||
    "'Poppins', sans-serif";

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Escribe una ciudad o aeropuerto"
      value={busqueda}
      onChange={(e) => {
        setBusqueda(e.target.value);
        setMostrarSugerencias(true);
      }}
      sx={{
        mb: 2,
        bgcolor: fondoInput,
        borderRadius: "25px",
        fontFamily: tipografia,
        "& .MuiOutlinedInput-root": {
          color: colorTipografia,
          "& fieldset": { borderColor: "transparent" },        // ❌ sin color
          "&:hover fieldset": { borderColor: "transparent" },  // ❌ sin color
          "&.Mui-focused fieldset": { borderColor: "transparent" }, // ❌ sin color
        },
        "& .MuiInputBase-input::placeholder": {
          color: colorTipografia,
          opacity: 0.7,
        },
      }}
    />
  );
};

export default InputBusqueda;

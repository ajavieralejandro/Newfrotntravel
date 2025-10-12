import React, { useEffect, useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { useBuscador, useDatosGenerales } from "../../../../../contextos/agencia/DatosAgenciaContext";
import { useFormulario } from "../../../../../contextos/formulario/FormularioContext";
import ModalViajeros from "./ModalViajeros";

interface CampoPasajerosProps {
  label: string;
}

const CampoPasajeros: React.FC<CampoPasajerosProps> = ({ label }) => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const { viajeros, setViajeros, uiValues, setUIValues, errors } = useFormulario();
  const [modalAbierto, setModalAbierto] = useState(false);
  
  const fieldError = errors.viajeros;

  useEffect(() => {
    const valoresGuardados = localStorage.getItem("valoresPrevios");
    if (valoresGuardados && (!viajeros || (viajeros.adultos === 0 && viajeros.menores === 0))) {
      const { viajeros: viajerosGuardados } = JSON.parse(valoresGuardados);
      if (viajerosGuardados) {
        setViajeros(viajerosGuardados);
        // Actualizar display value
        const resumenGuardado = `${viajerosGuardados.adultos || 0} adulto${viajerosGuardados.adultos === 1 ? "" : "s"}${viajerosGuardados.menores ? ` y ${viajerosGuardados.menores} menor${viajerosGuardados.menores === 1 ? "" : "es"}` : ""}`;
        setUIValues({ viajerosDisplay: resumenGuardado });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Sincronizar display value cuando cambian los viajeros - solo si display está vacío
  useEffect(() => {
    const currentDisplay = uiValues.viajerosDisplay;
    const resumen = viajeros?.adultos || viajeros?.menores
      ? `${viajeros.adultos || 0} adulto${viajeros.adultos === 1 ? "" : "s"}${viajeros.menores ? ` y ${viajeros.menores} menor${viajeros.menores === 1 ? "" : "es"}` : ""}`
      : "";
    
    // Solo actualizar display si está vacío o si hay cambios reales en viajeros
    if (!currentDisplay || (viajeros?.adultos > 0 || viajeros?.menores > 0)) {
      setUIValues({ viajerosDisplay: resumen });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viajeros]);

  if (!datosGenerales) return null;

  // 🎯 Fallbacks coherentes con DatosAgencia
  const fondoInput =
    buscador?.inputFondoColor ||
    buscador?.color?.secundario ||
    datosGenerales?.color?.secundario ||
    "#F5F5F5";

  const colorTextoInput =
    buscador?.inputColor ||
    buscador?.tipografiaColor ||
    datosGenerales?.colorTipografiaAgencia ||
    "#000000";

  const labelColor =
    buscador?.tipografiaColorLabel ||
    buscador?.tipografiaColor ||
    datosGenerales?.colorTipografiaAgencia ||
    "#000000";

  const tipografia =
    buscador?.tipografia ||
    datosGenerales?.tipografiaAgencia ||
    "Poppins, sans-serif";

  const resumen = uiValues.viajerosDisplay || "";

  const handleAplicar = (adultos: number, menores: number) => {
    setViajeros({ adultos, menores });
    setModalAbierto(false);
  };

  return (
    <Box display="flex" flexDirection="column" gap={0} >
      <Box display="flex" alignItems="left" gap={4}>
        <PeopleIcon sx={{ color: "#a73439", fontSize: 24 }} />
        <Typography sx={{ color: "#000", fontWeight: 500, fontFamily: tipografia, fontSize: '1.2rem' }}>
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
  helperText={fieldError}
  InputProps={{ readOnly: true }}
  sx={{
    backgroundColor: fondoInput,
    borderRadius: "opx",
    fontFamily: tipografia,
    cursor: "pointer",
    "& .MuiInputBase-root": {
      //color: colorTextoInput,
      color: "#000",
                "&:before": {
                  borderBottom: "2px solid #a73439", // 🔴 línea roja base sepuede sacar de datos generales
                },
                "&:hover:not(.Mui-disabled, .Mui-error):before": {
                  borderBottom: "2px solid #a73439", // 🔴 línea roja al hover
                },
                "&:after": {
                  borderBottom: "2px solid #e52822", // 🔴 más intensa al foco
                },
    },
    "& input": {
                padding: "8px 10px 8px 14px",
              },
              "& .MuiInputAdornment-root": {
                marginLeft: "-50px",
                marginRight: "6px",
              },
               "& .MuiFormHelperText-root": {
                color: "#f44336",
                fontSize: "0.75rem",
                marginLeft: 1,
                marginTop: 0.5,
              },
              "& .MuiSvgIcon-root": {
                color: colorTextoInput,
                fontSize: "1.2rem",
              },
  }}
/>

      <ModalViajeros
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onAplicar={handleAplicar}
      />
    </Box>
  );
};

export default CampoPasajeros;

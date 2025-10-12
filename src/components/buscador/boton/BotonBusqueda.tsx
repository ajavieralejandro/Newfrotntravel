import React from "react";
import { Button, CircularProgress, ButtonProps } from "@mui/material";
import { motion } from "framer-motion";
import { useBusqueda } from "../../../hooks/useBusqueda";
import { useBuscador, useDatosGenerales, useTarjetas } from "../../../contextos/agencia/DatosAgenciaContext";
import { useFormulario } from "../../../contextos/formulario/FormularioContext";

interface BotonBusquedaProps extends ButtonProps {}

const BotonBusqueda: React.FC<BotonBusquedaProps> = (props) => {
  const { enviarFormulario, isValid, errors } = useFormulario();
  const { loading, handleClick } = useBusqueda();
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const tarjetas = useTarjetas();

  if (!datosGenerales) return null;

  const tipografia =
    buscador?.tipografia || datosGenerales?.tipografiaAgencia || "Poppins, sans-serif";

  const textoColor =
    tarjetas?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#FFFFFF";

  const colorPrimario =
    buscador?.color?.primario || datosGenerales?.color?.primario || "#007BFF";

  const handleBusqueda = () => {
    // Solo proceder si la validación es exitosa
    const isFormValid = enviarFormulario();
    if (isFormValid) {
      handleClick();
      // El reset se maneja en useBusqueda después del éxito
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Button
       {...props} // ✅ permite pasar sx, variant, etc. desde afuera
        variant="contained"
        onClick={handleBusqueda}
        sx={{
          borderRadius: "35px",
          padding: { xs: "14px 36px", md: "13px 46px" },
          fontSize: { xs: "12px", md: "15px" },
          fontWeight: 500,
          backgroundColor: (!isValid || loading) ? "#cccccc" : colorPrimario,
          color: (!isValid || loading) ? "#666666" : textoColor,
          fontFamily: tipografia,
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: (!isValid || loading) ? "#cccccc" : textoColor,
            color: (!isValid || loading) ? "#666666" : colorPrimario,
          },
          "&:disabled": {
            backgroundColor: "#cccccc",
            color: "#666666"
          },
          ...props // ✅ permite pasar sx, variant, etc. desde afuera
        }}
        disabled={loading || !isValid}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: textoColor }} />
        ) : (
          "Buscar"
        )}
      </Button>
    </motion.div>
  );
};

export default BotonBusqueda;

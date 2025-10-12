import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useBuscador, useDatosGenerales } from "../../../contextos/agencia/DatosAgenciaContext";

interface BotonSeleccionarProps {
  onClick: () => void;
  loading?: boolean;
  label?: string;
}

const BotonSeleccionar: React.FC<BotonSeleccionarProps> = ({
  onClick,
  loading = false,
  label = "Seleccionar",
}) => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();

  if (!datosGenerales) return null;

  const tipografia =
    buscador?.tipografia || datosGenerales?.tipografiaAgencia || "Poppins, sans-serif";

  const textoColor =
    buscador?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#FFFFFF";

  const colorPrimario =
    buscador?.color?.primario || datosGenerales?.color?.primario || "#007BFF";

  // 🔁 HOVER = TERCIARIO
  const colorHover =
    buscador?.color?.terciario || datosGenerales?.color?.terciario || colorPrimario;

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="contained"
        onClick={onClick}
        sx={{
          borderRadius: "35px",
          padding: { xs: "10px 28px", md: "12px 36px" },
          fontSize: { xs: "16px", md: "18px" },
          fontWeight: "bold",
          backgroundColor: colorPrimario,
          color: textoColor,
          fontFamily: tipografia,
          boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.25)",
          "&:hover": {
            backgroundColor: colorHover,
          },
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} sx={{ color: textoColor }} /> : label}
      </Button>
    </motion.div>
  );
};

export default BotonSeleccionar;

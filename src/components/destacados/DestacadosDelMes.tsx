import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

import ContenedorCartasMes from "../destacados/contenedorCartaMes/ContenedorCartasMes";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";

const DestacadosDelMes: React.FC = () => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();

  if (!datosGenerales) return null;

  const tituloTipografia =
    tarjetas?.tipografia || datosGenerales?.tipografiaAgencia || "Poppins, sans-serif";

  const tituloTipografiaColor =
    tarjetas?.tipografiaColorTitulo ||
    datosGenerales?.colorTipografiaAgencia ||
    "#000000";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Box
        component="section"
        role="region"
        aria-label="Paquetes destacados del mes"
        sx={{
          textAlign: "center",
          mt: 8,
          mb: 5,
          width: "100%",
          px: { xs: 0, sm: 0, md: 0 },
          maxWidth: { xs: "100%", sm: "95%", md: "95%", lg: "1400px", xl: "1600px" },
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              mb: 4,
              color: tituloTipografiaColor,
              fontFamily: tituloTipografia,
              textTransform: "uppercase",
              letterSpacing: "1px",
              position: "relative",
              display: "inline-block",
              fontSize: {
                xs: "1.8rem",
                sm: "2.2rem",
                md: "2rem",
                lg: "3rem",
              },
            }}
          >
            Destacados del Mes
            <motion.span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)",
                mixBlendMode: "overlay",
                pointerEvents: "none",
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          </Typography>
        </motion.div>

        <ContenedorCartasMes />
      </Box>
    </motion.div>
  );
};

export default DestacadosDelMes;

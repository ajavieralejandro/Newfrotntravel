import React from "react";
import { Box, Typography } from "@mui/material";
import { useBuscador, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import SelectorPestanas from "./contenedorBusqueda/pestanias/SelectorPestanas";
import SearchInputs from "./contenedorBusqueda/camposBusqueda/SearchFields";
import BotonBusqueda from "./boton/BotonBusqueda";

const ContenedorBusqueda: React.FC = () => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();

  if (!datosGenerales) {
    return <Typography sx={{ textAlign: "center", mt: 4 }}>Cargando datos de la agencia...</Typography>;
  }

    // 🎯 Fallbacks desde Buscador -> Generales
  const fontFamily = buscador?.tipografia || datosGenerales.tipografiaAgencia || "Arial, sans-serif";
  const textColor = buscador?.tipografiaColor || datosGenerales.colorTipografiaAgencia || "#000";
    // Fondo del contenedor = inputFondoColor ≡ Secundario
  const fondoColor =
    buscador?.color?.secundario ||
    datosGenerales.color?.secundario ||
    "#FFFFFF";

  return (
    <Box
      sx={{
        position: "relative",
        width: "95%",               // 🔹 Más ancho
        maxWidth: "1250px",         // 🔹 Más largo
        backgroundColor: "#4FB0B8",
        color: textColor,
        fontFamily,
        borderRadius: "6px",
        boxShadow: "0px 3px 10px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: { xs: 2, sm: 3 },
        px: { xs: 3, sm: 5, md: 8 }, // 🔹 Más espacio lateral
        pb: { xs: 5, sm: 6 },
        margin: "0 auto",
        transition: "all 0.3s ease",
      }}
    >
      {/* Selector de pestañas */}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 3 }}>
        <SelectorPestanas />
      </Box>

      {/* Campos de búsqueda */}
      <Box sx={{ width: "100%" }}>
        <SearchInputs />
      </Box>

      {/* Botón de búsqueda */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translate(-50%, 50%)",
          zIndex: 5,
        }}
      >
        <BotonBusqueda />
      </Box>
    </Box>
  );
};

export default ContenedorBusqueda;

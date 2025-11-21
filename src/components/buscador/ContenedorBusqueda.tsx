import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useBuscador, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import SelectorPestanas from "./contenedorBusqueda/pestanias/SelectorPestanas";
import SearchInputs from "./contenedorBusqueda/camposBusqueda/SearchFields";
import BotonBusqueda from "./boton/BotonBusqueda";

const ContenedorBusqueda: React.FC = () => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const [pestanaActiva, setPestanaActiva] = useState(
    localStorage.getItem("pestanaActiva") || "paquetes"
  );


  if (!datosGenerales) {
    return <Typography sx={{ textAlign: "center", mt: 4 }}>Cargando datos de la agencia...</Typography>;
  }

  const fontFamily = buscador?.tipografia || datosGenerales.tipografiaAgencia || "Arial, sans-serif";
  const textColor = buscador?.tipografiaColor || datosGenerales.colorTipografiaAgencia || "#000";

  return (
    <Box
      sx={{
        position: "relative",
        width: "95%",
        maxWidth: "1250px",
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
        px: { xs: 3, sm: 5, md: 8 },
        pb: { xs: 5, sm: 6 },
        margin: "0 auto",
      }}
    >
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 3 }}>
        <SelectorPestanas onPestanaChange={setPestanaActiva} />
      </Box>

      <Box sx={{ width: "100%" }}>
        <SearchInputs pestanaActiva={pestanaActiva} />
      </Box>

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

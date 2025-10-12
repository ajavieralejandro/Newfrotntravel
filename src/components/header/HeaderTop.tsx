import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import ContenedorBusqueda from "../buscador/ContenedorBusqueda";

const TopHeader = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const contenedorHeight = 100;

  const calcularAltoHeader = () => {
    const w = window.innerWidth;
    if (w < 600) return window.innerHeight * 1.0;
    if (w < 900) return window.innerHeight * 0.75;
    return window.innerHeight * 0.65;
  };

  const calcularEspaciado = () => {
    const w = window.innerWidth;
    if (w < 600) return 80; // Fijo en mobile
    // Desktop: dinámico con topes mucho más reducidos
    const base = headerHeight + contenedorHeight / 2;
    return Math.min(Math.max(base, 120), 200); // Entre 120px y 200px
  };

  useEffect(() => {
    const update = () => setHeaderHeight(calcularAltoHeader());
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1100,
        }}
      >
        <Header />
      </Box>

      {/* Contenedor de búsqueda superpuesto */}
      <Box
        sx={{
          position: "absolute",
          top: `calc(${headerHeight}px - ${contenedorHeight / 2}px - 120px)`,
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "96%", sm: "94%", md: "95%" },
          maxWidth: "1200px",
          height: `${contenedorHeight + 20}px`,
          zIndex: 1101,
          backgroundColor: "transparent",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ContenedorBusqueda />
      </Box>

      {/* Espaciador para evitar solapamiento */}
      <Box sx={{ height: `${calcularEspaciado() - 180}px` }} />
    </Box>
  );
};

export default TopHeader;

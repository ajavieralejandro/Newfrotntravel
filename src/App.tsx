import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Box, CircularProgress, GlobalStyles } from "@mui/material";
import { useDatosAgencia, useDatosGenerales } from "./contextos/agencia/DatosAgenciaContext";
import AppRoutes from "./routers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FaviconSetter from "./components/FaviconSetter";
import ScrollToTop from "./components/ScrollToTop"; // 🆕 import

const App: React.FC = () => {
  const { cargando } = useDatosAgencia();
  const datosGenerales = useDatosGenerales();

  if (cargando) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress size={80} thickness={5} />
      </Box>
    );
  }

  if (!datosGenerales) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        No se pudieron cargar los datos de la agencia.
      </Box>
    );
  }

  const fondoColor = datosGenerales.colorFondoApp || "#F5F5F5";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <FaviconSetter />
        <ScrollToTop /> {/* 🆕 Scroll automático al cambiar ruta */}
        <GlobalStyles
          styles={{
            "html, body, #root": {
              margin: 0,
              padding: 0,
              width: "100%",
              minHeight: "100vh",
              overflowX: "hidden",
            },
          }}
        />
        <Box
          sx={{
            backgroundColor: fondoColor,
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "flex-start",
            boxSizing: "border-box",
          }}
        >
          <AppRoutes />
        </Box>
      </Router>
    </LocalizationProvider>
  );
};

export default App;

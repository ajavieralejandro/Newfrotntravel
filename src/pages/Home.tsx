import React from "react";
import { Box } from "@mui/material";

// ✅ Correcciones de rutas basadas en tu estructura real
import Footer from "../components/footer/Footer";
import PublicidadCliente from "../components/publicidad/PublicidadCliente";
import DestacadosDelMes from "../components/destacados/DestacadosDelMes";
import BannerRegistro from "../components/banner/BannerRegistro";
import ZocaloPoweredBy from "../components/footer/ZocaloPoweredBy";
import TopHeader from "../components/header/HeaderTop";
import Divisor from "../components/header/Divisor";
import SeccionQuienesSomos from "../components/quienSomos/SeccionQuienesSomos";
import CarruselAcompanantes from "../components/auspiciantes/CarruselAcompanantes";
const Home: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <TopHeader />
      
      <Box sx={{ height: { xs: "80vh", md: "55vh" } }} />
      <Divisor/>

      
      {/* Componentes comentados temporalmente */}
       <PublicidadCliente /> 
      <DestacadosDelMes /> 
      <SeccionQuienesSomos/>

      <CarruselAcompanantes/> 
       <BannerRegistro /> 

      
      <Footer /> {/* ✅ Faltaba Footer, lo agregué aquí */}
      <ZocaloPoweredBy />
      
    </Box>
  );
};

export default Home;

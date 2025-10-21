import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Fab,
  Zoom,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import Footer from "../components/footer/Footer";
import ListadoPaquetes from "../components/paquetes/ListadoPaquetes";
import PanelFiltros from "../components/filtros/PanelFiltros";
import BannerRegistro from "../components/banner/BannerRegistro";
import ZocaloPoweredBy from "../components/footer/ZocaloPoweredBy";
import HeaderTop from "../components/header/HeaderTop";
import Divisor from "../components/header/Divisor";

import { useBuscador } from "../contextos/agencia/DatosAgenciaContext";
import { useBusquedaPorCarta } from "../hooks/useBusquedaPorCarta";

const PaquetesBusqueda = () => {
  const [mostrarBotonArriba, setMostrarBotonArriba] = useState(false);
  const buscador = useBuscador();
  const navigate = useNavigate();

  const { id } = useParams();
  const {
    buscarPorId,
    paqueteActivo,
    loading,
    errorBusqueda,
    limpiarPaqueteActivo,
    limpiarErrorBusqueda,
  } = useBusquedaPorCarta();

  useEffect(() => {
    const handleScroll = () => {
      setMostrarBotonArriba(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (id) {
      buscarPorId(Number(id));
      window.scrollTo(0, 0);
    } else {
      limpiarPaqueteActivo();
      limpiarErrorBusqueda();
    }
  }, [id]);

  // 🔄 Muestra spinner mientras carga el paquete por ID
  if (id && loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  // ❌ Muestra mensaje si hubo error al buscar por ID
  if (id && errorBusqueda) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h5" color="error" fontWeight="bold">
          {errorBusqueda}
        </Typography>
        <Typography variant="body1" mt={2}>
          Verificá el ID o volvé al listado de paquetes.
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3, borderRadius: "180px" }}
          onClick={() => navigate("/paquetes-busqueda")}
        >
          Volver al listado
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <HeaderTop />
      <Divisor />
      <Box sx={{ height: { xs: "100vh", md: "65vh" } }} />

      <Container maxWidth="xl" sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={4} lg={2.3}>
            <Box sx={{ 
              paddingRight: { md: 3, lg: 4 }, 
              height: "100%",
              px: { xs: 0, sm: 1, md: 0 }
            }}>
              <PanelFiltros />
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={8} lg={9}>
            <Box
              sx={{
                width: "100%",
                minHeight: "calc(100vh - 150px)",
                display: "flex",
                flexDirection: "column",
                paddingLeft: { md: 3, lg: 4 },
              }}
            >
              <ListadoPaquetes
                paquetes={id && paqueteActivo ? [paqueteActivo] : undefined}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ height: "80px" }} />
      <BannerRegistro />

      <Zoom in={mostrarBotonArriba}>
        <Fab
          size="small"
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            backgroundColor: buscador?.color.primario || "primary.main",
            color: "#fff",
            "&:hover": {
              backgroundColor: buscador?.color.primario
                ? `${buscador.color.primario}CC`
                : "primary.dark",
            },
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>

      <Footer />
      <ZocaloPoweredBy />
    </Box>
  );
};

export default PaquetesBusqueda;

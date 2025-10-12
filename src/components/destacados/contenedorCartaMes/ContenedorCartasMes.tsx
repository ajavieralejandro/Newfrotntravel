import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CartaMes from "../contenedorCartaMes/CartaMes";
import { useDatosGenerales, useTarjetas } from "../../../contextos/agencia/DatosAgenciaContext";
import { obtenerPaquetesDestacadosPaginados } from "../../../services/destacados/servicioCartasDestacadoMes";
import { PaqueteData } from "../../../interfaces/PaqueteData";

const ContenedorCartasMes: React.FC = () => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();
  const [paquetes, setPaquetes] = useState<PaqueteData[]>([]);
  const [pagina, setPagina] = useState(1);
  const [ultimaPagina, setUltimaPagina] = useState(1);
  const [cargando, setCargando] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const perPage = isMobile ? 4 : 8;

  const idAgencia = datosGenerales?.idAgencia;

  useEffect(() => {
    if (idAgencia) {
      cargarPagina(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, idAgencia]);

  const cargarPagina = async (paginaAObtener: number) => {
    if (!idAgencia) return;

    setCargando(true);
    try {
      const respuesta = await obtenerPaquetesDestacadosPaginados(
        paginaAObtener,
        perPage,
        idAgencia
      );

      console.log("📦 Datos crudos recibidos del backend:", respuesta.paquetes);

      setPaquetes((prev) =>
        paginaAObtener === 1 ? respuesta.paquetes : [...prev, ...respuesta.paquetes]
      );

      setPagina(respuesta.paginaActual);
      setUltimaPagina(respuesta.ultimaPagina);
    } catch (error) {
      console.error("❌ Error cargando paquetes destacados:", error);
    } finally {
      setCargando(false);
    }
  };

  if (!datosGenerales) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Cargando estilos...
      </Typography>
    );
  }

  const tarjetaTipografia =
    tarjetas?.tipografia || datosGenerales.tipografiaAgencia || "'Poppins', sans-serif";

  const tarjetaTipografiaColor =
    tarjetas?.tipografiaColor || datosGenerales.colorTipografiaAgencia || "#FFFFFF";

  const tarjetaColorPrimario =
    tarjetas?.color?.primario || datosGenerales.color?.primario || "#CCCCCC";



  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 2, sm: 3, md: 4 },
        width: "100%",
        maxWidth: { xs: "100%", sm: "95%", md: "95%", lg: "1400px", xl: "1600px" },
        margin: "0 auto",
        overflow: "hidden",
        backgroundColor: "transparent",
        px: { xs: 0, sm: 0, md: 0 },
      }}
    >
      {paquetes.length > 0 ? (
        <>
          <Grid
            container
            spacing={{ xs: 1.5, sm: 3, md: 3 }}
            justifyContent="center"
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "95%", md: "70%", lg: "1200px", xl: "1450px" },
              alignItems: "stretch",
              margin: "0 auto",
              px: { xs: 0, sm: 0, md: 0 },
              mx: 0,
            }}
          >
            {paquetes.map((paquete, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={paquete.id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "stretch",
                  opacity: 0,
                  transform: "translateY(20px)",
                  animation: "fadeInUp 0.5s ease-out forwards",
                  animationDelay: `${index * 100}ms`,
                  "@keyframes fadeInUp": {
                    "0%": { opacity: 0, transform: "translateY(20px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                  px: { xs: 0, sm: 0 },
                }}
              >
                <CartaMes paquete={paquete} />
              </Grid>
            ))}
          </Grid>

          {pagina < ultimaPagina && (
            <Button
              variant="contained"
              onClick={() => cargarPagina(pagina + 1)}
              sx={{
                mt: 2,
                borderRadius: "6px",
                backgroundColor: tarjetaColorPrimario,
                color: tarjetaTipografiaColor,              // 👈 color base
                // Asegura que texto e ícono hereden el color
                "& .MuiTypography-root, & svg": { color: "inherit" },
                // 👇 Invertimos colores en hover
                "&:hover": {
                  backgroundColor: tarjetaTipografiaColor,
                  color: tarjetaColorPrimario,
                },
                // Opcional: feedback al presionar / accesibilidad
                "&:active": { filter: "brightness(0.95)" },
                "&:focus-visible": {
                  outline: `2px solid ${tarjetaTipografiaColor}`,
                  outlineOffset: 2,
                },
                display: "flex",
                alignItems: "center",
                gap: 1,
                transition: "all 0.3s ease",
                "&:disabled": {
                  opacity: 0.5,
                  cursor: "not-allowed",
                  boxShadow: "none",
                },
              }}
              disabled={cargando}
            >
              <Typography
                variant="button"
                sx={{ fontFamily: tarjetaTipografia, color: "inherit" }}
              >
                Ver más
              </Typography>
              <ExpandMoreIcon sx={{ color: "inherit" }} />
            </Button>
          )}

          {cargando && (
            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 80,
              }}
            >
              <CircularProgress sx={{ color: tarjetaColorPrimario }} />
            </Box>
          )}
        </>
      ) : (
        <Typography sx={{ textAlign: "center", mt: 4 }}>
          {cargando ? "Cargando paquetes..." : "No hay paquetes disponibles."}
        </Typography>
      )}
    </Box>
  );
};

export default ContenedorCartasMes;

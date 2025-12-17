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

// VERIFICA QUE ESTAS IMPORTACIONES EXISTAN EN TU PROYECTO
import { 
  useDatosGenerales, 
  useTarjetas 
} from "../../../contextos/agencia/DatosAgenciaContext";

import { obtenerPaquetesDestacadosPaginados } from "../../../services/destacados/servicioCartasDestacadoMes";
import { PaqueteData } from "../../../interfaces/PaqueteData";

const ContenedorCartasMes: React.FC = () => {
  // Agrega logs para debug
  console.log("[DEBUG] Intentando cargar contexto...");
  
  let tarjetas, datosGenerales;
  
  try {
    tarjetas = useTarjetas();
    datosGenerales = useDatosGenerales();
    console.log("[DEBUG] Contexto cargado exitosamente:", { 
      tieneDatosGenerales: !!datosGenerales,
      tieneTarjetas: !!tarjetas,
      datosGeneralesKeys: datosGenerales ? Object.keys(datosGenerales) : [],
      tarjetasKeys: tarjetas ? Object.keys(tarjetas) : []
    });
  } catch (error) {
    console.error("[DEBUG] Error crítico cargando contexto:", error);
    console.error("[DEBUG] Stack trace:", error.stack);
    // Valores por defecto si el contexto falla
    tarjetas = null;
    datosGenerales = null;
  }

  const [paquetes, setPaquetes] = useState<PaqueteData[]>([]);
  const [pagina, setPagina] = useState(1);
  const [ultimaPagina, setUltimaPagina] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [errorContexto, setErrorContexto] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const perPage = isMobile ? 4 : 8;

  // Verifica que los datos del contexto estén disponibles
  const idAgencia = datosGenerales?.idAgencia;

  useEffect(() => {
    console.log("[DEBUG] useEffect ejecutándose, idAgencia:", idAgencia);
    
    // Si no hay contexto, mostrar error
    if (!datosGenerales) {
      setErrorContexto("Contexto de agencia no disponible. Verifica que DatosAgenciaProvider esté configurado correctamente.");
      console.error("[DEBUG] datosGenerales es:", datosGenerales);
      return;
    }

    if (idAgencia) {
      console.log("[DEBUG] Cargando página 1 con idAgencia:", idAgencia);
      cargarPagina(1);
    } else {
      console.warn("[DEBUG] idAgencia no disponible:", idAgencia);
    }
  }, [perPage, idAgencia, datosGenerales, tarjetas]);

  const cargarPagina = async (paginaAObtener: number) => {
    if (!idAgencia) {
      console.warn("No hay idAgencia para cargar paquetes");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await obtenerPaquetesDestacadosPaginados(
        paginaAObtener,
        perPage,
        idAgencia
      );

      // Soporta Axios (respuesta.data) o JSON directo (respuesta)
      const payload: any = (respuesta as any)?.data ?? respuesta;

      // Soporta payload.paquetes o payload.data
      const nuevos: PaqueteData[] = (payload?.paquetes ??
        payload?.data ??
        []) as PaqueteData[];

      // Soporta payload.paginaActual/ultimaPagina o payload.pagination.*
      const pagActual = Number(
        payload?.paginaActual ?? payload?.pagination?.current_page ?? 1
      );
      const ultPag = Number(
        payload?.ultimaPagina ?? payload?.pagination?.last_page ?? 1
      );

      setPaquetes((prev) =>
        paginaAObtener === 1 ? nuevos : [...prev, ...nuevos]
      );

      setPagina(Number.isFinite(pagActual) && pagActual > 0 ? pagActual : 1);
      setUltimaPagina(Number.isFinite(ultPag) && ultPag > 0 ? ultPag : 1);
      
      console.log(`[DEBUG] Página ${paginaAObtener} cargada:`, nuevos.length, "paquetes");
    } catch (error) {
      console.error("❌ Error cargando paquetes destacados:", error);
    } finally {
      setCargando(false);
    }
  };

  // Muestra error si hay problema con el contexto
  if (errorContexto) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: "center",
        border: "2px solid #ff6b6b",
        borderRadius: 1,
        bgcolor: "#fff5f5",
        maxWidth: 600,
        mx: "auto",
        mt: 4 
      }}>
        <Typography variant="h6" color="error" gutterBottom>
          ⚠️ Error de Contexto
        </Typography>
        <Typography variant="body1" paragraph>
          {errorContexto}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Verifica que:
        </Typography>
        <ul style={{ textAlign: "left", color: "text.secondary", fontSize: "0.875rem" }}>
          <li>El componente esté dentro de {"<DatosAgenciaProvider>"}</li>
          <li>Los hooks useDatosGenerales y useTarjetas estén correctamente exportados</li>
          <li>El archivo DatosAgenciaContext.ts exista en la ruta especificada</li>
        </ul>
      </Box>
    );
  }

  if (!datosGenerales) {
    return (
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: 300 
      }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando configuración de agencia...</Typography>
      </Box>
    );
  }

  // Valores por defecto robustos - CORREGIDO (sin .tipografia que no existe)
  const tarjetaTipografia = 
    tarjetas?.tipografia ||
    datosGenerales.tipografiaAgencia ||  // Solo esta propiedad, no .tipografia
    "'Poppins', sans-serif";

  const tarjetaTipografiaColor = 
    tarjetas?.tipografiaColor ||
    datosGenerales.colorTipografiaAgencia ||  // Solo esta propiedad
    "#FFFFFF";

  const tarjetaColorPrimario = 
    tarjetas?.color?.primario || 
    datosGenerales.color?.primario || 
    "#CCCCCC";

  console.log("[DEBUG] Valores finales:", {
    tarjetaTipografia,
    tarjetaTipografiaColor,
    tarjetaColorPrimario,
    idAgencia,
    totalPaquetes: paquetes.length
  });

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
            alignItems="stretch"
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "95%", md: "95%", lg: "1200px", xl: "1450px" },
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
                key={paquete.id || `paquete-${index}`}
                sx={{
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "center",
                  "& > *": {
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  },
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
                color: tarjetaTipografiaColor,
                "& .MuiTypography-root, & svg": { color: "inherit" },
                "&:hover": {
                  backgroundColor: tarjetaTipografiaColor,
                  color: tarjetaColorPrimario,
                },
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
                sx={{ 
                  fontFamily: tarjetaTipografia, 
                  color: "inherit",
                  fontWeight: 600 
                }}
              >
                {cargando ? "Cargando..." : "Ver más"}
              </Typography>
              {!cargando && <ExpandMoreIcon sx={{ color: "inherit" }} />}
            </Button>
          )}

          {cargando && pagina === 1 && (
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
      ) : !cargando ? (
        <Box sx={{ 
          textAlign: "center", 
          mt: 4,
          p: 3,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          maxWidth: 500
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay paquetes destacados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No se encontraron paquetes destacados para mostrar.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: 300 
        }}>
          <CircularProgress sx={{ color: tarjetaColorPrimario }} />
          <Typography sx={{ mt: 2 }}>Cargando paquetes destacados...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ContenedorCartasMes;
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

import {
  useDatosGenerales,
  useTarjetas,
} from "../../../contextos/agencia/DatosAgenciaContext";

import { obtenerPaquetesDestacadosPaginados } from "../../../services/destacados/servicioCartasDestacadoMes";
import { PaqueteData } from "../../../interfaces/PaqueteData";

const ContenedorCartasMes: React.FC = () => {
  const datosGenerales = useDatosGenerales();
  const tarjetas = useTarjetas();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const perPage = isMobile ? 4 : 8;

  const idAgencia = datosGenerales?.idAgencia ?? null;

  const [paquetes, setPaquetes] = useState<PaqueteData[]>([]);
  const [pagina, setPagina] = useState<number>(1);
  const [ultimaPagina, setUltimaPagina] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const tarjetaTipografia = useMemo(
    () =>
      tarjetas?.tipografia ||
      datosGenerales?.tipografiaAgencia ||
      "'Poppins', sans-serif",
    [tarjetas?.tipografia, datosGenerales?.tipografiaAgencia]
  );

  const tarjetaTipografiaColor = useMemo(
    () =>
      tarjetas?.tipografiaColor ||
      datosGenerales?.colorTipografiaAgencia ||
      "#FFFFFF",
    [tarjetas?.tipografiaColor, datosGenerales?.colorTipografiaAgencia]
  );

  const tarjetaColorPrimario = useMemo(
    () =>
      tarjetas?.color?.primario || datosGenerales?.color?.primario || "#CCCCCC",
    [tarjetas?.color?.primario, datosGenerales?.color?.primario]
  );

  const cargarPagina = useCallback(
    async (paginaAObtener: number) => {
      if (!idAgencia) {
        setCargando(false);
        return;
      }

      setCargando(true);
      setError(null);

      try {
        const respuesta = await obtenerPaquetesDestacadosPaginados(
          paginaAObtener,
          perPage,
          idAgencia
        );

        const payload: any = (respuesta as any)?.data ?? respuesta;

        // Tu API trae data (y también paquetes). Elegimos el que exista.
        const nuevos: PaqueteData[] = (payload?.data ??
          payload?.paquetes ??
          []) as PaqueteData[];

        // ✅ Los campos que TU payload garantiza
        const pagActual = Number(payload?.paginaActual ?? payload?.pagination?.current_page ?? paginaAObtener);
        const ultPag = Number(payload?.ultimaPagina ?? payload?.pagination?.last_page ?? 1);
        const tot = Number(payload?.total ?? payload?.pagination?.total ?? 0);

        setPaquetes((prev) => (paginaAObtener === 1 ? nuevos : [...prev, ...nuevos]));
        setPagina(Number.isFinite(pagActual) && pagActual > 0 ? pagActual : paginaAObtener);
        setUltimaPagina(Number.isFinite(ultPag) && ultPag > 0 ? ultPag : 1);
        setTotal(Number.isFinite(tot) && tot >= 0 ? tot : 0);
      } catch (e: any) {
        console.error("❌ Error cargando paquetes destacados:", e);
        setError(e?.message ?? "Error cargando paquetes destacados");
      } finally {
        setCargando(false);
      }
    },
    [idAgencia, perPage]
  );

  useEffect(() => {
    setPaquetes([]);
    setPagina(1);
    setUltimaPagina(1);
    setTotal(0);

    cargarPagina(1);
  }, [cargarPagina]);

  if (!datosGenerales) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando configuración de agencia...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center", maxWidth: 600, mx: "auto", mt: 4, border: "1px solid #f0c", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>⚠️ Error</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>{error}</Typography>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => cargarPagina(1)}>
          Reintentar
        </Button>
      </Box>
    );
  }

  // ✅ FIX: Ver más depende de TOTAL (no de ultimaPagina)
  const mostrarVerMas = total > 0 ? paquetes.length < total : pagina < ultimaPagina;

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
        overflow: "visible", // 👈 importante por si algún padre te lo estaba “cortando”
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
              px: 0,
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
                }}
              >
                <CartaMes paquete={paquete} />
              </Grid>
            ))}
          </Grid>

          {mostrarVerMas && (
            <Button
              variant="contained"
              onClick={() => cargarPagina(pagina + 1)}
              disabled={cargando}
              sx={{
                mt: 2,
                borderRadius: "6px",
                backgroundColor: tarjetaColorPrimario,
                color: tarjetaTipografiaColor,
                "& .MuiTypography-root, & svg": { color: "inherit" },
                "&:hover": { backgroundColor: tarjetaTipografiaColor, color: tarjetaColorPrimario },
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="button" sx={{ fontFamily: tarjetaTipografia, color: "inherit", fontWeight: 600 }}>
                {cargando ? "Cargando..." : "Ver más"}
              </Typography>
              {!cargando && <ExpandMoreIcon sx={{ color: "inherit" }} />}
            </Button>
          )}

          {cargando && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 60 }}>
              <CircularProgress sx={{ color: tarjetaColorPrimario }} />
            </Box>
          )}
        </>
      ) : cargando ? (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
          <CircularProgress sx={{ color: tarjetaColorPrimario }} />
          <Typography sx={{ mt: 2 }}>Cargando paquetes destacados...</Typography>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", mt: 4, p: 3, border: "1px solid #e0e0e0", borderRadius: 2, maxWidth: 500 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay paquetes destacados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No se encontraron paquetes destacados para mostrar.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ContenedorCartasMes;

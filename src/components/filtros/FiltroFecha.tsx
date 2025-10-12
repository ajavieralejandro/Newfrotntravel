import { useState, useEffect } from "react";
import {
  Box,
  useMediaQuery,
  Collapse,
  Typography,
} from "@mui/material";
import {
  LocalizationProvider,
  DesktopDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EventIcon from "@mui/icons-material/Event";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import { useTheme } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import { useFiltrosYOrdenamiento } from "../../contextos/filtro/FiltrosYOrdenamientoContext";

const fmt = (d: Dayjs | null) => (d ? d.format("DD-MM-YYYY") : null);
const parse = (s: string | null | undefined): Dayjs | null =>
  s ? dayjs(s, "DD-MM-YYYY") : null;

/**
 * FiltroFecha
 * - Conecta con filtros.fecha { desde, hasta } en el contexto.
 * - Formato "DD-MM-YYYY".
 * - Criterio en filtros: pasa si alguna salida del paquete intersecta el rango seleccionado.
 */
const FiltroFecha = () => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();
  const { filtros, setFiltros } = useFiltrosYOrdenamiento();

  const theme = useTheme();
  const esMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mostrarInput, setMostrarInput] = useState(false);

  const [desde, setDesde] = useState<Dayjs | null>(parse(filtros.fecha?.desde));
  const [hasta, setHasta] = useState<Dayjs | null>(parse(filtros.fecha?.hasta));

  const colorFondo =
    tarjetas?.color?.primario || datosGenerales?.color?.primario || "#1976d2";
  const colorTexto =
    tarjetas?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#fff";

  // Sincronizar cuando el contexto cambie desde afuera (reset/borrar filtros)
  useEffect(() => {
    setDesde(parse(filtros.fecha?.desde));
    setHasta(parse(filtros.fecha?.hasta));
  }, [filtros.fecha?.desde, filtros.fecha?.hasta]);

  // Propagar cambios al contexto inmediatamente
  useEffect(() => {
    setFiltros({ fecha: { desde: fmt(desde), hasta: fmt(hasta) } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desde, hasta]);

  return (
    <Box
      sx={{
        backgroundColor: colorFondo,
        p: esMobile ? 1.5 : 3,
        borderRadius: 4,
        boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
        textAlign: "center",
        width: "100%",
        maxWidth: "100%",
        mx: "auto",
      }}
    >
      {/* Encabezado como botón en mobile */}
      <Box
        role={esMobile ? "button" : undefined}
        aria-label="Mostrar/ocultar filtro por fecha"
        onClick={() => esMobile && setMostrarInput(!mostrarInput)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          color: colorTexto,
          fontWeight: "bold",
          fontFamily: "Verdana, sans-serif",
          fontSize: esMobile ? "0.8rem" : "0.9rem",
          cursor: esMobile ? "pointer" : "default",
          borderRadius: esMobile ? "999px" : 0,
          backgroundColor: esMobile ? `${colorFondo}dd` : "transparent",
          px: esMobile ? 2 : 0,
          py: esMobile ? 0.8 : 0,
          mx: "auto",
          width: "fit-content",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: esMobile ? `${colorFondo}f2` : "inherit",
          },
        }}
      >
        <EventIcon sx={{ fontSize: esMobile ? 18 : 22 }} />
        Seleccionar fechas
      </Box>

      {/* DatePickers visibles en desktop o al expandir en mobile */}
      <Collapse in={!esMobile || mostrarInput}>
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            alignItems: "center",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box>
              <Typography variant="caption" sx={{ color: "#fff" }}>
                Desde
              </Typography>
              <DesktopDatePicker
                value={desde}
                onChange={(v) => setDesde(v)}
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      bgcolor: "white",
                      borderRadius: 2,
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                        fontSize: esMobile ? "0.8rem" : "0.9rem",
                      },
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "#fff" }}>
                Hasta
              </Typography>
              <DesktopDatePicker
                value={hasta}
                onChange={(v) => setHasta(v)}
                minDate={desde ?? undefined}
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      bgcolor: "white",
                      borderRadius: 2,
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                        fontSize: esMobile ? "0.8rem" : "0.9rem",
                      },
                    },
                  },
                }}
              />
            </Box>
          </LocalizationProvider>
        </Box>
      </Collapse>
    </Box>
  );
};

export default FiltroFecha;

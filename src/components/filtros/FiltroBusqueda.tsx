import { Box, InputBase, useMediaQuery, Collapse } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useFiltrosYOrdenamiento } from "../../contextos/filtro/FiltrosYOrdenamientoContext";

/**
 * Filtro de búsqueda por nombre de paquete.
 * - Vinculado a filtros.busquedaNombre del contexto.
 * - Incluye debounce para evitar recomputar en cada tecla.
 */
const FiltroBusqueda = () => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();
  const { filtros, setFiltros } = useFiltrosYOrdenamiento();

  const theme = useTheme();
  const esMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mostrarInput, setMostrarInput] = useState(false);

  const [q, setQ] = useState<string>(filtros.busquedaNombre ?? "");

  useEffect(() => {
    setQ(filtros.busquedaNombre ?? "");
  }, [filtros.busquedaNombre]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFiltros({ busquedaNombre: q });
    }, 250);
    return () => clearTimeout(t);
  }, [q, setFiltros]);

  const colorFondo = tarjetas?.color?.primario || datosGenerales?.color?.primario || "#1976d2";
  const colorTexto = tarjetas?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#fff";
  const colorInputFondo = tarjetas?.color?.secundario || datosGenerales?.color?.secundario || "#f0f0f0";

  return (
    <Box
      sx={{
        backgroundColor: colorFondo,
        padding: { xs: 1, sm: 1.5, md: 2 },
        borderRadius: "6px",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 1, sm: 1.5 },
      }}
    >
      {/* Encabezado interactivo */}
      <Box
        role={esMobile ? "button" : undefined}
        aria-label="Mostrar/ocultar búsqueda por nombre"
        onClick={() => esMobile && setMostrarInput(!mostrarInput)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          color: colorTexto,
          fontWeight: "bold",
          fontFamily: "Verdana, sans-serif",
          fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
          cursor: esMobile ? "pointer" : "default",
          borderRadius: "6px",
          backgroundColor: esMobile ? `${colorFondo}dd` : "transparent",
          px: { xs: 1, sm: 1.5 },
          py: { xs: 0.5, sm: 0.8 },
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: esMobile ? `${colorFondo}f2` : "inherit",
          },
        }}
      >
        <SearchIcon sx={{ fontSize: { xs: 16, sm: 18, md: 22 } }} />
        Filtrar por Nombres
      </Box>

      {/* Input visible solo en desktop o al desplegar en mobile */}
      <Collapse
        in={!esMobile || mostrarInput}
        sx={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: colorInputFondo,
            borderRadius: "6px",
            px: 2,
            py: 1,
            width: "90%",
            maxWidth: 400,
            height: 42,
          }}
        >
          <InputBase
            aria-label="Buscar por nombre de paquete"
            placeholder="Buscar por nombre"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            sx={{
              flexGrow: 1,
              px: 1,
              color: tarjetas?.tipografiaColorContenido || "#333",
              fontWeight: "bold",
              fontSize: esMobile ? "0.8rem" : "0.9rem",
              "&::placeholder": {
                color: `${colorTexto}99`,
              },
              borderRadius: "6px",
            }}
          />
          <SearchIcon
            sx={{
              color: colorTexto,
              fontSize: esMobile ? 18 : 22,
              ml: 1,
            }}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default FiltroBusqueda;

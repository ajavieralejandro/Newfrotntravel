import React, { useMemo } from "react";
import { Box, Typography, Paper } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DOMPurify from "dompurify";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";

interface DescripcionContentProps {
  descripcion?: string | null;
}

const DescripcionContent: React.FC<DescripcionContentProps> = ({ descripcion }) => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();

  const tipografia = tarjetas?.tipografia || datosGenerales?.tipografiaAgencia || "sans-serif";
  const colorPrimario = tarjetas?.color?.primario || "#1976d2";
  const colorTexto = tarjetas?.tipografiaColorContenido || "#333";

  const pestanaActual = localStorage.getItem("pestanaActiva")
  const descrip = pestanaActual === "hoteles" ? "Hotel" : "Paquete"

  const descripcionProcesada = useMemo(() => {
    if (!descripcion) return null;

    // 1. Decodificar entidades HTML
    const decoded = decodeHtml(descripcion);

    // 2. Limpiar HTML potencialmente inseguro
    const sanitized = DOMPurify.sanitize(decoded, {
      USE_PROFILES: { html: true },
    });

    return sanitized;
  }, [descripcion]);

  return (
    <Box sx={{ mt: 2, px: 2 }}>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          p: 3,
          borderRadius: 4,
          backgroundColor: "#fff",
          border: `1px solid ${colorPrimario}`,
          boxShadow: `0 4px 12px rgba(0,0,0,0.08)`,
        }}
      >
        {/* Icono */}
        <Box sx={{ color: colorPrimario, pt: 0.5 }}>
          <InfoOutlinedIcon sx={{ fontSize: 40 }} />
        </Box>

        {/* Texto con HTML */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: tipografia,
              color: colorPrimario,
              fontWeight: "bold",
              mb: 1,
              fontSize: "1.25rem",
            }}
          >
            Descripción del {descrip}
          </Typography>

          {descripcionProcesada ? (
            <Box
              sx={{
                fontFamily: tipografia,
                color: colorTexto,
                fontSize: "1rem",
                lineHeight: 1.6,
                "& ul": { pl: 3, mt: 1 },
                "& li": { mb: 0.5 },
                "& p": { mb: 1 },
              }}
              dangerouslySetInnerHTML={{ __html: descripcionProcesada }}
            />
          ) : (
            <Typography
              variant="body1"
              sx={{
                fontFamily: tipografia,
                color: colorTexto,
                fontWeight: 400,
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            >
              No hay descripción disponible para este paquete turístico.
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

// Utilidad para decodificar entidades HTML como &lt; &gt; &aacute;
function decodeHtml(html: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export default DescripcionContent;

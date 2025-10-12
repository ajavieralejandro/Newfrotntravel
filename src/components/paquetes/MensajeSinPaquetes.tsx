import React from "react";
import { Box, Typography, Paper, Container } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";

const MensajeSinPaquetes: React.FC = () => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();

  const tipografia = tarjetas?.tipografia || datosGenerales?.tipografiaAgencia || "sans-serif";
  const colorPrimario = tarjetas?.color?.primario || "#1976d2";
  const colorTexto = tarjetas?.tipografiaColorContenido || "#555";

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 6,
          mb: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh", // centrado pero no exagerado
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: 500,
            width: "100%",
            p: 4,
            borderRadius: 4,
            border: `1px solid ${colorPrimario}`,
            boxShadow: `0 4px 12px rgba(0,0,0,0.08)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <SearchOffIcon sx={{ fontSize: 60, color: colorPrimario, mb: 2 }} />

          <Typography
            variant="h6"
            sx={{
              fontFamily: tipografia,
              color: colorPrimario,
              fontWeight: "bold",
              fontSize: "1.4rem",
              mb: 1,
            }}
          >
            No encontramos resultados
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontFamily: tipografia,
              color: colorTexto,
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            Probá modificando los filtros o intentá con otra ciudad o fecha para encontrar nuevas opciones.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default MensajeSinPaquetes;

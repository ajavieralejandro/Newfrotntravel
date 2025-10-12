// components/paquetes/Hotel.tsx
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import type { Hotel as HotelType } from "../../interfaces/Hotel";

interface HotelProps {
  hotel: HotelType; // ✅ usa la interfaz real (id_hotel: string)
}

const Hotel: React.FC<HotelProps> = ({ hotel }) => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();

  const tipografia = tarjetas?.tipografia || datosGenerales?.tipografiaAgencia || "sans-serif";
  const colorPrimario = tarjetas?.color?.primario || "#1976d2";
  const colorTexto = tarjetas?.tipografiaColorContenido || "#333";

  // ⭐ número seguro entre 0 y 5
  const estrellasRaw = Number(hotel.categoria_hotel ?? "0");
  const estrellas = Math.min(5, Math.max(0, Number.isFinite(estrellasRaw) ? estrellasRaw : 0));

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        backgroundColor: "#fff",
        border: `1px solid ${colorPrimario}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: tipografia,
          color: colorPrimario,
          fontWeight: "bold",
          fontSize: "1.3rem",
          mb: 1,
        }}
      >
        {hotel.nombre}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {[...Array(estrellas)].map((_, index) => (
          <StarIcon key={index} sx={{ color: "#FFD700", fontSize: 20 }} />
        ))}
        {estrellas === 0 && (
          <Typography
            variant="body2"
            sx={{ fontFamily: tipografia, color: colorTexto, fontStyle: "italic" }}
          >
            Sin categoría
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default Hotel;

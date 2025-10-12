// components/paquetes/TransporteContent.tsx
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FlightIcon from "@mui/icons-material/Flight";
import TrainIcon from "@mui/icons-material/Train";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import type { Salida } from "../../interfaces/Salida";

interface TransporteContentProps {
  /** Texto libre del paquete (ej: "Aéreo + Bus") */
  transporte?: string | null;
  /** Tipo canónico de la primera salida (si lo usás) */
  tipoTransporte?: Salida["tipo_transporte"] | null;
  /** Lista de tipos detectados en todas las salidas */
  tiposTransporte?: Salida["tipo_transporte"][] | null;
}

const iconoPorTipoCanonico = (tipo?: Salida["tipo_transporte"] | null) => {
  switch (tipo) {
    case "avion":
      return <FlightIcon sx={{ fontSize: 40 }} />;
    case "bus":
      return <DirectionsBusIcon sx={{ fontSize: 40 }} />;
    default:
      return null;
  }
};

const iconoChip = (tipo: Salida["tipo_transporte"]): React.ReactNode => {
  switch (tipo) {
    case "avion":
      return <FlightIcon sx={{ fontSize: 20 }} />;
    case "bus":
      return <DirectionsBusIcon sx={{ fontSize: 20 }} />;
    default:
      return null;
  }
};

const iconoPorTextoLibre = (texto: string) => {
  const t = texto.toLowerCase();
  if (t.includes("avion") || t.includes("avión") || t.includes("aereo") || t.includes("aéreo") || t.includes("vuelo"))
    return <FlightIcon sx={{ fontSize: 40 }} />;
  if (t.includes("bus") || t.includes("micro") || t.includes("ómnibus") || t.includes("omnibus"))
    return <DirectionsBusIcon sx={{ fontSize: 40 }} />;
  if (t.includes("tren")) return <TrainIcon sx={{ fontSize: 40 }} />;
  if (t.includes("camión") || t.includes("camion") || t.includes("flete")) return <LocalShippingIcon sx={{ fontSize: 40 }} />;
  if (t.includes("auto") || t.includes("vehículo") || t.includes("vehiculo")) return <DirectionsCarIcon sx={{ fontSize: 40 }} />;
  return null;
};

const labelPorTipo = (tipo?: Salida["tipo_transporte"] | null): string | null => {
  switch (tipo) {
    case "avion":
      return "Aéreo";
    case "bus":
      return "Bus";
    default:
      return null;
  }
};

const derivarTipoDesdeTextoLibre = (texto?: string | null): Salida["tipo_transporte"] | null => {
  const t = (texto ?? "").toLowerCase();
  if (!t) return null;
  if (t.includes("avion") || t.includes("avión") || t.includes("aereo") || t.includes("aéreo") || t.includes("vuelo")) return "avion";
  if (t.includes("bus") || t.includes("micro") || t.includes("ómnibus") || t.includes("omnibus")) return "bus";
  return null;
};

const TransporteContent: React.FC<TransporteContentProps> = ({ transporte, tipoTransporte, tiposTransporte }) => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();

  const tipografia = tarjetas?.tipografia || datosGenerales?.tipografiaAgencia || "sans-serif";
  const colorPrimario = tarjetas?.color?.primario || "#1976d2";
  const colorTexto = tarjetas?.tipografiaColorContenido || "#333";

  const transporteTrim = (transporte ?? "").trim();

  // Tipos únicos válidos provenientes de salidas
  const tiposUnicos = Array.from(new Set((tiposTransporte ?? []).filter(Boolean))) as Salida["tipo_transporte"][];

  // Prioridad para mostrar (simple y predecible):
  // 1) Si hay múltiples tipos → chips
  // 2) Si hay un solo tipo → usar ese como canónico
  // 3) Sino, usar tipoTransporte directo
  // 4) Sino, derivar desde texto libre
  const tipoCanonicoPreferido: Salida["tipo_transporte"] | null =
    (tiposUnicos.length === 1 && tiposUnicos[0]) ||
    (tipoTransporte as Salida["tipo_transporte"]) ||
    derivarTipoDesdeTextoLibre(transporteTrim);

  // Si no hay ningún tipo válido, no mostrar nada
  if (!tipoCanonicoPreferido && tiposUnicos.length === 0 && !transporteTrim) {
    return null;
  }

  // Icono preferente: por tipo canónico; si no, por texto; si no hay datos válidos, no mostrar icono
  const iconCanon = iconoPorTipoCanonico(tipoCanonicoPreferido);
  const iconLibre = transporteTrim ? iconoPorTextoLibre(transporteTrim) : null;
  const icono = iconCanon ?? iconLibre;

  // Texto a mostrar cuando NO hay múltiples tipos
  const mostrarTexto =
    transporteTrim ||
    labelPorTipo(tipoCanonicoPreferido) ||
    "Información de transporte disponible";

  return (
    <Box sx={{ mt: 2, px: 2 }}>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
          border: `1px solid ${colorPrimario}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          width: "95%",
        }}
      >
        {icono && <Box sx={{ color: colorPrimario }}>{icono}</Box>}

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontFamily: tipografia, color: colorPrimario, fontWeight: "bold", mb: 0.5, fontSize: "1.25rem" }}
          >
            Medio de transporte
          </Typography>

          {tiposUnicos.length > 1 ? (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
              {tiposUnicos.map((t) => (
                <Box
                  key={t}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    border: `1px solid ${colorPrimario}`,
                    borderRadius: 999,
                    px: 1.2,
                    py: 0.5,
                    color: colorTexto,
                  }}
                >
                  {iconoChip(t)}
                  <Typography variant="body2" sx={{ fontFamily: tipografia }}>
                    {labelPorTipo(t)}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              variant="body1"
              sx={{ fontFamily: tipografia, color: colorTexto, fontWeight: 500, fontSize: "1rem", lineHeight: 1.5 }}
            >
              {mostrarTexto}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TransporteContent;

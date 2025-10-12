// components/paquetes/TarjetaSalida.tsx
import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import type { Salida } from "../../interfaces/Salida";

type TipoHabitacion =
  | "single"
  | "doble"
  | "triple"
  | "cuadruple"
  | "familia_1"
  | "familia_2";

type CampoPrecio = "precio" | "impuesto" | "otro" | "otro2";

// 🔹 Keys válidas que existen en Salida: "single_precio", "doble_impuesto", etc.
type PrecioKey = `${TipoHabitacion}_${CampoPrecio}`;
// Ayuda a TS a entender que esas keys están en Salida
type PrecioKeyEnSalida = Extract<keyof Salida, PrecioKey>;

interface Props {
  salida: Salida;
  campos: CampoPrecio[]; // ej: ["precio","impuesto","otro","otro2"]
  labels: Record<TipoHabitacion, string>; // ej: { single: "Single", ... }
  campoLabels: Partial<Record<CampoPrecio, string>>; // ej: { precio: "Precio", ... }
  mostrarCampo: (valor?: number) => boolean;
  formatearUSD: (valor?: number) => string;
  colorPrimario: string;
  colorTexto: string;
  tipografia: string;
  /** opcional: transporte del paquete para fallback ("Aéreo", "Bus", etc.) */
  transportePaquete?: string | null;
}

const isNumericString = (s: string) => /^-?\d+(\.\d+)?$/.test(s.trim());

/** Acceso seguro a salida["doble_precio"] etc. (acepta número o string numérico) */
function getValor(
  salida: Salida,
  tipo: TipoHabitacion,
  campo: CampoPrecio
): number | undefined {
  const key = `${tipo}_${campo}` as PrecioKeyEnSalida;
  const val = salida[key];
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (typeof val === "string" && val.trim() !== "" && isNumericString(val)) {
    const n = Number(val);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

const labelTransporte = (t: Salida["tipo_transporte"]) =>
  t === "avion" ? "Aéreo" : t === "bus" ? "Bus" : null;

function derivarTipoTransporte(
  tipo?: Salida["tipo_transporte"],
  transportePaquete?: string | null
): "avion" | "bus" | null {
  if (tipo === "avion" || tipo === "bus") return tipo;
  const base = (transportePaquete || "").toLowerCase();
  if (base.includes("aéreo") || base.includes("aereo")) return "avion";
  if (base.includes("bus")) return "bus";
  return null;
}

const TarjetaSalida: React.FC<Props> = ({
  salida,
  campos,
  labels,
  campoLabels,
  mostrarCampo,
  formatearUSD,
  colorPrimario,
  colorTexto,
  tipografia,
  transportePaquete,
}) => {
  // Detectar qué tipos tienen al menos un _precio visible
  const tiposConDatos: TipoHabitacion[] = (Object.keys(labels) as TipoHabitacion[]).filter((tipo) =>
    mostrarCampo(getValor(salida, tipo, "precio"))
  );

  if (tiposConDatos.length === 0) return null;

  const tipoTransporteFinal = derivarTipoTransporte(salida.tipo_transporte, transportePaquete);
  const labelTransporteFinal = tipoTransporteFinal ? labelTransporte(tipoTransporteFinal) : null;

  return (
    <Box key={salida.id} sx={{ mb: 5 }}>
      {/* Info general + transporte */}
      <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
        {salida.fecha_desde && salida.fecha_hasta && (
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              fontFamily: tipografia,
              color: colorPrimario,
              fontSize: "1.1rem",
            }}
          >
            Salida:{" "}
            <Box component="span" sx={{ fontWeight: 500, color: colorTexto }}>
              {salida.fecha_desde} - {salida.fecha_hasta}
            </Box>
          </Typography>
        )}

        {/* Badge transporte - solo si hay datos válidos */}
        {labelTransporteFinal && (
          <Chip
            size="small"
            label={labelTransporteFinal}
            sx={{
              bgcolor: "#fff",
              border: `1px solid ${colorPrimario}`,
              color: colorPrimario,
              fontFamily: tipografia,
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      {/* Cards por tipo */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "flex-start" }}>
        {tiposConDatos.map((tipo) => (
          <Box
            key={tipo}
            sx={{
              border: `1px solid ${colorPrimario}`,
              borderRadius: 3,
              p: 2,
              minWidth: 200,
              flex: "1 1 220px",
              backgroundColor: "#fff",
              boxShadow: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                color: colorPrimario,
                fontFamily: tipografia,
                mb: 1,
                fontSize: "1.1rem",
              }}
            >
              {labels[tipo]}
            </Typography>

            {campos.map((campo) => {
              const valor = getValor(salida, tipo, campo);
              if (!mostrarCampo(valor)) return null;

              return (
                <Box key={campo} sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: colorPrimario, fontFamily: tipografia }}>
                    {campoLabels[campo] ?? campo.toUpperCase()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: colorTexto, fontFamily: tipografia, lineHeight: 1.3 }}
                  >
                    {formatearUSD(valor)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TarjetaSalida;

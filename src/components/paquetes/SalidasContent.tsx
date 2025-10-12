// components/paquetes/SalidasContent.tsx
import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import TarjetaSalida from "./TarjetaSalida";
import type { Salida } from "../../interfaces/Salida";

type TipoHabitacion = "single" | "doble" | "triple" | "cuadruple" | "familia_1" | "familia_2";
type CampoPrecio = "precio" | "impuesto" | "otro" | "otro2";

interface SalidasContentProps {
  salidas?: Salida[];
  /** ⚠️ Se mantiene por compatibilidad, pero no se renderiza */
  fechaSalida?: string;
  currency?: string;
  /** Fallback desde el paquete (ej: "Aéreo", "Bus") */
  transportePaquete?: string | null;
}

const SalidasContent: React.FC<SalidasContentProps> = ({
  salidas,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fechaSalida: _fechaSalida, // mantenido pero NO usado
  currency = "USD",
  transportePaquete,
}) => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();

  const tipografia = tarjetas?.tipografia || datosGenerales?.tipografiaAgencia || "sans-serif";
  const colorPrimario = tarjetas?.color?.primario || "#FF9800";
  const colorTexto = tarjetas?.tipografiaColorContenido || "#333";

  if (!salidas || salidas.length === 0) {
    return <Typography>No hay salidas disponibles</Typography>;
  }

  const mostrarCampo = (valor?: number): boolean =>
    typeof valor === "number" && Number.isFinite(valor) && valor !== 0;

  // --- Normalización de moneda ---
  const normalizeCurrencyCode = (c?: string): string => {
    if (!c) return "ARS";
    const raw = c.trim();
    const upper = raw.toUpperCase();

    // Variantes comunes de "peso" → ARS
    const pesoHints = ["PESO", "PESOS"];
    const pesoSymbols = ["ARS$", "$", "AR$", "ARG$", "$ARS", "ARS $"];

    if (pesoHints.some((h) => upper.includes(h))) return "ARS";
    if (pesoSymbols.includes(upper)) return "ARS";

    // Si viene ya como código, lo dejamos en mayúsculas
    return upper;
  };

  const safeCurrency = normalizeCurrencyCode(currency);

  const formatearMoneda = (valor?: number): string => {
    const n = typeof valor === "number" && Number.isFinite(valor) ? valor : 0;
    try {
      return new Intl.NumberFormat("es-AR", { style: "currency", currency: safeCurrency }).format(n);
    } catch {
      try {
        return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);
      } catch {
        return new Intl.NumberFormat("es-AR").format(n);
      }
    }
  };

  const labels: Record<TipoHabitacion, string> = {
    single: "Single",
    doble: "Doble",
    triple: "Triple",
    cuadruple: "Cuádruple",
    familia_1: "Familiar 1",
    familia_2: "Familiar 2",
  };

  const campos: CampoPrecio[] = ["precio", "impuesto", "otro", "otro2"];

  const campoLabels: Partial<Record<CampoPrecio, string>> = {
    precio: "Precio",
    impuesto: "Impuesto",
    otro: "Otro",
    otro2: "Otro 2",
  };

  return (
    <Box sx={{ mt: 2, px: 2 }}>
      {/* ❌ Se elimina por completo la renderización de "Fecha del viaje" */}

      <Divider sx={{ mb: 2 }} />

      {salidas.map((salida) => (
        <TarjetaSalida
          key={salida.id}
          salida={salida}
          campos={campos}
          labels={labels}
          campoLabels={campoLabels}
          mostrarCampo={mostrarCampo}
          formatearUSD={formatearMoneda} // mantiene la firma esperada por TarjetaSalida
          colorPrimario={colorPrimario}
          colorTexto={colorTexto}
          tipografia={tipografia}
          transportePaquete={transportePaquete}
        />
      ))}
    </Box>
  );
};

export default SalidasContent;

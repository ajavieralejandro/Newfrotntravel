import React, { useState } from "react";
import { Card, Backdrop, CircularProgress } from "@mui/material";
import { PaqueteData} from "../../../interfaces/PaqueteData";
import {
  useTarjetas,
  useDatosGenerales,
} from "../../../contextos/agencia/DatosAgenciaContext";
import CartaMesImagen from "./cartaMes/CartaMesImagen";
import CartaMesContenido from "./cartaMes/CartaMesContenido";
import CartaMesPrecio from "./cartaMes/CartaMesPrecio";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// utils/precios.ts
type CurrencyCode = 'ARS' | 'USD';

function norm(s: unknown): string {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')   // quita tildes (Dólar -> Dolar)
    .replace(/\s+/g, '')
    .toLowerCase();
}

/**
 * Mapea entradas variadas a ISO 4217.
 * - Por defecto, "$" se asume ARS (contexto Argentina).
 * - Podés cambiar ese criterio con `assumeSymbolAs`.
 */
export function resolveCurrency(
  raw: unknown,
  opts: { defaultCode?: CurrencyCode; assumeSymbolAs?: CurrencyCode } = {}
): CurrencyCode {
  const { defaultCode = 'ARS', assumeSymbolAs = 'ARS' } = opts;
  const s = norm(raw);

  // Aliases comunes
  const peso = new Set(['peso', 'pesos', 'ars', 'ar$', 'arg', '$', 'ars$']);
  const dolar = new Set(['dolar', 'dolares', 'usd', 'u$s', 'us$', 'u$d', 'u$']);

  if (peso.has(s)) return s === '$' ? assumeSymbolAs : 'ARS';
  if (dolar.has(s)) return 'USD';

  // Casos directos ya normalizados
  if (s === 'ars') return 'ARS';
  if (s === 'usd') return 'USD';

  // Si viene con símbolos mezclados, intentamos detectar
  if (/\busd\b|us\$|u\$s|u\$|u\$d/i.test(String(raw))) return 'USD';
  if (/\bars\b|ar\$|\barg\b/.test(String(raw))) return 'ARS';
  if (/\$/.test(String(raw))) return assumeSymbolAs;

  // Fallback
  return defaultCode;
}

/**
 * Intenta parsear números con coma o punto y con/ sin separador de miles.
 * Ejemplos válidos: "1.234,56" | "1,234.56" | "1234,56" | "1234.56" | 1234
 */
export function parseMonto(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;

  let s = String(raw ?? '').trim();
  if (!s) return 0;

  // Quitamos todo lo no numérico salvo . , y -
  s = s.replace(/[^\d.,-]/g, '');

  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  if (hasComma && hasDot) {
    // Heurística: si ambos existen, asumimos coma decimal (formato es-AR)
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (hasComma && !hasDot) {
    // Solo coma → decimal
    s = s.replace(',', '.');
  } else {
    // Solo punto o ninguno → ya está OK
  }

  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Busca un precio razonable dentro del paquete.
 * Prioriza salidas[0].doble_precio, luego salida.precio, luego paquete.precio.
 */
export function extractPrecio(paquete: any): number {
  const salida0 = paquete?.salidas?.[0];
  const candidatos = [
    salida0?.doble_precio,
    salida0?.precio,
    paquete?.precio,
  ];
  for (const c of candidatos) {
    const n = parseMonto(c);
    if (n > 0) return n;
  }
  return 0;
}

/**
 * Intenta deducir moneda viendo varios campos posibles del paquete/salida.
 */
export function extractCurrency(paquete: any): CurrencyCode {
  const salida0 = paquete?.salidas?.[0];

  const candidatos = [
    paquete?.tipo_moneda,
    paquete?.moneda,
    paquete?.currency,
    salida0?.tipo_moneda,
    salida0?.moneda,
  ];

  for (const c of candidatos) {
    const code = resolveCurrency(c);
    if (code) return code;
  }
  return 'ARS';
}

interface CartaMesProps {
  paquete: PaqueteData;
}

const CartaMes: React.FC<CartaMesProps> = ({ paquete }) => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  const tipografia =
    tarjetas?.tipografia ||
    datosGenerales?.tipografiaAgencia ||
    "'Poppins', sans-serif";

  // 🔥 Ahora forzamos fondo blanco para coherencia de lectura
  const colorFondo = "#FFFFFF";

  const colorSecundario =
    tarjetas?.color?.secundario ||
    datosGenerales?.color?.secundario ||
    "#CCCCCC";

  const handleClick = () => {
    setCargando(true);
    navigate(`/paquetes-busqueda/${paquete.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ width: "100%", height: "100%", maxWidth: "100%" }}
    >
      <Card
        onClick={handleClick}
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          minHeight: { xs: "380px", sm: "400px", md: "420px" },
          borderRadius: "6px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease-in-out",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
          },
          backgroundColor: colorFondo,
          fontFamily: tipografia,
          display: "flex",
          flexDirection: "column",
          border: "none",
          outline: "none",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <CartaMesImagen
          imagen={paquete.imagen_principal || "/imagenes/default-image.jpg"}
          alt={paquete.titulo}
          cargando={false}
          colorSecundario={colorSecundario}
        />

        <CartaMesContenido
          nombre={paquete.titulo}
          cargando={false}
        />

        <CartaMesPrecio
           precio={Number(paquete.salidas[0].doble_precio ?? 0)}
          moneda={extractCurrency(paquete)} 
          wp = {paquete}
        />

        <Backdrop
          open={cargando}
          sx={{
            position: "absolute",
            zIndex: 10,
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: "6px",
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Card>
    </motion.div>
  );
};

export default CartaMes;

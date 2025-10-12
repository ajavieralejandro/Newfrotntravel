import React from "react";
import { CardContent, Typography, Tooltip } from "@mui/material";
import { useDatosGenerales, useTarjetas } from "../../../../contextos/agencia/DatosAgenciaContext";

interface CartaMesContenidoProps {
  nombre: string;
  cargando: boolean;
}

/** Decodifica entidades HTML comunes (sin tocar el DOM) */
function decodeEntities(input: string): string {
  if (!input) return "";
  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };
  const base = input.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (m) => map[m] || m);
  const withDec = base.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)));
  const withHex = withDec.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  return withHex;
}

/** Normaliza y reduce el título para mostrar y tooltip */
function normalizarTituloPaquete(tituloRaw: string, maxLen = 60) {
  if (!tituloRaw || !tituloRaw.trim()) {
    return { displayTitle: "Paquete sin título", fullTitle: "Paquete sin título" };
  }

  // 1) sanitizar básico
  const full = decodeEntities(
    tituloRaw
      .replace(/<br\s*\/?>/gi, "\n") // br -> salto de línea
      .replace(/<[^>]+>/g, "") // quitar cualquier otra etiqueta
      .replace(/\s+/g, " ") // normalizar espacios
      .trim()
  );

  // 2) primera línea
  let firstLine = full.split(/\r?\n/)[0]?.trim() || full;

  // 3) si hay " - " y a la derecha hay ruido, recortamos
  const dashIdx = firstLine.indexOf(" - ");
  if (dashIdx > -1) {
    const left = firstLine.slice(0, dashIdx).trim();
    const right = firstLine.slice(dashIdx + 3).trim().toLowerCase();

    const ruido =
      /\b(cupo|cupos|confirmad[oa]s?|salida[s]?|fecha[s]?|aerol(í|i)neas|latam|jetsmart|flybondi|ar\b|all inclusive|ai\b)\b/i;
    if (ruido.test(right)) {
      firstLine = left;
    }
  }

  // 4) límite de longitud (conservar palabras si se puede)
  let display = firstLine;
  if (display.length > maxLen) {
    const slice = display.slice(0, maxLen);
    const lastSpace = slice.lastIndexOf(" ");
    display = (lastSpace > maxLen * 0.6 ? slice.slice(0, lastSpace) : slice).trim() + "…";
  }

  return { displayTitle: display, fullTitle: full };
}

const CartaMesContenido: React.FC<CartaMesContenidoProps> = ({ nombre, cargando }) => {
  const datosGenerales = useDatosGenerales();
  const tarjetas = useTarjetas();

  const tipografia =
    tarjetas?.tipografia ||
    datosGenerales?.tipografiaAgencia ||
    "'Poppins', sans-serif";

  const tipografiaColorTitulo =
    tarjetas?.tipografiaColorTitulo ||
    datosGenerales?.colorTipografiaAgencia ||
    "#000000";

  const { displayTitle, fullTitle } = React.useMemo(
    () => normalizarTituloPaquete(nombre, 60),
    [nombre]
  );

  return (
    <CardContent
      sx={{
       // backgroundColor: "#FFFFFF",
        backgroundColor: "#dbdbdc",
        padding: { xs: "12px", sm: "16px", md: "16px" },
        textAlign: "center",
        opacity: cargando ? 0 : 1,
        fontFamily: tipografia,
        flexGrow: 1,
        minHeight: { xs: "80px", sm: "80px", md: "80px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Tooltip title={fullTitle} arrow enterDelay={700}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.6rem", sm: "1.8rem", md: "1.4rem" },
            color: tipografiaColorTitulo,
            fontFamily: tipografia,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 2, // clamp a 2 líneas en la card
          }}
        >
          {displayTitle}
        </Typography>
      </Tooltip>
    </CardContent>
  );
};

export default CartaMesContenido;

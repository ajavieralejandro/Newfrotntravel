import React from "react";
import { Box, Typography } from "@mui/material";
import { useDatosGenerales, useTarjetas } from "../../../../contextos/agencia/DatosAgenciaContext";
import BotonConsultar from "../../../paquetes/BotonConsultar";
import { PaqueteData } from "../../../../interfaces/PaqueteData";

// Función para calcular contraste (devuelve blanco o negro)
const getContrastingColor = (hexColor: string): string => {
  let color = hexColor.replace("#", "");
  if (color.length === 3) {
    color = color.split("").map((c) => c + c).join("");
  }
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

interface CartaMesPrecioProps {
  precio: number;
  moneda: string;
  wp: PaqueteData
}

const normalizeCurrencyCode = (c?: string): string => {
  if (!c) return "ARS";
  const raw = c.trim();
  const upper = raw.toUpperCase();

  // Variantes comunes de "peso" → ARS
  const pesoHints = ["PESO", "PESOS", "Peso", "ARS"];
  const pesoSymbols = ["ARS$", "$", "AR$", "ARG$", "$ARS", "ARS $"];

  if (pesoHints.some((h) => upper.includes(h))) return "ARS";
  if (pesoSymbols.includes(upper)) return "ARS";

  // Si viene ya como código, lo dejamos en mayúsculas
  return upper;
};

const CartaMesPrecio: React.FC<CartaMesPrecioProps> = ({ precio, moneda, wp }) => {
  const datosGenerales = useDatosGenerales();
  const tarjetas = useTarjetas();

  const tipografia =
    tarjetas?.tipografia ||
    datosGenerales?.tipografiaAgencia ||
    "Poppins, sans-serif";

  const colorPrimario =
    tarjetas?.color?.primario ||
    datosGenerales?.color?.primario ||
    "#FFFFFF";

  const textoContraste = getContrastingColor(colorPrimario);

  const codigoMoneda = normalizeCurrencyCode(moneda);
  const mostrarConsultar = !precio || precio === 0;

  return (
    <Box
      sx={{
        backgroundColor: colorPrimario,
        color: textoContraste,
        padding: { xs: "12px", sm: "16px", md: "16px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: tipografia,
        borderRadius: "0 0 6px 6px",
      }}
    >
       
      <Typography
        variant="subtitle2"
        fontWeight="bold"                                      // color: textoContraste
        sx={{ fontSize: { xs: "1rem", sm: "1 rem", md: "1 rem" }, color: textoContraste }}
      >
        {mostrarConsultar ? "" : "Desde"}
      </Typography>
      <Typography
        variant="h4"
       // fontWeight="bold"
        sx={{
          fontSize: { xs: "2rem", sm: "2rem", md: "2rem" },
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: "#A73439", //color se puede sacar de datos generales
          //color: textoContraste,
        }}
      >
        {mostrarConsultar ? (                   // #A73439 color: textoContraste
          "Consultar" 
        ) : (
          <>
            <span style={{ fontFamily: tipografia, color: "#A73439", fontSize: 25, fontWeight : "bold" }}> 
              {codigoMoneda}
            </span>
            {Math.round(precio).toLocaleString("es-AR")}
          </>
        )}
      </Typography>
      <Box
  onClick={(e) => e.stopPropagation()}
  sx={{
    width: "100%",
    display: "flex",
    justifyContent: "center", // o "flex-start" / "flex-end" según tu diseño
    alignItems: "center",
    mt: 1, // margen opcional
  }}
>
        <BotonConsultar paquete={wp} />
      </Box>
    </Box>
  );
};

export default CartaMesPrecio;

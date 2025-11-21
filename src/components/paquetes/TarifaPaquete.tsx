import { Box, Typography, Skeleton, Divider } from "@mui/material";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import BotonConsultar from "./BotonConsultar";
import type { PaqueteData } from "../../interfaces/PaqueteData";

interface TarifaPaqueteProps {
  tarifa: number | null | undefined;
  impuestos: number | null | undefined;
  divisa: string | null | undefined;
  total: string | null | undefined;
  wp: PaqueteData;
  cargando?: boolean;
}

const TarifaPaquete = ({
  tarifa,
  impuestos,
  total,
  wp,
  divisa,
  cargando = false,
}: TarifaPaqueteProps) => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();

  const colorPrimario =
    tarjetas?.color?.primario ||
    datosGenerales?.color?.primario ||
    "#FF9800";
  const colorTipografia =
    tarjetas?.tipografiaColor ||
    datosGenerales?.colorTipografiaAgencia ||
    "#fff";

  const normalizeCurrency = (v?: string | null): string => {
    const s = (v ?? "").toString().trim().toUpperCase();
    if (!s) return "USD";
    if (s.includes("ARS") || s.includes("PESO")) return "ARS";
    if (
      s.includes("USD") ||
      s.includes("DOLAR") ||
      s.includes("DÓLAR") ||
      s.includes("U$D") ||
      s.includes("US$")
    )
      return "USD";
    if (/^[A-Z]{3}$/.test(s)) return s;
    return "USD";
  };

  const currency = normalizeCurrency(divisa);

  const formatNumber0 = (n: number | null | undefined): string => {
    const value =
      typeof n === "number" && Number.isFinite(n) ? Math.round(n) : 0;
    return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(
      value
    );
  };

  const displayAmount = (n: number | null | undefined): string => {
    const amount = formatNumber0(n);
    if (currency === "ARS") return `$ ${amount}`;
    if (currency === "USD") return `USD ${amount}`;
    return `${currency} ${amount}`;
  };

  const mostrarConsultar = !total || total === "";

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: colorPrimario,
        pt: 4,
        px: 3,
        pb: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        borderRadius: 1,
        boxShadow: 4,
        flexGrow: 1,
      }}
    >
      {cargando ? (
        <>
          <Skeleton width="80%" height={25} />
          <Skeleton width="60%" height={45} />
          <Skeleton width="70%" height={20} />
          <Skeleton width="50%" height={20} />
          <Skeleton width="80%" height={30} />
          <Skeleton width="60%" height={45} />
        </>
      ) : (
        <>
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ color: colorTipografia, mb: 2 }}
            >
              Precio Desde
            </Typography>

            {mostrarConsultar ? (
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ color: colorTipografia }}
              >
                Consultar
              </Typography>
            ) : (
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ color: colorTipografia }}
              >
                {total}
              </Typography>
            )}
          </Box>

          {/* 🗺️ Mapa agregado justo antes del botón */}
       

          {/* Botón WhatsApp */}
          <Box sx={{ mt: 3, width: "100%" }}>
            <BotonConsultar paquete={wp} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default TarifaPaquete;

import { FunctionComponent } from "react";
import { Stack, Typography, Box } from "@mui/material";
import { useFooter, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";

interface IzquierdaArribaProps {
  logo: string | null;
}

const IzquierdaArriba: FunctionComponent<IzquierdaArribaProps> = ({ logo }) => {
  const footer = useFooter();
  const datosGenerales = useDatosGenerales();

  const tipografia =
    footer?.tipografia || datosGenerales?.tipografiaAgencia || "inherit";
  const textoColor =
    footer?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#FFFFFF";
  const textoFooter =
    footer?.texto || "© 2025 Citrus Energía - Todos los derechos reservados";

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems="center"
      justifyContent={{ xs: "center", sm: "flex-start" }}
      sx={{
        width: "100%",
        m: 0,
        px: { xs: 0, sm: 0, md: 0 },
        py: { xs: 1, sm: 1, md: 0 },
        backgroundColor: "transparent",
        textAlign: { xs: "center", sm: "left" },
      }}
    >
      {logo && (
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: { xs: "50vw", sm: "35vw", md: "250px", lg: "300px" },
            maxWidth: "100%",
            maxHeight: 180,
            objectFit: "contain",
            mx: { xs: "auto", sm: 0 },
            mb: { xs: 2, sm: 0 },
            display: "block",
          }}
        />
      )}

      <Typography
        variant="body2"
        sx={{
          color: textoColor,
          fontFamily: tipografia,
          lineHeight: 1.6,
          fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
        }}
      >
        {textoFooter}
      </Typography>
    </Stack>
  );
};

export default IzquierdaArriba;

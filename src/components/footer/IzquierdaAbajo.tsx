import { FunctionComponent } from "react";
import { Stack, Typography } from "@mui/material";
import { useFooter, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";

interface IzquierdaAbajoProps {
  year: number;
}

const IzquierdaAbajo: FunctionComponent<IzquierdaAbajoProps> = ({ year }) => {
  const footer = useFooter();
  const datosGenerales = useDatosGenerales();

  const tipografia =
    footer?.tipografia || datosGenerales?.tipografiaAgencia || "inherit";
  const textoColor =
    footer?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#FFFFFF";

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent={{ xs: "center", sm: "flex-start" }}
      alignItems="center"
      width="100%"
      textAlign={{ xs: "center", sm: "left" }}
      spacing={1}
      sx={{
        px: { xs: 0, sm: 0, md: 0 },
        py: { xs: 1, sm: 1, md: 0 },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: textoColor,
          fontFamily: tipografia,
          fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
        }}
      >
        © {year} — Todos los derechos reservados.
      </Typography>
    </Stack>
  );
};

export default IzquierdaAbajo;

import { FunctionComponent } from "react";
import { Stack, Box } from "@mui/material";
import { useFooter, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
//import MapaFooter from "./MapaFooter";

const DerechaArriba: FunctionComponent = () => {
  const footer = useFooter();
  const datosGenerales = useDatosGenerales();

  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        py: { xs: 2, md: 3 },
        px: { xs: 0, md: 0 },
        display: "flex",
        justifyContent: { xs: "center", md: "flex-end" },
        alignItems: "center",
        width: "100%",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 4, md: 6 }}
        alignItems={{ xs: "center", md: "flex-start" }}
        justifyContent={{ xs: "center", md: "flex-end" }}
        textAlign={{ xs: "center", md: "right" }}
        width="100%"
        maxWidth="1200px"
      >
    

        {/* Redes sociales */}
        <Stack
          direction={{ xs: "row", md: "column" }}
          spacing={1}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
           <Stack direction="row"  alignItems="center" justifyContent="center">
              </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DerechaArriba;

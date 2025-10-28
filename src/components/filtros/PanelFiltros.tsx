import { Box } from "@mui/material";
import { useTarjetas } from "../../contextos/agencia/DatosAgenciaContext";
import { useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";

import FiltroBusqueda from "./FiltroBusqueda";
import BotonFiltros from "./BotonFiltros";
import BotonEliminarFiltros from "./BotonEliminarFiltros";
import OrdenarPaquetes from "./OrdenarPaquetes";

const PanelFiltros = () => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();

  const colorTexto =
    tarjetas?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#fff";
  const tipografia =
    tarjetas?.tipografia || datosGenerales?.tipografiaAgencia || "Verdana, sans-serif";
  const fondo = tarjetas?.color?.terciario|| datosGenerales?.color?.secundario || "rgba(255,255,255,0.05)";

  return (
    <Box
      sx={{
        //backgroundColor: fondo,
        backgroundColor:"#197c84",
        backdropFilter: "blur(12px)",
        borderRadius: 1,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        color: colorTexto,
        fontFamily: tipografia,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "98%",
        p: { xs: 0.5, sm: 1, md: 2 },
        mx: "auto",
        my: 0,
        gap: { xs: 1.5, sm: 2, md: 3 },
      }}
    >
      <FiltroBusqueda />
      <OrdenarPaquetes />
      <BotonFiltros />
      <BotonEliminarFiltros />
    </Box>
  );
};

export default PanelFiltros;

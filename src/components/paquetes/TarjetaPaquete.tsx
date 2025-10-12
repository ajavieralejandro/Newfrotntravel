import React, { useState, useMemo } from "react";
import { Card, Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import ImagenPaquete from "./ImagenPaquete";
import InfoPaquete from "./InfoPaquete";
import TarifaPaquete from "./TarifaPaquete";
import TabsPaquete from "./TabsPaquete";
import ExpansionContainer from "./ExpansionContainer";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import HotelesContent from "./HotelesContent";
import DescripcionContent from "./DescripcionContent";
import SalidasContent from "./SalidasContent";
import TransporteContent from "./TransporteContent";
import type { PaqueteData } from "../../interfaces/PaqueteData";
import type { Salida } from "../../interfaces/Salida";
import type { Hotel } from "../../interfaces/Hotel";

type TarjetaPaqueteProps = {
  paquete: PaqueteData;
  cargando?: boolean;
};

const toNum = (v: number | string | null | undefined): number => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return isFinite(v) ? v : 0;
  const n = Number(String(v).replace(",", "."));
  return isNaN(n) ? 0 : n;
};

const derivarTipoTransporte = (
  t: string | null | undefined
): "avion" | "bus" | "sin_transporte" => {
  if (!t) return "sin_transporte";
  const s = t.toLowerCase();
  if (s.includes("aéreo") || s.includes("aereo") || s.includes("avion") || s.includes("avión")) return "avion";
  if (s.includes("bus") || s.includes("ómnibus") || s.includes("omnibus") || s.includes("micro")) return "bus";
  return "sin_transporte";
};

const TarjetaPaquete: React.FC<TarjetaPaqueteProps> = ({ paquete, cargando = false }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();
  const colorFondo = tarjetas?.color?.secundario || datosGenerales?.color?.secundario || "#f5f5f5";

  const [selectedTab, setSelectedTab] = useState<number | null>(null);
  const [expansionOpen, setExpansionOpen] = useState<boolean>(false);

  const handleTabChange = (tabIndex: number, open: boolean) => {
    setSelectedTab(tabIndex);
    setExpansionOpen(open);
  };

  // 🔹 Normalizar hoteles a array SOLO para render
  const hoteles: Hotel[] = Array.isArray(paquete.hotel)
    ? (paquete.hotel as Hotel[])
    : paquete.hotel
    ? [paquete.hotel as Hotel]
    : [];

  // 🔹 Derivados del paquete
  const {
    fechaSalida,
    duracion,
    destinos,
    regimen,
    imagen,
    salidaBase,
    tarifaBase,
    impuestosBase,
    totalBase,
    tiposTransporteUnicos,
    tipoTransporteDerivado,
  } = useMemo(() => {
    const _salidaBase: Salida | undefined = paquete.salidas?.[0];
    const _fechaSalida = _salidaBase?.fecha_viaje || "Fecha no disponible";

    // ✅ Duración robusta: "Consultar" si no hay noches; "Full day / sin alojamiento" si 0
    const noches = paquete.cant_noches as number | null | undefined;
    let _duracion: string;
    if (noches === 0) {
      _duracion = "Full day / sin alojamiento";
    } else if (noches == null || Number.isNaN(noches)) {
      _duracion = "Consultar";
    } else {
      _duracion = `${noches} noche${noches === 1 ? "" : "s"}`;
    }

    const _destinos = [paquete.ciudad, paquete.pais].filter(Boolean).join(", ") || "Destino no disponible";
    const _regimen = "Según Itinerario";
    const _imagen = paquete.imagen_principal || "/imagenes/default-image.jpg";

    const _tarifa = toNum(_salidaBase?.doble_precio);
    const _impuestos = toNum(_salidaBase?.doble_impuesto);
    const _total = _tarifa + _impuestos;

    const deSalidas = (paquete.salidas ?? [])
      .map((s) => s?.tipo_transporte)
      .filter(Boolean) as Array<"avion" | "bus" | "sin_transporte">;

    const derivado = derivarTipoTransporte(paquete.transporte);
    const unicos = Array.from(new Set([...(deSalidas || []), derivado])).filter(Boolean);

    return {
      fechaSalida: _fechaSalida,
      duracion: _duracion,
      destinos: _destinos,
      regimen: _regimen,
      imagen: _imagen,
      salidaBase: _salidaBase,
      tarifaBase: _tarifa,
      impuestosBase: _impuestos,
      totalBase: _total,
      tiposTransporteUnicos: unicos,
      tipoTransporteDerivado: derivado,
    };
  }, [paquete]);

  const imagenBlock = <ImagenPaquete imagen={imagen} cargando={cargando} />;

  const infoBlock = (
    <InfoPaquete
      idPaquete={paquete.id}
      titulo={paquete.titulo || "Título no disponible"}
      fechaSalida={fechaSalida}
      duracion={duracion}
      regimen={regimen}
      destinos={destinos}
      cargando={cargando}
    />
  );

  const tarifaBlock = (
    <TarifaPaquete
      tarifa={tarifaBase}
      divisa={paquete.tipo_moneda ?? "USD"}
      impuestos={impuestosBase}
      total={totalBase}
      wp={paquete}
      cargando={cargando}
    />
  );

  const renderExpansionContent = () => {
    switch (selectedTab) {
      case 0:
        return <HotelesContent hotel={hoteles} />;
      case 1:
        return <DescripcionContent descripcion={paquete.descripcion} />;
      case 2:
        return (
          <SalidasContent
            salidas={paquete.salidas}
            fechaSalida={fechaSalida}
            currency={paquete.tipo_moneda ?? "USD"}
            transportePaquete={paquete.transporte ?? null}
          />
        );
      case 3:
        return (
          <TransporteContent
            transporte={paquete.transporte}
            tipoTransporte={salidaBase?.tipo_transporte ?? tipoTransporteDerivado}
            tiposTransporte={tiposTransporteUnicos}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: 4,
        transition: "transform 0.2s ease-in-out",
        "&:hover": { transform: "scale(1.01)", boxShadow: 6 },
        bgcolor: colorFondo,
        width: "100%",
        flexGrow: 1,
        height: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          order: !isDesktop ? 1 : undefined,
        }}
      >
        <TabsPaquete onTabChange={handleTabChange} />
      </Box>

      {isDesktop ? (
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%", flexGrow: 1, height: "auto" }}>
          <Box sx={{ flex: 1.5, display: "flex", height: "100%" }}>{imagenBlock}</Box>
          <Box
            sx={{ flex: 1.5, display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", px: 2 }}
          >
            {infoBlock}
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              px: 2,
              minWidth: "250px",
              flexShrink: 1,
            }}
          >
            {tarifaBlock}
          </Box>
        </Box>
      ) : (
        <Grid container sx={{ order: 2, width: "100%", flexGrow: 1 }}>
          <Grid item xs={12} order={2} sx={{ height: "300px", display: "flex" }}>
            {imagenBlock}
          </Grid>
          <Grid
            item
            xs={12}
            order={3}
            sx={{ px: 2, py: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}
          >
            {infoBlock}
          </Grid>
          <Grid
            item
            xs={12}
            order={4}
            sx={{ px: 2, py: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
          >
            {tarifaBlock}
          </Grid>
        </Grid>
      )}

      <Box sx={{ order: !isDesktop ? 5 : undefined }}>
        <ExpansionContainer open={expansionOpen}>{renderExpansionContent()}</ExpansionContainer>
      </Box>
    </Card>
  );
};

export default TarjetaPaquete;

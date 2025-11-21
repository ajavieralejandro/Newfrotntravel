import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import CampoBusqueda from "./CampoBusqueda";
import CampoFecha from "./campoFecha/CampoFecha";
import CampoNoches from "./campoNoches/CampoNoches";
import CampoPasajeros from "./campoPasajeros/CampoPasajeros";
import { useFormulario } from "../../../../contextos/formulario/FormularioContext";

interface SearchInputsProps {
  pestanaActiva: string;
}

const SearchInputs: React.FC<SearchInputsProps> = ({ pestanaActiva }) => {
  const {
    // vuelos / paquetes
    salida, setSalida,
    destino, setDestino,
    fechaSalidaVuelos, setFechaSalidaVuelos,
    pasajeros, setPasajeros,

    // hoteles
    destinoHotel, setDestinoHotel,
    fechaEntradaHotel, setFechaEntradaHotel,
    fechaSalidaHotel, setFechaSalidaHotel,
    noches, setNoches,

    // UI
    resetFormulario,
  } = useFormulario();

  // Reset al cambiar pestaña
  useEffect(() => {
    resetFormulario();
  }, [pestanaActiva]);

  // ✅ Calcular noches automáticamente
  useEffect(() => {
    if (pestanaActiva !== "hoteles") return;

    if (fechaEntradaHotel && fechaSalidaHotel) {
      const diff = fechaSalidaHotel.diff(fechaEntradaHotel, "day");
      setNoches(diff >= 0 ? diff : 0);
    } else {
      setNoches(null);
    }
  }, [fechaEntradaHotel, fechaSalidaHotel, pestanaActiva]);

  const labelsPorPestana: Record<string, any> = {
    paquetes: { destino: "Destino del paquete", ida: "Fecha de inicio", vuelta: "Fecha de regreso" },
    vuelos: { destino: "Destino del vuelo", ida: "Fecha de ida", vuelta: "Fecha de vuelta" },
    hoteles: { destino: "Ciudad", ida: "Fecha Entrada", vuelta: "Fecha salida" },
    autos: { destino: "Lugar de retiro del auto", ida: "Fecha de retiro", vuelta: "Fecha de devolución" },
    circuitos: { destino: "Destino del circuito", ida: "Fecha de salida", vuelta: "Fecha de regreso" },
  };

  const labels = labelsPorPestana[pestanaActiva];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box sx={{ p: { xs: 1, sm: 2 }, borderRadius: "6px" }}>
        <Grid container spacing={{ xs: 1, sm: 2, md: 4 }}>
          {pestanaActiva === "hoteles" ? (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <CampoBusqueda label={labels.destino} value={destinoHotel} onChange={setDestinoHotel} />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CampoFecha label={labels.ida} value={fechaEntradaHotel} onChange={setFechaEntradaHotel} />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CampoFecha label={labels.vuelta} value={fechaSalidaHotel} onChange={setFechaSalidaHotel} />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CampoNoches label="Cantidad de noches" value={noches} onChange={setNoches} disabled />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <CampoBusqueda label="Salida" value={salida} onChange={setSalida} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CampoBusqueda label="Destino" value={destino} onChange={setDestino} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CampoFecha label="Fecha de salida" value={fechaSalidaVuelos} onChange={setFechaSalidaVuelos} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CampoPasajeros label="Viajeros" value={pasajeros} onChange={setPasajeros} />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default SearchInputs;

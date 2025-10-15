import React from "react";
import { Box, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CampoBusqueda from "./CampoBusqueda";
import CampoFecha from "./campoFecha/CampoFecha";
import CampoPasajeros from "./campoPasajeros/CampoPasajeros";

// Importación para evitar errores con MUI DatePicker
import type {} from "@mui/x-date-pickers/themeAugmentation";

const SearchInputs: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ backgroundColor: "transparent", p: { xs: 1, sm: 2, md: 2 }, borderRadius: "6px" }}>
        <Grid container spacing={{ xs: 1, sm: 2, md: 12 }} alignItems="left" justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3} sx={{ minWidth: "220px" }}>
            <CampoBusqueda label="salida" />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ minWidth: "220px" }}>
            <CampoBusqueda label="destino" />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ minWidth: "220px" }}>
            <CampoFecha label="Fecha de Salida" />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ minWidth: "220px" }}>
            <CampoPasajeros label="Viajeros" />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default SearchInputs;

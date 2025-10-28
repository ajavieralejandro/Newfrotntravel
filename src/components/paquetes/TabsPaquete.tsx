// TabsPaquete.tsx
import React, { useState } from "react";
import { Box, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";
import { useTarjetas, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";

export interface TabsPaqueteProps {
  onTabChange?: (tabIndex: number, expansionOpen: boolean) => void;
}

const labels = ["Hoteles", "Descripción", "Salidas", "Transporte"];

const TabsPaquete: React.FC<TabsPaqueteProps> = ({ onTabChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Inicialmente, ninguna pestaña seleccionada
  const [tabSeleccionada, setTabSeleccionada] = useState<number | null>(null);
  const [expansionOpen, setExpansionOpen] = useState<boolean>(false);

  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();

  //const colorFondo =
  //  tarjetas?.color?.secundario || datosGenerales?.color?.secundario || "#f5f5f5";
  const colorFondo = "#197c84"

  const colorIndicador =
    tarjetas?.color?.primario || datosGenerales?.color?.primario || "#1976d2";
  const colorTexto =
    tarjetas?.tipografiaColorContenido || datosGenerales?.colorTipografiaAgencia || "#000";

  // ✅ Un único handler: selecciona o togglea si vuelven a tocar la misma tab
  const handleTabsChange = (_: React.SyntheticEvent, newIndex: number) => {
    if (tabSeleccionada === newIndex) {
      const newOpen = !expansionOpen;
      setExpansionOpen(newOpen);
      onTabChange?.(newIndex, newOpen);
    } else {
      setTabSeleccionada(newIndex);
      setExpansionOpen(true);
      onTabChange?.(newIndex, true);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colorFondo,
        p: isMobile ? 0.5 : 1,
        borderRadius: 0,
        boxShadow: 2,
      }}
    >
      <Tabs
        value={tabSeleccionada === null ? false : tabSeleccionada}
        onChange={handleTabsChange}
        textColor="inherit"
        indicatorColor="primary"
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          width: "100%",
          minHeight: isMobile ? 48 : 64,
          "& .MuiTabs-flexContainer": {
            justifyContent: "center",
            gap: isMobile ? 0.5 : 1,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: colorIndicador,
            height: 3,
          },
          "& .MuiTabs-scrollButtons": {
            width: isMobile ? 24 : 32,
          },
        }}
      >
        {labels.map((label, index) => (
          <Tab
            key={index}
            label={label}
            sx={{
              color: colorTexto,
              flex: isMobile ? "none" : 1,
              minWidth: isMobile ? "auto" : undefined,
              padding: isMobile ? "6px 8px" : "12px 16px",
              fontSize: isMobile ? "0.7rem" : isTablet ? "0.8rem" : "0.875rem",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { opacity: 0.8 },
              whiteSpace: "nowrap",
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default TabsPaquete;

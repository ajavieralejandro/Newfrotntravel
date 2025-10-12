import React, { useState, useEffect } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useBuscador, useDatosGenerales } from "../../../../contextos/agencia/DatosAgenciaContext";
import CheckIcon from "@mui/icons-material/Check";

const SelectorPestanas: React.FC = () => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();

  const [pestanaActiva, setPestanaActiva] = useState("paquetes");

  // Variable de configuración para activar/desactivar detección de VaguViajes
  const activarDeteccionVagu = false; // Cambiar a true para forzar comportamiento VaguViajes
  
  const esVaguViajes = activarDeteccionVagu || (typeof window !== "undefined" && window.location.hostname.includes("vaguviajes.tur.ar"));

  if (!datosGenerales) return null;

  // Estilos dinámicos
  const tipografia = buscador?.tipografia || datosGenerales.tipografiaAgencia || "Poppins, sans-serif";
  const colorTexto = buscador?.tipografiaColor || datosGenerales.colorTipografiaAgencia || "black";
  const fondoBase = buscador?.inputFondoColor || buscador?.color?.terciario || "#ffffff";
  const fondoSeleccionado = buscador?.color?.secundario || datosGenerales?.color?.secundario || "#D1E3FF";
  const hoverColorPrimario = buscador?.color?.primario || datosGenerales?.color?.primario || "#0056b3";

  const opciones = [
    { valor: "paquetes", label: "Paquetes" },
    { valor: "vuelos", label: "Vuelos" },
    { valor: "hoteles", label: "Hoteles" },
    { valor: "autos", label: "Autos" },
    { valor: "circuitos", label: "Circuitos" },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", overflowX: "auto" }}>
      <ToggleButtonGroup
        value={pestanaActiva}
        exclusive
        onChange={(_, nuevaPestana) => {
          if (nuevaPestana !== null) setPestanaActiva(nuevaPestana);
        }}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          backgroundColor: "transparent",
          gap: "8px",
        }}
      >
        {opciones.map((opcion) => {
          const isSelected = pestanaActiva === opcion.valor;

          const handleClick = () => {
            if (opcion.valor === "circuitos" && esVaguViajes) {
              window.open("https://incomtour.com.ar/whitelabel/?token=5872a6367a276526266e477bd2a9844f", "_blank");
            }
          };

          return (
            <ToggleButton
              key={opcion.valor}
              value={opcion.valor}
              selected={isSelected}
              onClick={opcion.valor === "circuitos" && esVaguViajes ? handleClick : undefined}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: { xs: "100px", sm: "120px" },
                height: "25px", // un poquito más alto
                borderRadius: "30px", // cápsula más redondeada
                backgroundColor: isSelected ? fondoSeleccionado : "#ffffff", // fondo blanco por defecto
                color: isSelected ? colorTexto : "#555555", // gris oscuro si no está seleccionado
                fontFamily: tipografia,
                fontWeight: 550,
                fontSize: "0.875rem", // un poco más grande para legibilidad
                textTransform: "none",
                border: "1px solid",
                borderColor: isSelected ? fondoSeleccionado : "#e0e0e0", // borde sutil
                gap: 1,
                cursor: "pointer",
                boxShadow: "none", // 🔹 sin sombra
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: isSelected ? hoverColorPrimario : "#f5f5f5", // hover sutil
                  transform: "translateY(0)", // sin levitación
                  boxShadow: "none", // 🔹 sin sombra
                },
                "&.Mui-selected": {
                  backgroundColor: fondoSeleccionado,
                  color: colorTexto,
                  borderColor: fondoSeleccionado,
                  boxShadow: "none", // 🔹 sin sombra incluso seleccionado
                },

              }}
            >
              {isSelected && <CheckIcon sx={{ fontSize: "16px" }} />}
              <Typography
                sx={{
                  fontSize: "inherit",
                  fontWeight: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                {opcion.label}
              </Typography>
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
};

export default SelectorPestanas;

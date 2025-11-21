import React, { useState } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useBuscador, useDatosGenerales } from "../../../../contextos/agencia/DatosAgenciaContext";
import CheckIcon from "@mui/icons-material/Check";

interface SelectorPestanasProps {
  onPestanaChange: (pestana: string) => void;
}

const SelectorPestanas: React.FC<SelectorPestanasProps> = ({ onPestanaChange }) => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const [pestanaActiva, setPestanaActiva] = useState(
  localStorage.getItem("pestanaActiva") || "paquetes"
);

  const activarDeteccionVagu = false;
  const esVaguViajes =
    activarDeteccionVagu ||
    (typeof window !== "undefined" &&
      window.location.hostname.includes("vaguviajes.tur.ar"));

  if (!datosGenerales) return null;

  const tipografia = buscador?.tipografia || datosGenerales.tipografiaAgencia || "Poppins, sans-serif";
  const colorTexto = buscador?.tipografiaColor || datosGenerales.colorTipografiaAgencia || "black";
  const fondoSeleccionado = buscador?.color?.secundario || datosGenerales?.color?.secundario || "#D1E3FF";
  const hoverColorPrimario = buscador?.color?.primario || datosGenerales?.color?.primario || "#0056b3";

  const opciones = [
    { valor: "paquetes", label: "Paquetes" },
    { valor: "vuelos", label: "Vuelos" },
    { valor: "hoteles", label: "Hoteles" },
    { valor: "autos", label: "Autos" },
    { valor: "circuitos", label: "Circuitos" },
  ];

  const handleChange = (_: any, nuevaPestana: string | null) => {
    if (nuevaPestana) {
       localStorage.setItem(
      "valoresPrevios","[]"
    );
      setPestanaActiva(nuevaPestana);
      onPestanaChange(nuevaPestana); // 🔹 avisamos al padre
      localStorage.setItem("pestanaActiva", nuevaPestana);
    }
    localStorage.setItem("resultadosBusqueda", "[]");
          window.dispatchEvent(new Event("actualizarPaquetes"));
     // navigate("/paquetes-busqueda");
      //  Reset DESPUÉS de guardar y navegar
   //   resetFormulario();
    console.log("que pestañaaaaaaa : ", nuevaPestana)
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", overflowX: "auto" }}>
      <ToggleButtonGroup
        value={pestanaActiva}
        exclusive
        onChange={handleChange}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {opciones.map((opcion) => {
          const isSelected = pestanaActiva === opcion.valor;

          const handleClick = () => {
            if (opcion.valor === "circuitos" && esVaguViajes) {
              window.open(
                "https://incomtour.com.ar/whitelabel/?token=5872a6367a276526266e477bd2a9844f",
                "_blank"
              );
            }
          };

          return (
            <ToggleButton
              key={opcion.valor}
              value={opcion.valor}
              selected={isSelected}
              onClick={
                opcion.valor === "circuitos" && esVaguViajes ? handleClick : undefined
              }
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: { xs: "100px", sm: "120px" },
                height: "25px",
                borderRadius: "30px",
                backgroundColor: isSelected ? fondoSeleccionado : "#ffffff",
                color: isSelected ? colorTexto : "#555555",
                fontFamily: tipografia,
                fontWeight: 550,
                fontSize: "0.875rem",
                textTransform: "none",
                border: "1px solid",
                borderColor: isSelected ? fondoSeleccionado : "#e0e0e0",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: isSelected ? hoverColorPrimario : "#f5f5f5",
                },
              }}
            >
              {isSelected && <CheckIcon sx={{ fontSize: "16px" }} />}
              <Typography sx={{ fontSize: "inherit", fontWeight: "inherit" }}>
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

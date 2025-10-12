import React from "react";
import { MenuItem, Paper, Popper, Box, List } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface UbicacionIATA {
  codigo: string;
  nombre: string;
}

interface PopperUbicacionesProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  opcionesFiltradas: UbicacionIATA[];
  handleSelect: (ubicacion: UbicacionIATA) => void;
  label: string;
  colorPrimario: string;   // Fondo del header
  tipografia: string;
  colorTerciario?: string; // Hover de items
}

const PopperUbicaciones: React.FC<PopperUbicacionesProps> = ({
  open,
  anchorEl,
  opcionesFiltradas,
  handleSelect,
  label,
  colorPrimario,
  tipografia,
  colorTerciario,
}) => {
  const ancho = anchorEl?.clientWidth || 320;
  const hoverBg = `${(colorTerciario || colorPrimario)}33`; // ~20% alpha

  return (
    <Popper
      open={open && opcionesFiltradas.length > 0}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[{ name: "preventOverflow", options: { boundary: "window" } }]}
      sx={{ zIndex: 9999 }}
    >
      <Paper
        elevation={4}
        sx={{
          mt: 1,
          borderRadius: "12px",
          overflow: "hidden",
          width: ancho,
          maxWidth: "90vw",
          fontFamily: tipografia,
        }}
        role="listbox"
        aria-label={`Opciones para ${label}`}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: colorPrimario,
            color: "white",
            p: 1.5,
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          {label}
        </Box>
        <List disablePadding>
          {opcionesFiltradas.map((ubicacion) => (
            <MenuItem
              key={`${ubicacion.codigo}-${ubicacion.nombre}`}
              onClick={() => handleSelect(ubicacion)}
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                "&:hover": { bgcolor: hoverBg },
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <LocationOnIcon sx={{ color: "text.secondary" }} />
              <Box>
                <Box sx={{ fontWeight: 500 }}>{ubicacion.nombre}</Box>
                <Box sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                  {ubicacion.codigo}
                </Box>
              </Box>
            </MenuItem>
          ))}
        </List>
      </Paper>
    </Popper>
  );
};

export default PopperUbicaciones;

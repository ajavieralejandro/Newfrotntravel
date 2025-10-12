import React from "react";
import { MenuItem, Paper, Popper, Box } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SearchIcon from "@mui/icons-material/Search";

interface PopperOpcionesProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleSelect: (opcion: string) => void;
  colorPrimario: string;
  tipografia: string;
}

const PopperOpciones: React.FC<PopperOpcionesProps> = ({
  open,
  anchorEl,
  handleSelect,
  colorPrimario,
  tipografia,
}) => {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      modifiers={[{ name: "preventOverflow", options: { boundary: "window" } }]}
      sx={{ zIndex: 9999 }}
    >
      <Paper
        sx={{
          mt: 1,
          boxShadow: 3,
          borderRadius: "8px",
          overflow: "hidden",
          minWidth: 180, // 🔹 Ajuste de ancho mínimo para evitar que sea demasiado angosto
          fontFamily: tipografia,
        }}
      >
        {/* 🔹 Encabezado con color dinámico */}
        <Box
          sx={{
            backgroundColor: colorPrimario,
            color: "white",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontFamily: tipografia,
          }}
        >
          Opciones
        </Box>

        {/* 🔹 Opciones dentro del menú */}
        <MenuItem
          onClick={() => handleSelect("consultar")}
          sx={{ padding: "12px 20px", fontSize: "14px", fontFamily: tipografia, display: "flex", alignItems: "center" }}
        >
          <SearchIcon sx={{ marginRight: "10px" }} />
          Consultar
        </MenuItem>

        <MenuItem
          onClick={() => handleSelect("reservar")}
          sx={{ padding: "12px 20px", fontSize: "14px", fontFamily: tipografia, display: "flex", alignItems: "center" }}
        >
          <EventNoteIcon sx={{ marginRight: "10px" }} />
          Reservar
        </MenuItem>

        <MenuItem
          onClick={() => handleSelect("whatsapp")}
          sx={{ padding: "12px 20px", fontSize: "14px", fontFamily: tipografia, display: "flex", alignItems: "center" }}
        >
          <WhatsAppIcon sx={{ marginRight: "10px", color: "#25D366" }} />
          WhatsApp
        </MenuItem>
      </Paper>
    </Popper>
  );
};

export default PopperOpciones;

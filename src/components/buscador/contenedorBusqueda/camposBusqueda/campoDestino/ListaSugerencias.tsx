import React from "react";
import { Card, List, ListItem, ListItemText } from "@mui/material";
import { UbicacionIATA } from "../../../../../data/ubicacionesIATA";
import { useDatosGenerales, useBuscador } from "../../../../../contextos/agencia/DatosAgenciaContext";

interface ListaSugerenciasProps {
  mostrarSugerencias: boolean;
  sugerencias: UbicacionIATA[];
  seleccion: UbicacionIATA | null;
  handleSeleccion: (ubicacion: UbicacionIATA) => void;
  cerrarLista: () => void;
}

const ListaSugerencias: React.FC<ListaSugerenciasProps> = ({
  mostrarSugerencias,
  sugerencias,
  seleccion,
  handleSeleccion,
  cerrarLista,
}) => {
  const datosGenerales = useDatosGenerales();
  const buscador = useBuscador();

  if (!mostrarSugerencias || sugerencias.length === 0) return null;

  const fondoLista =
  buscador?.color?.primario ||
  datosGenerales?.color?.primario ||
  "#FFFFFF";

  const colorTexto =
    buscador?.inputColor ||
    buscador?.tipografiaColor ||
    datosGenerales?.colorTipografiaAgencia ||
    "#000000";

  const colorTerciario =
    buscador?.color?.terciario ||
    datosGenerales?.color?.terciario ||
    "rgba(0,0,0,0.24)";

  const hoverBg = `${colorTerciario}33`;    // ~20% alpha
  const selectedBg = `${colorTerciario}4D`; // ~30% alpha

  const tipografia =
    buscador?.tipografia ||
    datosGenerales?.tipografiaAgencia ||
    "'Poppins', sans-serif";

  return (
    <Card
      sx={{
        maxHeight: 220,
        overflowY: "auto",
        bgcolor: fondoLista,
        borderRadius: "12px",
        p: 1,
        boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
        border: "none", // ✅ sin borde
      }}
      role="listbox"
    >
      <List dense disablePadding>
        {sugerencias.map((ubicacion) => {
          const isSelected = seleccion?.codigo === ubicacion.codigo;
          return (
            <ListItem
              key={ubicacion.codigo}
              onClick={() => {
                handleSeleccion(ubicacion);
                cerrarLista();
              }}
              sx={{
                cursor: "pointer",
                bgcolor: isSelected ? selectedBg : "transparent",
                borderRadius: "10px",
                transition: "background-color 0.2s ease-in-out",
                "&:hover": { backgroundColor: hoverBg },
                px: 1.25,
                py: 0.75,
              }}
              role="option"
              aria-selected={isSelected}
            >
              <ListItemText
                primary={`${ubicacion.nombre} (${ubicacion.codigo})`}
                sx={{
                  color: colorTexto,
                  fontFamily: tipografia,
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
};

export default ListaSugerencias;

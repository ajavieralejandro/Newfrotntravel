import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, ClickAwayListener } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { obtenerUbicaciones } from "../../../../services/comunes/ubicacionesService";
import PopperUbicaciones from "./campoDestino/PopperUbicaciones";
import { useBuscador, useDatosGenerales } from "../../../../contextos/agencia/DatosAgenciaContext";

interface UbicacionIATA {
  codigo: string;
  nombre: string;
}

interface CampoBusquedaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  font?: string;
  textColor?: string;
  underlineColor?: string;
  focusColor?: string;
}

const INPUT_HEIGHT = 36;

const makeInputSx = (text: string, underline: string, focus: string, font: string) => ({
  backgroundColor: "transparent",
  borderRadius: 0,
  fontFamily: font,
  "& .MuiInputBase-root": {
    color: text,
    height: INPUT_HEIGHT,
    alignItems: "center",
    px: 0,
    "&:before": { borderBottom: `2px solid ${underline}` },
    "&:hover:not(.Mui-disabled, .Mui-error):before": { borderBottom: `2px solid ${underline}` },
    "&:after": { borderBottom: `2px solid ${focus}` },
  },
  "& .MuiInputBase-input": {
    height: INPUT_HEIGHT,
    lineHeight: `${INPUT_HEIGHT}px`,
    padding: 0,
    fontSize: "0.95rem",
  },
  "& .MuiFormHelperText-root": {
    minHeight: 18,
    fontSize: "0.72rem",
    marginLeft: 0,
    marginTop: 4,
  },
});

const CampoBusqueda: React.FC<CampoBusquedaProps> = ({
  label,
  value,
  onChange,
  font = "Poppins, sans-serif",
  textColor = "#000",
  underlineColor = "#a73439",
  focusColor = "white",
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [opcionesFiltradas, setOpcionesFiltradas] = useState<UbicacionIATA[]>([]);
  const [localValue, setLocalValue] = useState(value || "");

  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const tipografia =
      buscador?.tipografia || datosGenerales?.tipografiaAgencia || "Verdana, sans-serif";
  const underline = buscador?.color?.primario || datosGenerales?.color?.primario || "#a73439";

  // Mantener valor local sincronizado con prop
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Filtrado de opciones
  useEffect(() => {
    let cancel = false;
    const run = async () => {
      if (!localValue) return setOpcionesFiltradas([]);
      try {
        const opts = await obtenerUbicaciones(localValue);
        if (!cancel) setOpcionesFiltradas(opts || []);
      } catch {
        if (!cancel) setOpcionesFiltradas([]);
      }
    };
    run();
    return () => { cancel = true; };
  }, [localValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  };

  const handleSelect = (u: UbicacionIATA) => {
    const valor = `${u.nombre} (${u.codigo})`;
    setLocalValue(valor);
    onChange(valor);
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box display="flex" flexDirection="column" gap={0.75} width="100%">
        <Box display="flex" alignItems="center" gap={0.75}>
          <LocationOnIcon sx={{ color: underline, fontSize: 20 }} />
          <Typography sx={{ color: textColor, fontWeight: 500, fontFamily: tipografia, fontSize: "1rem" }}>
            {label}
          </Typography>
        </Box>

        <TextField
          fullWidth
          variant="standard"
          placeholder={`Ingresa ${label}`}
          value={localValue}
          onChange={handleChange}
          onFocus={(e) => setAnchorEl(e.currentTarget)}
          size="small"
          sx={makeInputSx(textColor, underline, focusColor, tipografia)}
        />

        <PopperUbicaciones
          open={open}
          anchorEl={anchorEl}
          opcionesFiltradas={opcionesFiltradas}
          handleSelect={handleSelect}
          label={label}
          colorPrimario={underline}
          colorTerciario={focusColor}
          tipografia={tipografia}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default CampoBusqueda;

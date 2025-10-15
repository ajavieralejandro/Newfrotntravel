import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, ClickAwayListener } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useBuscador, useDatosGenerales } from "../../../../contextos/agencia/DatosAgenciaContext";
import { useFormulario } from "../../../../contextos/formulario/FormularioContext";
import { obtenerUbicaciones } from "../../../../services/comunes/ubicacionesService";
import PopperUbicaciones from "./campoDestino/PopperUbicaciones";

interface UbicacionIATA { codigo: string; nombre: string; }
interface CampoBusquedaProps { label: "Ciudad de Salida" | "Ciudad de Destino"; }

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
  "& .MuiInputBase-input::placeholder": { color: text, opacity: 0.65 },
  "& .MuiFormHelperText-root": {
    minHeight: 18,
    fontSize: "0.72rem",
    marginLeft: 0,
    marginTop: 4,
  },
});

const CampoBusqueda: React.FC<CampoBusquedaProps> = ({ label }) => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const { ciudadOrigen, destino, setCiudadOrigen, setDestino, uiValues, setUIValues, errors, validateField } = useFormulario();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [opcionesFiltradas, setOpcionesFiltradas] = useState<UbicacionIATA[]>([]);

  const isOrigin = label === "Ciudad de Salida";
  const displayValue = isOrigin ? uiValues.ciudadOrigenDisplay : uiValues.destinoDisplay;
  const inputValue = displayValue ?? "";
  const fieldError = isOrigin ? errors.ciudadOrigen : errors.destino;

  const text =
    buscador?.inputColor || buscador?.tipografiaColor || datosGenerales?.colorTipografiaAgencia || "#000";
  const font = buscador?.tipografia || datosGenerales?.tipografiaAgencia || "Poppins, sans-serif";
  const underline = buscador?.color?.primario || datosGenerales?.color?.primario || "#a73439";
  const focus = buscador?.color?.terciario || datosGenerales?.color?.terciario || "#e52822";

  // Restaurar una vez
  useEffect(() => {
    const valores = localStorage.getItem("valoresPrevios");
    const yaHayValor = isOrigin ? ciudadOrigen : destino;
    const yaHayDisplay = isOrigin ? uiValues.ciudadOrigenDisplay : uiValues.destinoDisplay;
    if (!yaHayValor && !yaHayDisplay && valores) {
      const { ciudadOrigen: gO, destino: gD } = JSON.parse(valores);
      if (isOrigin && gO) { setCiudadOrigen(gO); setUIValues({ ciudadOrigenDisplay: gO }); }
      else if (!isOrigin && gD) { setDestino(gD); setUIValues({ destinoDisplay: gD }); }
    } else if (yaHayValor && !yaHayDisplay) {
      if (isOrigin) setUIValues({ ciudadOrigenDisplay: yaHayValor });
      else setUIValues({ destinoDisplay: yaHayValor });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrado async correcto
  useEffect(() => {
    let cancel = false;
    const run = async () => {
      if (!inputValue) return setOpcionesFiltradas([]);
      try {
        const opts = await obtenerUbicaciones(inputValue);
        if (!cancel) setOpcionesFiltradas(opts || []);
      } catch { if (!cancel) setOpcionesFiltradas([]); }
    };
    run();
    return () => { cancel = true; };
  }, [inputValue]);

  if (!datosGenerales) return null;

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box display="flex" flexDirection="column" gap={0.75} alignItems="flex-start" width="100%">
        <Box display="flex" alignItems="center" gap={0.75}>
          <LocationOnIcon sx={{ color: underline, fontSize: 20 }} />
          <Typography sx={{ color: "#000", fontWeight: 500, fontFamily: font, fontSize: "1rem" }}>
            {label}
          </Typography>
        </Box>

        <TextField
          fullWidth
          variant="standard"
          placeholder={isOrigin ? "Ingresa Origen" : "Ingresa Destino"}
          value={inputValue}
          error={Boolean(fieldError)}
          helperText={fieldError || " "}
          onChange={(e) => {
            const v = e.target.value;
            if (isOrigin) setUIValues({ ciudadOrigenDisplay: v });
            else setUIValues({ destinoDisplay: v });
          }}
          onFocus={(e) => { setAnchorEl(e.currentTarget); setOpen(true); }}
          onBlur={() => {
            const v = isOrigin ? ciudadOrigen : destino;
            if (v) validateField(isOrigin ? "ciudadOrigen" : "destino", v);
          }}
          size="small"
          sx={makeInputSx(text, underline, focus, font)}
        />

        <PopperUbicaciones
          open={open}
          anchorEl={anchorEl}
          opcionesFiltradas={opcionesFiltradas}
          handleSelect={(u) => {
            const valor = `${u.nombre} (${u.codigo})`;
            if (isOrigin) { setCiudadOrigen(valor); setUIValues({ ciudadOrigenDisplay: valor }); }
            else { setDestino(valor); setUIValues({ destinoDisplay: valor }); }
            setOpen(false);
          }}
          label={label}
          colorPrimario={underline}
          tipografia={font}
          colorTerciario={focus}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default CampoBusqueda;

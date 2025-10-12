import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, ClickAwayListener } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useBuscador, useDatosGenerales } from "../../../../contextos/agencia/DatosAgenciaContext";
import { useFormulario } from "../../../../contextos/formulario/FormularioContext";
import { obtenerUbicaciones } from "../../../../services/comunes/ubicacionesService";
import PopperUbicaciones from "./campoDestino/PopperUbicaciones";

interface UbicacionIATA {
  codigo: string;
  nombre: string;
}

interface CampoBusquedaProps {
  label: "Ciudad de Salida" | "Ciudad de Destino";
}

const CampoBusqueda: React.FC<CampoBusquedaProps> = ({ label }) => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const { 
    ciudadOrigen, 
    destino, 
    setCiudadOrigen, 
    setDestino, 
    uiValues, 
    setUIValues, 
    errors, 
    validateField 
  } = useFormulario();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [opcionesFiltradas, setOpcionesFiltradas] = useState<UbicacionIATA[]>([]);
  
  // Determinar el valor actual del input desde el contexto
  const isOrigin = label === "Ciudad de Salida";
  const currentValue = isOrigin ? ciudadOrigen : destino;
  const displayValue = isOrigin ? uiValues.ciudadOrigenDisplay : uiValues.destinoDisplay;
  const placeholderOrigen = isOrigin ? "Ingresa Origen" : "Ingresa Destino";
  // ✅ Usar solo displayValue, sin fallback que cause auto-restauración
  const inputValue = displayValue;
  const fieldError = isOrigin ? errors.ciudadOrigen : errors.destino;

  // Sincronizar valores desde localStorage solo al montar
  useEffect(() => {
    const valoresGuardados = localStorage.getItem("valoresPrevios");
    const yaHayValor = isOrigin ? ciudadOrigen : destino;
    const yaHayDisplayValue = isOrigin ? uiValues.ciudadOrigenDisplay : uiValues.destinoDisplay;

    // Solo restaurar si no hay valor en contexto NI en display
    if (!yaHayValor && !yaHayDisplayValue && valoresGuardados) {
      const { ciudadOrigen: guardadoOrigen, destino: guardadoDestino } = JSON.parse(valoresGuardados);
      if (isOrigin && guardadoOrigen) {
        setCiudadOrigen(guardadoOrigen);
        setUIValues({ ciudadOrigenDisplay: guardadoOrigen });
      } else if (!isOrigin && guardadoDestino) {
        setDestino(guardadoDestino);
        setUIValues({ destinoDisplay: guardadoDestino });
      }
    } else if (yaHayValor && !yaHayDisplayValue) {
      // Sincronizar display con contexto solo si display está vacío
      if (isOrigin) {
        setUIValues({ ciudadOrigenDisplay: yaHayValor });
      } else {
        setUIValues({ destinoDisplay: yaHayValor });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Sincronizar opciones filtradas cuando cambia el input
  useEffect(() => {
    if (inputValue) {
      setOpcionesFiltradas(obtenerUbicaciones(inputValue));
    } else {
      setOpcionesFiltradas([]);
    }
  }, [inputValue]);


  if (!datosGenerales) return null;

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    
    // Actualizar UI display value
    if (isOrigin) {
      setUIValues({ ciudadOrigenDisplay: value });
    } else {
      setUIValues({ destinoDisplay: value });
    }
    
    // Filtrar opciones
    filtrarOpciones(value);
  };

  const handleSelect = (ubicacion: UbicacionIATA) => {
    const valor = `${ubicacion.nombre} (${ubicacion.codigo})`;
    
    // Actualizar tanto el valor del contexto como el display
    if (isOrigin) {
      setCiudadOrigen(valor);
      setUIValues({ ciudadOrigenDisplay: valor });
    } else {
      setDestino(valor);
      setUIValues({ destinoDisplay: valor });
    }
    
    setOpen(false);
  };

  const filtrarOpciones = async (query: string) => {
    try {
      const opciones = await obtenerUbicaciones(query);
      setOpcionesFiltradas(opciones);
    } catch (error) {
      console.error("Error al filtrar opciones:", error);
    }
  };

  // 🎯 Colores y tipografía
  const fondoColor =
    buscador?.inputFondoColor ||
    buscador?.color?.secundario ||
    datosGenerales?.color?.secundario ||
    "#F5F5F5";

  const tipografiaColorTexto =
    buscador?.inputColor ||
    buscador?.tipografiaColor ||
    datosGenerales?.colorTipografiaAgencia ||
    "#000000";

  const labelColor =
    buscador?.tipografiaColorLabel ||
    buscador?.tipografiaColor ||
    datosGenerales?.colorTipografiaAgencia ||
    "#000000";

  const tipografia =
    buscador?.tipografia || datosGenerales?.tipografiaAgencia || "Poppins, sans-serif";

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box display="flex" flexDirection="column" gap={2} position="relative" alignItems="left">
        <Box display="flex" alignItems="center" gap={2}>
          <LocationOnIcon sx={{ color: "#a73439", fontSize: 24 }} />
          <Typography sx={{ color: "#000", fontWeight: 500, fontFamily: tipografia, fontSize: '1.2rem'}}>
            {label}
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column">
          <TextField
            fullWidth
            variant="standard"
            placeholder = {placeholderOrigen}
            value={inputValue}
            error={Boolean(fieldError)}
            helperText={fieldError}
            sx={{
      backgroundColor: fondoColor,
      borderRadius: "25px",
      fontFamily: tipografia,
      "& .MuiInputBase-root": {
        color: tipografiaColorTexto,
        "&:before": {            
          borderBottom: "2px solid #a73439", // 🔴 rojo por defecto se puede sacar de datos generales
        },
        "&:hover:not(.Mui-disabled, .Mui-error):before": {
          borderBottom: "2px solid #a73439", // 🔴 rojo al hover
        },
        "&:after": {
          borderBottom: "2px solid #e52822", // 🟢 verde al foco
        },
      },
      "& .MuiInputBase-input::placeholder": {
        color: tipografiaColorTexto,
        opacity: 0.7,
      },
      "& .MuiFormHelperText-root": {
        color: "#f44336",
        fontSize: "0.5rem",
        marginLeft: 1,
        marginTop: 0.5,
        border: "none",
      },
    }}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={() => {
              // Validar al perder el foco solo si hay contenido
              const valueToValidate = isOrigin ? ciudadOrigen : destino;
              if (valueToValidate) {
                const error = validateField(isOrigin ? 'ciudadOrigen' : 'destino', valueToValidate);
                if (error) {
                  // El error se maneja automáticamente por el contexto
                }
              }
            }}
            size="small"
          />
        </Box>
        
        <PopperUbicaciones
          open={open}
          anchorEl={anchorEl}
          opcionesFiltradas={opcionesFiltradas}
          handleSelect={handleSelect}
          label={label}
          colorPrimario={buscador?.color?.primario || datosGenerales?.color?.primario || "#1976d2"}
          tipografia={tipografia}
          colorTerciario={buscador?.color?.terciario || datosGenerales?.color?.terciario || undefined}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default CampoBusqueda;

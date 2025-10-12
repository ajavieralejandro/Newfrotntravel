import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";
import { useBuscador, useDatosGenerales } from "../../../../../contextos/agencia/DatosAgenciaContext";
import { useFormulario } from "../../../../../contextos/formulario/FormularioContext";

interface CampoFechaProps {
  label: string;
}

const CampoFecha: React.FC<CampoFechaProps> = ({ label }) => {
  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();
  const { fechaSalida, setFechaSalida, uiValues, setUIValues, errors } = useFormulario();
  
  const fieldError = errors.fechaSalida;

  useEffect(() => {
    if (!fechaSalida) {
      const valoresGuardados = localStorage.getItem("valoresPrevios");
      if (valoresGuardados) {
        const { fechaSalida: fechaGuardada } = JSON.parse(valoresGuardados);
        if (fechaGuardada) {
          const fecha = new Date(fechaGuardada);
          setFechaSalida(fecha);
          setUIValues({ fechaSalidaDisplay: dayjs(fecha).format('DD/MM/YYYY') });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Sincronizar display value cuando cambia fechaSalida - solo si display está vacío
  useEffect(() => {
    const currentDisplay = uiValues.fechaSalidaDisplay;
    
    if (fechaSalida && !currentDisplay) {
      // Solo actualizar display si está vacío y hay fecha en contexto
      setUIValues({ fechaSalidaDisplay: dayjs(fechaSalida).format('DD/MM/YYYY') });
    } else if (!fechaSalida && currentDisplay) {
      // Solo limpiar display si no hay fecha en contexto pero sí hay display
      setUIValues({ fechaSalidaDisplay: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaSalida]);

  if (!datosGenerales) return null;

  // 🎯 Fallbacks: Buscador -> Generales -> defaults
  const fondoInput =
    buscador?.inputFondoColor ||
    buscador?.color?.secundario ||
    datosGenerales?.color?.secundario ||
    "#F5F5F5";

  const colorTexto =
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
    buscador?.tipografia ||
    datosGenerales?.tipografiaAgencia ||
    "Poppins, sans-serif";

  const fechaDayjs = fechaSalida ? dayjs(fechaSalida) : null;

  const handleChangeFecha = (newValue: dayjs.Dayjs | null) => {
    const fecha = newValue ? newValue.toDate() : null;
    setFechaSalida(fecha);
    
    // Actualizar display value
    if (fecha) {
      setUIValues({ fechaSalidaDisplay: dayjs(fecha).format('DD/MM/YYYY') });
    } else {
      setUIValues({ fechaSalidaDisplay: '' });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={0} position="relative" alignItems={"left"}>
      <Box display="flex" alignItems={"left"} gap={2}>
        <EventIcon sx={{ color: "#a73439", fontSize: 24 }} />
        <Typography sx={{ color: "#000", fontWeight: 500, fontFamily: tipografia, fontSize: '1.2rem' }}>
          {label}
        </Typography>
      </Box>

      <Box display="flex">
        <DesktopDatePicker
    format="DD/MM/YYYY"
    value={fechaDayjs}
    onChange={handleChangeFecha}
    slotProps={{
      textField: {
        fullWidth: true,
        variant: "standard",
        size: "small",
        error: Boolean(fieldError),
        helperText: fieldError,
        sx: {
          backgroundColor: fondoInput,
          borderRadius: "opx",
          fontFamily: tipografia,
          "& .MuiInputBase-root": {
      //color: colorTextoInput,
      color: "#000",
                "&:before": {
                  borderBottom: "2px solid #a73439", // 🔴 línea roja base sepuede sacar de datos generales
                },
                "&:hover:not(.Mui-disabled, .Mui-error):before": {
                  borderBottom: "2px solid #a73439", // 🔴 línea roja al hover
                },
                "&:after": {
                  borderBottom: "2px solid #e52822", // 🔴 más intensa al foco
                },
    },
    "& input": {
                padding: "8px 10px 8px 14px",
              },
              "& .MuiInputAdornment-root": {
                marginLeft: "-50px",
                marginRight: "6px",
              },
               "& .MuiFormHelperText-root": {
                color: "#f44336",
                fontSize: "0.75rem",
                marginLeft: 1,
                marginTop: 0.5,
              },
              "& .MuiSvgIcon-root": {
                color: colorTexto,
                fontSize: "1.2rem",
              },
        },
      },
    }}
        />
      </Box>
    </Box>
  );
};

export default CampoFecha;

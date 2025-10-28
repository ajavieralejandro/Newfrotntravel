import { useState } from "react";
import { Button, IconButton, Box } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PopperOpciones from "./PopperOpciones";
import ModalConsultar from "./ModalConsultar";
import ModalReservar from "./ModalReservar";
import { useTarjetas, useFooter, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import { PaqueteData } from "../../interfaces/PaqueteData";

interface BotonConsultarProps {
  tipografia?: string;
  paquete?: PaqueteData;
}

const BotonConsultar = ({ tipografia = "Arial", paquete }: BotonConsultarProps) => {
  const tarjeta = useTarjetas();
  const footer = useFooter();
  const datosGenerales = useDatosGenerales();

  const colorPrimario = tarjeta?.color?.primario || "#1976d2";
  const colorSecundario = tarjeta?.color?.secundario || "#FBC02D";
  const colorFlechaHover = colorSecundario;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string>("WhatsApp");
  const [openModalConsultar, setOpenModalConsultar] = useState(false);
  const [openModalReservar, setOpenModalReservar] = useState(false);

  const openPopper = Boolean(anchorEl);

  const handleSelect = (opcion: string) => {
    setOpcionSeleccionada(opcion);
    setAnchorEl(null);
  };

  const handleClickBoton = (e: React.MouseEvent) => {
    e.stopPropagation();
    const opcion = opcionSeleccionada.toLowerCase();

    if (opcion === "whatsapp") {
      const nombrePaquete = paquete?.titulo;
      const operador = paquete?.usuario;

      const mensaje = `Me gustaría conocer más acerca del paquete “${nombrePaquete}” ofrecido a través de ${operador}.`;
      const encodedMessage = encodeURIComponent(mensaje);

      var numeroWhatsapp = footer?.redes?.whatsapp?.replace(/[^0-9]/g, '');
      if (numeroWhatsapp === undefined) {numeroWhatsapp = "541165371805"}
      if (numeroWhatsapp) {
        window.open(`https://wa.me/${numeroWhatsapp}?text=${encodedMessage}`, "_blank");
      } else {
        console.warn("Número de WhatsApp no disponible en footer.redes.whatsapp");
      }
    } else if (opcion === "consultar") {
      setOpenModalConsultar(true);
    } else if (opcion === "reservar") {
      setOpenModalReservar(true);
    }
  };

  const tipo = opcionSeleccionada.toLowerCase();
  const esWhatsApp = tipo === "whatsapp";

  const botonColor = esWhatsApp ? "#25D366" : "#fff";
  const textoColor = esWhatsApp ? "#fff" : colorPrimario;

  const idAgencia = datosGenerales?.idAgencia ?? 0;
  const idPaquete = paquete?.id ?? 0;

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Button
        variant="contained"
        onClick={handleClickBoton}
        sx={{
          backgroundColor: botonColor,
          color: textoColor,
          fontWeight: "bold",
          borderRadius: 3,
          width: "100%",
          py: 1.2,
          fontSize: "1rem",
          position: "relative",
          boxShadow: esWhatsApp ? "inset 0 0 0 3px white" : "none",
          transition: "all 0.3s ease-in-out",
          "&:hover": esWhatsApp
            ? {
                backgroundColor: "#fff",
                color: "#25D366",
                boxShadow: "inset 0 0 0 3px #25D366",
              }
            : {
                filter: "brightness(0.85)", // 🔹 Atenuación solo si no es WhatsApp
              },
        }}
      >
        {esWhatsApp ? (
          <Box
            component={WhatsAppIcon}
            sx={{
              color: "#fff",
              transition: "color 0.3s ease-in-out",
              [`button:hover &`]: {
                color: "#25D366",
              },
            }}
          />
        ) : (
          opcionSeleccionada
        )}
      </Button>

      <IconButton
        onClick={(e) => setAnchorEl(openPopper ? null : e.currentTarget)}
        sx={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: colorPrimario,
          color: "#fff",
          width: 32,
          height: 32,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: colorFlechaHover,
            opacity: 1,
            boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <KeyboardArrowDownIcon />
      </IconButton>

      <PopperOpciones
        open={openPopper}
        anchorEl={anchorEl}
        handleSelect={handleSelect}
        colorPrimario={colorPrimario}
        tipografia={tipografia}
      />

      <ModalConsultar
        open={openModalConsultar}
        onClose={() => setOpenModalConsultar(false)}
        colorPrimario={colorPrimario}
        tipografia={tipografia}
        idAgencia={idAgencia}
        idPaquete={idPaquete}
      />

      <ModalReservar
        open={openModalReservar}
        onClose={() => setOpenModalReservar(false)}
        colorPrimario={colorPrimario}
        tipografia={tipografia}
        idAgencia={idAgencia}
        idPaquete={idPaquete}
/>

    </Box>
  );
};

export default BotonConsultar;

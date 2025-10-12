import { Button, Box } from "@mui/material";
import { useFooter } from "../../contextos/agencia/DatosAgenciaContext";
import { FC, useState } from "react";
import ModalBotonAnimado from "./ModalBotonAnimado";

const BotonAnimado: FC = () => {
  const [open, setOpen] = useState(false);
  const footer = useFooter();

  const textoColor = footer?.tipografiaColor || "#ffffff";
  const bgColor = footer?.color?.terciario || "#000000";
  const font = footer?.tipografia || "inherit";

  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
          overflow: "hidden",
          borderRadius: "100px",
          "&:hover .circle": {
            width: 220,
            height: 220,
            opacity: 1,
          },
          "&:hover .arr-1": {
            right: "-25%",
          },
          "&:hover .arr-2": {
            left: "16px",
          },
          "&:hover .text": {
            transform: "translateX(12px)",
          },
          "&:hover svg": {
            fill: bgColor,
          },
          "&:hover .MuiButton-root": {
            boxShadow: "0 0 0 12px transparent",
            borderRadius: "12px",
            color: bgColor,
          },
          "& .MuiButton-root:active": {
            transform: "scale(0.95)",
            boxShadow: `0 0 0 4px ${textoColor}`,
          },
        }}
      >
        <Button
          disableRipple
          onClick={() => setOpen(true)}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            px: "36px",
            py: "16px",
            border: "4px solid transparent",
            fontSize: "16px",
            backgroundColor: "inherit",
            borderRadius: "100px",
            fontWeight: 600,
            color: textoColor,
            boxShadow: `0 0 0 2px ${textoColor}`,
            overflow: "hidden",
            transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
            fontFamily: font,
          }}
        >
          {/* Flecha izquierda */}
          <Box
            component="svg"
            viewBox="0 0 24 24"
            className="arr-2"
            sx={{
              position: "absolute",
              left: "-25%",
              width: 24,
              fill: textoColor,
              zIndex: 9,
              transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
          </Box>

          {/* Texto */}
          <Box
            className="text"
            sx={{
              position: "relative",
              zIndex: 1,
              transform: "translateX(-12px)",
              transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            ¡Contactanos!
          </Box>

          {/* Círculo animado */}
          <Box
            className="circle"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 20,
              height: 20,
              backgroundColor: textoColor,
              borderRadius: "50%",
              opacity: 0,
              transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
              zIndex: 0,
            }}
          />

          {/* Flecha derecha */}
          <Box
            component="svg"
            viewBox="0 0 24 24"
            className="arr-1"
            sx={{
              position: "absolute",
              right: "16px",
              width: 24,
              fill: textoColor,
              zIndex: 9,
              transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
          </Box>
        </Button>
      </Box>

      {/* Nuevo modal especial para este botón */}
      <ModalBotonAnimado open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default BotonAnimado;

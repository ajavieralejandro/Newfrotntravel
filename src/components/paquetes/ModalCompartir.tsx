import React, { useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Stack,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";

import {
  FacebookShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";

import { useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import { generarUrlCompartir } from "../../utils/compartir/generarUrlCompartir";

interface ModalCompartirProps {
  open: boolean;
  onClose: () => void;
  paqueteId: string | number;
}

const ModalCompartir: React.FC<ModalCompartirProps> = ({ open, onClose, paqueteId }) => {
  const datosGenerales = useDatosGenerales();
  const url = generarUrlCompartir(paqueteId, datosGenerales?.dominio, datosGenerales?.url);

  useEffect(() => {
    if (open && typeof navigator.share === "function") {
      navigator
        .share({
          title: "Mirá este paquete de viaje",
          text: "¡Encontré este paquete en Travel Connect!",
          url,
        })
        .then(() => {
          console.log("Compartido con éxito");
          onClose();
        })
        .catch(() => {
          // el usuario canceló o falló → se muestra modal tradicional
        });
    }
  }, [open, url, onClose]);

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("¡Enlace copiado al portapapeles!");
    } catch {
      alert("No se pudo copiar el enlace");
    }
  };

  // No renderizamos el modal si navigator.share fue usado
  if (typeof navigator.share === "function") return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxWidth: 400,
          mx: "auto",
          mt: "15vh",
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={2}>
          Compartir paquete
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <TextField
            value={url}
            fullWidth
            size="small"
            InputProps={{
              readOnly: true,
            }}
          />
          <IconButton onClick={copiarEnlace}>
            <ContentCopyIcon />
          </IconButton>
        </Stack>

        <Typography variant="body2" mb={1}>
          También podés compartir en redes:
        </Typography>

        <Stack direction="row" spacing={2}>
          <FacebookShareButton url={url}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <WhatsappShareButton url={url}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <EmailShareButton url={url}>
            <EmailIcon size={32} round />
          </EmailShareButton>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalCompartir;

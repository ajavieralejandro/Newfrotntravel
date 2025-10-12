import {
  Box,
  Modal,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useBuscador, useDatosGenerales } from "../../../../../contextos/agencia/DatosAgenciaContext";

interface ModalViajerosProps {
  open: boolean;
  onClose: () => void;
  onAplicar: (adultos: number, menores: number) => void;
}

const ModalViajeros = ({ open, onClose, onAplicar }: ModalViajerosProps) => {
  const [adultos, setAdultos] = useState(1);
  const [menores, setMenores] = useState(0);

  const buscador = useBuscador();
  const datosGenerales = useDatosGenerales();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tipografia =
    buscador?.tipografia || datosGenerales?.tipografiaAgencia || "Verdana, sans-serif";
  const colorPrimario =
    buscador?.color?.primario || datosGenerales?.color?.primario || "#1976d2";

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#fff",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
          width: isMobile ? "90%" : 400,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontFamily: tipografia, fontWeight: "bold" }}>
            Seleccionar viajeros
          </Typography>
          <IconButton onClick={onClose} sx={{ color: colorPrimario }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box display="flex" flexDirection="column" gap={3}>
          <FormControl fullWidth>
            <InputLabel>Adultos</InputLabel>
            <Select
              value={adultos}
              onChange={(e) => setAdultos(Number(e.target.value))}
              label="Adultos"
            >
              {[...Array(10)].map((_, i) => (
                <MenuItem key={i} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Menores</InputLabel>
            <Select
              value={menores}
              onChange={(e) => setMenores(Number(e.target.value))}
              label="Menores"
            >
              {[...Array(10)].map((_, i) => (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: colorPrimario,
              fontWeight: "bold",
              fontFamily: tipografia,
              borderRadius: 2,
              py: 1.5,
              "&:hover": {
                backgroundColor: "#0056b3",
              },
            }}
            onClick={() => {
              onAplicar(adultos, menores);
              onClose();
            }}
          >
            Aplicar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalViajeros;

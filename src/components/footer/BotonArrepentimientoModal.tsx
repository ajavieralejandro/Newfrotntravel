import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export interface FormData {
  nombre: string;
  apellido: string;
  movil: string;
  email: string;
  producto: string;
  cantidad: string;
  fechaCompra: string;
  destino: string;
  motivo: string;
}

const BotonArrepentimientoModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState<FormData>({
    nombre: "",
    apellido: "",
    movil: "",
    email: "",
    producto: "",
    cantidad: "",
    fechaCompra: "",
    destino: "",
    motivo: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (!form.email || !form.nombre) {
      alert("Por favor completá al menos tu nombre y email.");
      return;
    }
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
        Botón de Arrepentimiento
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2, fontSize: "0.9rem" }}>
          Envío estas líneas para solicitar el desistimiento de mi compra online dentro de las 24 hs
          de haberla adquirida.
        </Typography>

        <Grid container spacing={1.5}>
          {[
            ["nombre", "Nombre"],
            ["apellido", "Apellido"],
            ["movil", "Móvil"],
            ["email", "Email"],
            ["producto", "Producto comprado"],
            ["cantidad", "Cantidad de pasajeros"],
            ["fechaCompra", "Fecha de compra"],
            ["destino", "Destino"],
            ["motivo", "Motivo del desestimiento"],
          ].map(([key, label]) => (
            <Grid item xs={12} sm={key === "motivo" ? 12 : 6} key={key}>
              <TextField
                fullWidth
                label={label}
                variant="outlined"
                size="small"
                value={(form as any)[key]}
                onChange={(e) => handleChange(key as keyof FormData, e.target.value)}
                multiline={key === "motivo"}
                rows={key === "motivo" ? 3 : 1}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button variant="outlined" sx={{
              color: "#9A9898",
              borderColor: "#9A9898",
              "&:hover": {
                borderColor: "#7d7d7d", // un poco más oscuro en hover
                backgroundColor: "rgba(154, 152, 152, 0.08)", // leve fondo
              },
            }} onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" sx={{ backgroundColor: "#9A9898" }} onClick={handleSubmit}>
          Enviar solicitud
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BotonArrepentimientoModal;

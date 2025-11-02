import { useState } from "react";
import {
  Box, Modal, Typography, TextField, Button, Grid,
  Snackbar, Alert, useMediaQuery, useTheme,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { enviarConsulta } from "../../services/paquetes/consultasYReservasService";
import { ConsultaPayload } from "../../interfaces/ConsultaPayload";

interface ModalConsultarProps {
  open: boolean;
  onClose: () => void;
  colorPrimario: string;
  tipografia: string;
  idAgencia: number;
  idPaquete: number;
}

const ModalConsultar = ({
  open,
  onClose,
  colorPrimario,
  tipografia,
  idAgencia,
  idPaquete,
}: ModalConsultarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [formulario, setFormulario] = useState({
    nombre_apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    pais: "",
    ciudad: "",
    comentarios: "",
  });

  const [errores, setErrores] = useState<Partial<typeof formulario>>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleChange = (campo: keyof typeof formulario, valor: string) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: "" }));
  };

  const validarFormulario = (): boolean => {
  const nuevosErrores: Partial<typeof formulario> = {};

  if (!formulario.nombre_apellido.trim()) {
    nuevosErrores.nombre_apellido = "Campo obligatorio";
  }

  if (!formulario.email.trim()) {
    nuevosErrores.email = "Campo obligatorio";
  } else if (!formulario.email.includes("@") || !formulario.email.includes(".")) {
    nuevosErrores.email = "Email inválido"; // 👈 aquí estaba el typo
  }

  setErrores(nuevosErrores);
  return Object.keys(nuevosErrores).length === 0;
};

  // Mapea errores { "formularioConsulta.email": ["..."] } → { email: "..." }
  const mapearErroresBackend = (errors: Record<string, string[]>) => {
    const nuevos: Partial<typeof formulario> = {};
    Object.entries(errors).forEach(([k, msgs]) => {
      const msg = msgs?.[0] ?? "Campo inválido";
      if (k.startsWith("formularioConsulta.")) {
        const sub = k.replace("formularioConsulta.", "") as keyof typeof formulario;
        nuevos[sub] = msg;
      } else if (k === "agencia_id" || k === "paquete_id") {
        setAlert({ type: "error", msg });
      }
    });
    setErrores(nuevos);
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    const payload: ConsultaPayload = {
      agencia_id: idAgencia,
      paquete_id: idPaquete,
      formularioConsulta: { ...formulario },
    };

    setLoading(true);
    const res = await enviarConsulta(payload);
    setLoading(false);

    if (res.success) {
      setAlert({ type: "success", msg: res.data?.message || "Formulario enviado correctamente" });
      setFormulario({
        nombre_apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        pais: "",
        ciudad: "",
        comentarios: "",
      });
      setErrores({});
      onClose();
    } else {
      const errorMsg = res.data?.message || res.error || "Error al enviar consulta";
      setAlert({ type: "error", msg: errorMsg });
      if (res.status === 422 && res.data?.errors) {
        mapearErroresBackend(res.data.errors);
      }
    }
  };

  return (
    <>
      <Modal open={open} onClose={loading ? undefined : onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95%" : isTablet ? "90%" : 600,
            bgcolor: "white",
            boxShadow: 24,
            borderRadius: isMobile ? "20px" : "35px",
          }}
        >
          <Box
            sx={{
              backgroundColor: colorPrimario,
              color: "white",
              padding: isMobile ? "12px" : "15px",
              textAlign: "center",
              fontFamily: tipografia,
              fontSize: isMobile ? "1rem" : "1.2rem",
              fontWeight: "bold",
            }}
          >
            Déjenos su información de contacto
          </Box>

          <Box sx={{ padding: isMobile ? "15px" : "20px" }}>
            <Grid container spacing={isMobile ? 1 : 2}>
              {[
                { label: "Nombre y Apellido", key: "nombre_apellido" },
                { label: "E-mail", key: "email" },
                { label: "Teléfono", key: "telefono" },
                { label: "Dirección", key: "direccion" },
                { label: "País", key: "pais" },
                { label: "Ciudad", key: "ciudad" },
              ].map(({ label, key }) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography fontWeight="bold">{label}</Typography>
                  <TextField
                    fullWidth
                    value={formulario[key as keyof typeof formulario]}
                    onChange={(e) => handleChange(key as keyof typeof formulario, e.target.value)}
                    error={!!errores[key as keyof typeof errores]}
                    helperText={errores[key as keyof typeof errores]}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Typography fontWeight="bold">Comentarios</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={isMobile ? 2 : 3}
                  value={formulario.comentarios}
                  onChange={(e) => handleChange("comentarios", e.target.value)}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                type="button" // ✅ importante: evita submit por defecto (y un GET)
                variant="contained"
                disabled={loading}
                onClick={handleSubmit}
                sx={{
                  backgroundColor: colorPrimario,
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: tipografia,
                  borderRadius: "8px",
                }}
              >
                {loading ? "Enviando..." : "CONSULTAR"} <EmailIcon sx={{ ml: 1 }} />
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {alert && (
        <Snackbar open autoHideDuration={4000} onClose={() => setAlert(null)}>
          <Alert severity={alert.type}>{alert.msg}</Alert>
        </Snackbar>
      )}
    </>
  );
};

export default ModalConsultar;

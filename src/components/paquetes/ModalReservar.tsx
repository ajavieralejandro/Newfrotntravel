import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs, { Dayjs } from "dayjs";

import { crearReserva } from "../../services/paquetes/consultasYReservasService";
import { ReservaPayload } from "../../interfaces/ReservaPayload";
import { Pasajero } from "../../interfaces/Pasajero";

interface ModalReservarProps {
  open: boolean;
  onClose: () => void;
  colorPrimario: string;
  tipografia: string;
  idAgencia: number;
  idPaquete: number;
}

type Contacto = { email: string; telefono: string };
type PasajeroUI = Omit<Pasajero, "fecha_nacimiento"> & { fecha_nacimiento: string };

const ModalReservar = ({
  open,
  onClose,
  colorPrimario,
  tipografia,
  idAgencia,
  idPaquete,
}: ModalReservarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [cantidadPasajeros, setCantidadPasajeros] = useState(1);
  const [indicePasajero, setIndicePasajero] = useState(0);
  const [pasajeros, setPasajeros] = useState<PasajeroUI[]>([]);
  const [contacto, setContacto] = useState<Contacto>({ email: "", telefono: "" });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Errores por campo
  const [erroresContacto, setErroresContacto] = useState<Partial<Contacto>>({});
  const [erroresPasajeros, setErroresPasajeros] = useState<Array<Partial<PasajeroUI>>>([]);

  // Reset al abrir
  useEffect(() => {
    if (open) {
      setCantidadPasajeros(1);
      setIndicePasajero(0);
      setPasajeros([
        { nombre: "", apellido: "", email: "", telefono: "", pasaporte: "", fecha_nacimiento: "" },
      ]);
      setContacto({ email: "", telefono: "" });
      setErroresContacto({});
      setErroresPasajeros([{}]);
      setLoading(false);
      setAlert(null);
    }
  }, [open]);

  // Helpers de cambios
  const handleContacto = (campo: keyof Contacto, valor: string) => {
    setContacto((p) => ({ ...p, [campo]: valor }));
    setErroresContacto((e) => ({ ...e, [campo]: "" }));
  };

  const handlePasajero = (campo: keyof PasajeroUI, valor: string) => {
    setPasajeros((prev) => {
      const copia = [...prev];
      copia[indicePasajero] = { ...copia[indicePasajero], [campo]: valor };
      return copia;
    });
    setErroresPasajeros((prev) => {
      const copia = [...prev];
      copia[indicePasajero] = { ...(copia[indicePasajero] || {}), [campo]: "" };
      return copia;
    });
  };

  // Ajuste de cantidad
  const onChangeCantidad = (nuevaCantidad: number) => {
    setCantidadPasajeros(nuevaCantidad);
    setPasajeros((prev) => {
      const nueva = [...prev];
      while (nueva.length < nuevaCantidad) {
        nueva.push({ nombre: "", apellido: "", email: "", telefono: "", pasaporte: "", fecha_nacimiento: "" });
      }
      return nueva.slice(0, nuevaCantidad);
    });
    setErroresPasajeros((prev) => {
      const nueva = [...prev];
      while (nueva.length < nuevaCantidad) nueva.push({});
      return nueva.slice(0, nuevaCantidad);
    });
    if (indicePasajero > nuevaCantidad - 1) setIndicePasajero(nuevaCantidad - 1);
  };

  // Validaciones
  const validar = (): boolean => {
    const eContacto: Partial<Contacto> = {};
    if (!contacto.email.trim() || !contacto.email.includes("@") || !contacto.email.includes(".")) {
      eContacto.email = "Email obligatorio y válido";
    }
    // teléfono es opcional (pero si lo completan, que no sea solo espacios)
    if (contacto.telefono && !contacto.telefono.trim()) eContacto.telefono = "Teléfono inválido";

    const ePas: Array<Partial<PasajeroUI>> = pasajeros.map((p) => {
      const e: Partial<PasajeroUI> = {};
      if (!p.nombre.trim()) e.nombre = "Obligatorio";
      if (!p.apellido.trim()) e.apellido = "Obligatorio";
      if (!p.pasaporte.trim()) e.pasaporte = "Obligatorio";
      if (!p.fecha_nacimiento) e.fecha_nacimiento = "Obligatorio";
      return e;
    });

    setErroresContacto(eContacto);
    setErroresPasajeros(ePas);

    const sinErroresPasajeros = ePas.every((e) => Object.keys(e).length === 0);
    const sinErroresContacto = Object.keys(eContacto).length === 0;
    return sinErroresContacto && sinErroresPasajeros;
  };

  // Mapea errores 422 del backend: { "pasajeros.0.nombre": ["El campo nombre..."] }
  const aplicarErroresBackend = (errors: Record<string, string[]>) => {
    const nuevosErroresPas: Array<Partial<PasajeroUI>> = [...erroresPasajeros];
    const nuevosErroresContacto: Partial<Contacto> = { ...erroresContacto };

    Object.entries(errors).forEach(([path, msgs]) => {
      const msg = msgs?.[0] ?? "Campo inválido";
      if (path.startsWith("pasajeros.")) {
        const [, idxStr, campo] = path.split(".");
        const idx = parseInt(idxStr, 10);
        if (!isNaN(idx)) {
          if (!nuevosErroresPas[idx]) nuevosErroresPas[idx] = {};
          
          nuevosErroresPas[idx][campo as keyof PasajeroUI] = msg;
        }
      } else if (path.startsWith("formularioConsulta.")) {
        const campo = path.split(".")[1] as keyof Contacto;
        nuevosErroresContacto[campo] = msg;
      } else if (path === "agencia_id" || path === "paquete_id") {
        // Mensaje general; lo mostramos como alerta
        setAlert({ type: "error", msg });
      }
    });

    setErroresPasajeros(nuevosErroresPas);
    setErroresContacto(nuevosErroresContacto);
  };

  const onConfirmar = async () => {
    if (!validar()) return;

    const payload: ReservaPayload = {
      agencia_id: idAgencia,
      paquete_id: idPaquete,
      formularioConsulta: {
        email: contacto.email.trim(),
        telefono: contacto.telefono?.trim() || undefined,
      },
      pasajeros: pasajeros.map<Pasajero>((p) => ({
        nombre: p.nombre.trim(),
        apellido: p.apellido.trim(),
        pasaporte: p.pasaporte.trim(),
        fecha_nacimiento: p.fecha_nacimiento, // ya guardamos YYYY-MM-DD
        email: p.email?.trim() || undefined,
        telefono: p.telefono?.trim() || undefined,
      })),
    };

    setLoading(true);
    const res = await crearReserva(payload);
    setLoading(false);

    if (res.success) {
      setAlert({ type: "success", msg: res.data?.message || "Reserva creada correctamente" });
      onClose();
    } else {
      const msg = res.data?.message || res.error || "Error al crear la reserva";
      setAlert({ type: "error", msg });
      if (res.status === 422 && res.data?.errors) {
        aplicarErroresBackend(res.data.errors);
      }
    }
  };

  // Render
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
            maxWidth: "100%",
            bgcolor: "white",
            boxShadow: 24,
            borderRadius: isMobile ? "20px" : "35px",
            overflow: "hidden",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Banner */}
          <Box
            sx={{
              backgroundColor: colorPrimario,
              color: "white",
              p: isMobile ? "12px" : "15px",
              textAlign: "center",
              fontFamily: tipografia,
              fontSize: isMobile ? "1.1rem" : isTablet ? "1.3rem" : "1.4rem",
              fontWeight: "bold",
              borderBottom: "4px solid white",
            }}
          >
            Información de contacto y pasajeros
          </Box>

          <Box sx={{ p: isMobile ? "15px" : "20px" }}>
            {/* Contacto */}
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: isMobile ? "0.95rem" : "1.1rem" }}>
              Datos de contacto
            </Typography>
            <Grid container spacing={isMobile ? 1 : 2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={8}>
                <Typography fontWeight="bold">Email *</Typography>
                <TextField
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                  value={contacto.email}
                  onChange={(e) => handleContacto("email", e.target.value)}
                  error={!!erroresContacto.email}
                  helperText={erroresContacto.email}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography fontWeight="bold">Teléfono</Typography>
                <TextField
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                  value={contacto.telefono}
                  onChange={(e) => handleContacto("telefono", e.target.value)}
                  error={!!erroresContacto.telefono}
                  helperText={erroresContacto.telefono}
                />
              </Grid>
            </Grid>

            {/* Cantidad */}
            <Typography variant="h6" fontWeight="bold" sx={{ mt: isMobile ? 1.5 : 2, fontSize: isMobile ? "0.95rem" : "1.1rem" }}>
              Número de pasajeros
            </Typography>
            <TextField
              select
              fullWidth
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              value={cantidadPasajeros}
              onChange={(e) => onChangeCantidad(Number(e.target.value))}
              sx={{ mt: isMobile ? 0.5 : 1, border: "2px solid black" }}
              disabled={loading}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </TextField>

            {/* Pasajero actual */}
            <Box sx={{ mt: isMobile ? 2 : 3, p: isMobile ? 1.5 : 2, border: "2px solid black", borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ textAlign: "center", fontSize: isMobile ? "1rem" : "1.2rem" }}>
                Pasajero {indicePasajero + 1} de {cantidadPasajeros}
              </Typography>

              <Grid container spacing={isMobile ? 1 : 2} sx={{ mt: 1 }}>
                {[
                  { key: "nombre", label: "Nombre *" },
                  { key: "apellido", label: "Apellido *" },
                  { key: "email", label: "Email (opcional)" },
                  { key: "telefono", label: "Teléfono (opcional)" },
                  { key: "pasaporte", label: "Pasaporte *" },
                ].map(({ key, label }) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Typography fontWeight="bold">{label}</Typography>
                    <TextField
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      value={(pasajeros[indicePasajero] as any)?.[key] || ""}
                      onChange={(e) => handlePasajero(key as keyof PasajeroUI, e.target.value)}
                      error={!!(erroresPasajeros[indicePasajero] as any)?.[key]}
                      helperText={(erroresPasajeros[indicePasajero] as any)?.[key]}
                      disabled={loading}
                    />
                  </Grid>
                ))}

                {/* Fecha de nacimiento */}
                <Grid item xs={12} sm={6}>
                  <Typography fontWeight="bold">Fecha de nacimiento *</Typography>
                  <DatePicker
                    value={
                      pasajeros[indicePasajero]?.fecha_nacimiento
                        ? dayjs(pasajeros[indicePasajero].fecha_nacimiento)
                        : null
                    }
                    onChange={(newValue: Dayjs | null) =>
                      handlePasajero("fecha_nacimiento", newValue ? newValue.format("YYYY-MM-DD") : "")
                    }
                    views={["year", "month", "day"]}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: isMobile ? "small" : "medium",
                        error: !!erroresPasajeros[indicePasajero]?.fecha_nacimiento,
                        helperText: erroresPasajeros[indicePasajero]?.fecha_nacimiento,
                      },
                    }}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Navegación pasajeros */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: isMobile ? 1.5 : 2,
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 1 : 0,
              }}
            >
              <Button
                variant="contained"
                disabled={loading || indicePasajero === 0}
                onClick={() => setIndicePasajero((p) => p - 1)}
                sx={{
                  backgroundColor: colorPrimario,
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: tipografia,
                  minWidth: isMobile ? "100%" : 160,
                  py: isMobile ? 1 : 1.2,
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
                <ArrowBackIosIcon sx={{ mr: 1 }} />
                Anterior
              </Button>

              <Button
                variant="contained"
                disabled={loading || indicePasajero === cantidadPasajeros - 1}
                onClick={() => setIndicePasajero((p) => p + 1)}
                sx={{
                  backgroundColor: colorPrimario,
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: tipografia,
                  minWidth: isMobile ? "100%" : 160,
                  py: isMobile ? 1 : 1.2,
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
                Siguiente
                <ArrowForwardIosIcon sx={{ ml: 1 }} />
              </Button>
            </Box>

            {/* Confirmar */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: isMobile ? 2 : 3 }}>
              <Button
                variant="contained"
                onClick={onConfirmar}
                disabled={loading}
                sx={{
                  backgroundColor: colorPrimario,
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: tipografia,
                  minWidth: isMobile ? "100%" : 220,
                  py: isMobile ? 1 : 1.2,
                  borderRadius: "8px",
                  fontSize: isMobile ? "1rem" : "1.2rem",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
                {loading ? "Enviando..." : "Confirmar Reserva"}{" "}
                <CheckCircleIcon sx={{ ml: 1 }} />
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

export default ModalReservar;

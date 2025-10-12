import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Container,
  Grid,
  Fade,
  Grow,
  Slide,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion, AnimatePresence } from "framer-motion";
import {
  useBannerRegistro,
  useDatosGenerales,
} from "../../contextos/agencia/DatosAgenciaContext";
import { registerEmail } from "../../services/agencia/registroEmailService";

const HEIGHT = 44; // altura uniforme para input y botón

const BannerRegistro: React.FC = () => {
  const bannerRegistro = useBannerRegistro();
  const datosGenerales = useDatosGenerales();

  const fondoColor =
    bannerRegistro?.color?.primario ||
    datosGenerales?.color?.primario ||
    "#FF5733";
  const tipografia = datosGenerales?.tipografiaAgencia || "Arial, sans-serif";
  const tipografiaColor =
    bannerRegistro?.tipografiaColor ||
    datosGenerales?.colorTipografiaAgencia ||
    "#FFFFFF";
  const colorSecundario = bannerRegistro?.color?.secundario || "#C70039";

  // 🆔 Obtener agenciaId desde el contexto (admite idAgencia string o agencia_id number)
  const agenciaId = useMemo(() => {
    const raw =
      (datosGenerales as any)?.agencia_id ?? (datosGenerales as any)?.idAgencia;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  }, [datosGenerales]);

  // 📧 Estados locales
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const validarEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim().toLowerCase());

  const handleSubmit = async () => {
    setFieldError(null);

    if (!agenciaId) {
      setFieldError("Agencia no disponible.");
      return;
    }
    if (!validarEmail(email)) {
      setFieldError("Ingresá un email válido.");
      return;
    }

    setLoading(true);
    const res = await registerEmail(agenciaId, email.trim().toLowerCase());
    setLoading(false);

    if (res.type === "success") {
      setEmail("");
      setFieldError(null);
      setShowSuccess(true);
      // Ocultar mensaje de éxito después de 4 segundos
      setTimeout(() => setShowSuccess(false), 4000);
    } else if (res.type === "duplicate") {
      setFieldError("El email ya está registrado para esta agencia.");
    } else if (res.type === "validation") {
      setFieldError(res.fieldErrors?.[0] || "Email inválido.");
    } else {
      setFieldError(res.message || "No se pudo registrar el email.");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        backgroundColor: fondoColor,
        py: { xs: 5, sm: 6, md: 8 },
        px: 0,
        display: "flex",
        justifyContent: "center",
        overflowX: "hidden", // evita scroll lateral por 100vw
      }}
    >
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, sm: 4 } }}>
        <Grid
          container
          spacing={{ xs: 4, sm: 5 }}
          alignItems="center"
          justifyContent={{ xs: "center", md: "center", lg: "space-between" }}
          textAlign={{ xs: "center", md: "center", lg: "left" }}
        >
          {/* 🔥 Título */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "center", lg: "flex-start" },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: tipografiaColor,
                  fontFamily: tipografia,
                  fontSize: {
                    xs: "1.6rem",
                    sm: "2rem",
                    md: "2rem",
                    lg: "2rem",
                  },
                  lineHeight: 1.3,
                  maxWidth: "600px",
                }}
              >
                {bannerRegistro?.titulo || "Registrate por Ofertas Exclusivas"}
              </Typography>
            </Box>
          </Grid>

          {/* 🔥 Input + Botón */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: { xs: "center", md: "center", lg: "flex-end" },
                gap: { xs: 2, sm: 2.5 },
                width: "100%",
                maxWidth: "100%",
              }}
            >
              {/* Campo de email */}
              <Box sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { sm: 320 } }}>
                <TextField
                  fullWidth
                  placeholder="Ingrese su email aquí"
                  variant="outlined"
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) handleSubmit();
                  }}
                  // no usamos helperText para no desalinear
                  error={Boolean(fieldError)}
                  inputProps={{ "aria-label": "Email" }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: "999px",
                      color: "#333",
                      height: HEIGHT, // altura fija
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colorSecundario,
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: 0, // centrado vertical usando la altura fija
                      height: "100%",
                    },
                    "& .MuiInputAdornment-root": {
                      background: "transparent",
                      padding: 0,
                      margin: 0,
                      marginLeft: 1,
                      "& .MuiSvgIcon-root": {
                        color: "#666",
                        fontSize: 20,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" disablePointerEvents>
                        <EmailIcon />
                      </InputAdornment>
                    ),
                    autoComplete: "email",
                    inputMode: "email",
                  }}
                />
              </Box>

              {/* Botón */}
              <Button
                variant="outlined"
                onClick={handleSubmit}
                disabled={loading || !email.trim() || !agenciaId}
                sx={{
                  height: HEIGHT, // misma altura que el input
                  lineHeight: `${HEIGHT}px`,
                  width: { xs: "100%", sm: "auto" },
                  whiteSpace: "nowrap",
                  borderRadius: "999px",
                  px: 3.5,
                  fontSize: "16px",
                  fontWeight: "bold",
                  textTransform: "none",
                  border: `3px solid ${tipografiaColor}`,
                  color: tipografiaColor,
                  backgroundColor: "transparent",
                  transition: "background-color 0.25s ease, transform 0.15s ease",
                  "&:hover": {
                    backgroundColor: tipografiaColor,
                    color: fondoColor,
                    transform: "translateY(-1px)",
                  },
                  "&:active": { transform: "translateY(0)" },
                }}
              >
                {loading ? "Enviando..." : "Registrarme!"}
              </Button>
            </Box>

            {/* Mensaje de error (no afecta altura de la fila) */}
            {fieldError && (
              <Typography
                variant="caption"
                role="alert"
                sx={{
                  display: "block",
                  mt: 1,
                  color: "#fff",
                  opacity: 0.9,
                  textAlign: { xs: "center", md: "center", lg: "right" },
                }}
              >
                {fieldError}
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* 🎉 Mensaje de Éxito con Diseño Experto */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.6
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
              }}
            >
              <Box
                sx={{
                  background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                  borderRadius: "20px",
                  padding: { xs: "24px 32px", md: "32px 48px" },
                  boxShadow: "0 20px 40px rgba(76, 175, 80, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1)",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  maxWidth: { xs: "320px", sm: "400px" },
                  width: "90vw",
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: 0.2
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: 32, md: 40 },
                      color: "#fff",
                      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))"
                    }}
                  />
                </motion.div>
                
                <Box sx={{ flex: 1 }}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", md: "1.3rem" },
                        fontFamily: tipografia,
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        mb: 0.5
                      }}
                    >
                      ¡Correo Registrado con Éxito!
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.9)",
                        fontSize: { xs: "0.85rem", md: "0.9rem" },
                        fontFamily: tipografia,
                        lineHeight: 1.4
                      }}
                    >
                      Te notificaremos sobre ofertas exclusivas y promociones especiales
                    </Typography>
                  </motion.div>
                </Box>
              </Box>

              {/* Partículas de celebración */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  zIndex: -1,
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      scale: 0,
                      x: 0,
                      y: 0,
                      opacity: 1
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos((i * Math.PI * 2) / 8) * 100,
                      y: Math.sin((i * Math.PI * 2) / 8) * 100,
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      delay: 0.5,
                      ease: "easeOut"
                    }}
                    style={{
                      position: "absolute",
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#4CAF50",
                      borderRadius: "50%",
                      boxShadow: "0 0 10px rgba(76, 175, 80, 0.6)"
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default BannerRegistro;

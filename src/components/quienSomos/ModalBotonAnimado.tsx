import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Grid,
    useMediaQuery,
    useTheme,
  } from "@mui/material";
  import EmailIcon from "@mui/icons-material/Email";
  import { useFooter } from "../../contextos/agencia/DatosAgenciaContext";
  
  interface ModalBotonAnimadoProps {
    open: boolean;
    onClose: () => void;
  }
  
  const ModalBotonAnimado = ({ open, onClose }: ModalBotonAnimadoProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const footer = useFooter();
  
    const tipografia = footer?.tipografia || theme.typography.fontFamily;
    const colorPrimario = footer?.color?.primario || theme.palette.primary.main;
  
    return (
      <Modal open={open} onClose={onClose}>
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
          }}
        >
          {/* 🔹 Banner superior */}
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
            ¡Gracias por tu interés! Completá tus datos para que podamos ayudarte
          </Box>
  
          {/* 🔹 Formulario */}
          <Box sx={{ padding: isMobile ? "15px" : "20px" }}>
            <Grid container spacing={isMobile ? 1 : 2}>
              {["Nombre", "Apellido", "Email", "Destino de interés", "Cantidad de personas"].map(
                (label, i) => (
                  <Grid key={i} item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      fontSize={isMobile ? "0.9rem" : "1rem"}
                    >
                      {label}
                    </Typography>
                    <TextField fullWidth variant="outlined" size={isMobile ? "small" : "medium"} />
                  </Grid>
                )
              )}
  
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  fontSize={isMobile ? "0.9rem" : "1rem"}
                >
                  Comentarios adicionales
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  multiline
                  rows={isMobile ? 2 : 3}
                />
              </Grid>
            </Grid>
  
            {/* 🔹 Botón enviar */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: isMobile ? 2 : 3 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: colorPrimario,
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: tipografia,
                  minWidth: isMobile ? 150 : 200,
                  py: 1,
                  fontSize: isMobile ? "0.8rem" : "0.9rem",
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
                onClick={onClose}
              >
                ENVIAR <EmailIcon sx={{ ml: 1, fontSize: isMobile ? "1rem" : "1.2rem" }} />
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  };
  
  export default ModalBotonAnimado;
  
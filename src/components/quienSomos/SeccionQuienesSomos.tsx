import { Box, Typography, useTheme, useMediaQuery, Stack } from "@mui/material";
import { useQuienesSomos, useFooter } from "../../contextos/agencia/DatosAgenciaContext";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ExploreIcon from "@mui/icons-material/Explore";
import HikingIcon from "@mui/icons-material/Hiking";
import { motion } from "framer-motion";
import BotonAnimado from "./BotonAnimado";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const SeccionQuienesSomos = () => {
  const quienesSomos = useQuienesSomos();
  const footer = useFooter();
  const theme = useTheme();
  const esMobile = useMediaQuery(theme.breakpoints.down("md"));

  const tipografia = footer?.tipografia || theme.typography.fontFamily;
  const colorTexto = footer?.tipografiaColor || theme.palette.text.primary;
  const bgColor = footer?.color?.terciario || theme.palette.background.default;

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        bgcolor: bgColor,
        color: colorTexto,
        fontFamily: tipografia,
        py: { xs: 5, md: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
          px: { xs: 3, md: 6 },
          textAlign: "center",
        }}
      >
        {/* Título */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.5px",
              textTransform: "uppercase",
              fontFamily: tipografia,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Quiénes Somos
          </Typography>
        </motion.div>

        {/* Descripción */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.8,
              opacity: 0.92,
              maxWidth: "760px",
              mx: "auto",
              fontFamily: tipografia,
              mt: 3,
            }}
          >
            {quienesSomos?.quienes_somos_es || "No se ha cargado la descripción."}
          </Typography>
        </motion.div>

        {/* Íconos turísticos */}
        <Stack
          direction={esMobile ? "column" : "row"}
          spacing={esMobile ? 4 : 6}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 4 }}
        >
          {[                                                     //aca los colores color: "#a73439" se puede agregar a datos generales
            { icon: <FlightTakeoffIcon sx={{ fontSize: 48, color: "#a73439" }} />, label: "Viajes Personalizados" },
            { icon: <ExploreIcon sx={{ fontSize: 48, color: "#a73439" }} />, label: "Destinos Increíbles" },
            { icon: <HikingIcon sx={{ fontSize: 48, color: "#a73439" }} />, label: "Experiencias Únicas" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={index + 2}
            >
              <Stack alignItems="center" spacing={1}>
                {item.icon}
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ fontFamily: tipografia }}
                >
                  {item.label}
                </Typography>
              </Stack>
            </motion.div>
          ))}
        </Stack>

        {/* Botón animado */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={5}>
          <Box sx={{ mt: 5 }}>
            <BotonAnimado />
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default SeccionQuienesSomos;

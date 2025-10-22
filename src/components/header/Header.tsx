import React, { useRef, useEffect, useState } from "react";
import { AppBar, Toolbar, Box, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useHeader, useDatosGenerales } from "../../contextos/agencia/DatosAgenciaContext";
import LogAgencia from '../../assets/logo-1-Color.png';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const Header: React.FC = () => {
  const header = useHeader();
  const datosGenerales = useDatosGenerales();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  const videoSrc = header?.videoBackground || undefined;
  const posterSrc = header?.imagenBackground || undefined;

  const opacidadBase = videoSrc
    ? header?.videoBackgroundOpacidad ?? header?.imagenBackgroundOpacidad ?? 1
    : header?.imagenBackgroundOpacidad ?? 1;
  const opacidadNormalizada = clamp01(opacidadBase);

  const fondoBase = datosGenerales?.colorFondoApp ?? datosGenerales?.color?.primario ?? "#000";
  const debeMostrarVideo = Boolean(videoSrc) && !videoError;

  // Logs básicos para validar rutas y contexto
  useEffect(() => {
    console.group("[Header Media]");
    console.log("videoSrc:", videoSrc);
    console.log("posterSrc:", posterSrc);
    console.log("opacidadNormalizada:", opacidadNormalizada);
    console.groupEnd();
  }, [videoSrc, posterSrc, opacidadNormalizada]);

  // Intento de autoplay (muted + inline)
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoSrc) return;

    setVideoError(false);
    el.muted = true;
    el.playsInline = true;

    el.play()
      .then(() => console.log("[Header Video] autoplay OK"))
      .catch((err) => {
        console.warn("[Header Video] autoplay falló (bloqueado o error):", err);
        // No marcamos error aquí; esperamos onError del tag si corresponde
      });
  }, [videoSrc]);

  return (
    <AppBar
      position="absolute"
      sx={{
        backgroundColor: debeMostrarVideo || posterSrc ? "transparent" : fondoBase,
        boxShadow: "none",
        height: { xs: "100vh", sm: "75vh", md: "40vh" }, //aca el ancho 65
        width: "100%",
        maxWidth: "100vw",
        top: 0,
        left: 0,
        m: 0,
        p: 0,
        overflow: "hidden",
        zIndex: 1100,
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      {/* Capa media: VIDEO si hay y no falló, si no IMAGEN */}
      {debeMostrarVideo ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={posterSrc}
          onCanPlay={() => console.log("[Header Video] canplay")}
          onPlay={() => console.log("[Header Video] play")}
          onPause={() => console.log("[Header Video] pause")}
          onError={(e) => {
            console.error("[Header Video] onError", e);
            setVideoError(true);
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        posterSrc && (
          <img
            src={posterSrc}
            alt="Fondo"
            onError={(e) => {
              console.error("[Header Poster] onError (img fallback)");
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          />
        )
      )}

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `rgba(0, 0, 0, ${opacidadNormalizada})`,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: { xs: "center", sm: "flex-start" },
          width: "100%",
          height: "100%",
          px: { xs: 2, sm: 4, md: 6 },
          pt: { xs: 2, sm: 3, md: 4 },
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          {//datosGenerales?.logoAgencia && ( esta queda comentada por si sacan el logo por datos Generales
          (
            <img
              src={LogAgencia}
              alt="Logo Agencia"
              onClick={() => navigate("/")}
              onError={(e) => {
                console.error("[Header Logo] onError");
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
              style={{
                height: isMobile ? "120px" : isTablet ? "160px" : "150px",
                width: "auto",
                maxWidth: "90vw",
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          )}
        </motion.div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

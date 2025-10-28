import React from "react";
import Slider from "react-slick";
import { Box, Typography, useMediaQuery } from "@mui/material";
import {
  usePublicidadCliente,
  useDatosGenerales,
  useTarjetas,
  useFooter,
} from "../../contextos/agencia/DatosAgenciaContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PublicidadCliente: React.FC = () => {
  const publicidadCliente = usePublicidadCliente();
  const datosGenerales = useDatosGenerales();
  const tarjetas = useTarjetas();
  const footer = useFooter();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:960px)");

  if (!publicidadCliente || !datosGenerales || !publicidadCliente.existe)
    return null;

  const titulo = publicidadCliente.titulo || "Promociones Especiales";

  const tipografia =
    tarjetas?.tipografia ||
    datosGenerales?.tipografiaAgencia ||
    "Poppins, sans-serif";

  const colorFlechas =
    publicidadCliente.color?.primario ||
    datosGenerales?.color?.primario ||
    "#004b8d";

  const imagenes: string[] = (publicidadCliente.imagenes ?? []).filter(
    (src): src is string => typeof src === "string" && src.trim().length > 0
  );

  if (imagenes.length === 0) return null;

  const multiples = imagenes.length > 1;

  const settings = {
    dots: false,
    infinite: multiples,
    speed: 800,
    slidesToShow: 1, // 🔹 Solo una imagen visible
    slidesToScroll: 1,
    autoplay: multiples,
    autoplaySpeed: 4000,
    arrows: true,
    pauseOnHover: true,
    centerMode: false,
    cssEase: "ease-in-out",
  };

  const handleClickImagen = () => {
    const numeroWhatsapp = footer?.redes?.whatsapp?.replace(/[^0-9]/g, "");
    const mensaje = "Hola! Quiero más información sobre la promoción que vi.";
    const encodedMessage = encodeURIComponent(mensaje);
    if (numeroWhatsapp) {
      window.open(
        `https://wa.me/${numeroWhatsapp}?text=${encodedMessage}`,
        "_blank"
      );
    }
  };

  const alturaCarrusel = isMobile ? 250 : isTablet ? 280 : 420;

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 2, md: 7 },
        position: "relative",
        backgroundColor: "#E6EEF7",
        overflow: "hidden",
      }}
    >
      {/* 🔹 Título */}
      <Typography
        sx={{
          fontFamily: tipografia,
          fontWeight: 600,
          fontSize: { xs: "1.4rem", md: "2rem" },
          color: "#000",
          mb: 3,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {titulo}
      </Typography>

      {/* 🔹 Carrusel con flechas externas */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Slider {...settings}>
          {imagenes.map((src, index) => (
            <Box
              key={`${src}-${index}`}
              sx={{
                px: { xs: 1, md: 2 },
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
              }}
              onClick={handleClickImagen}
            >
              <Box
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  width: "100%",
                  maxWidth: { xs: "95%", md: "98%" },
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  backgroundColor: "transparent",
                  alignItems: "center"
                }}
              >
                <Box
                  component="img"
                  src={src}
                  alt={`Publicidad ${index + 1}`}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: `${alturaCarrusel}px`,
                    objectFit: "cover",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                />
              </Box>
            </Box>
          ))}
        </Slider>

        {/* 🔹 Flechas personalizadas (afuera del carrusel) */}
        <style>
          {`
            .slick-prev, .slick-next {
              z-index: 1000;
              width: 40px;
              height: 40px;
              background: transparent !important;
              border-radius: 50%;
              display: flex !important;
              align-items: center;
              justify-content: center;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              transition: all 0.3s ease-in-out;
            }

            .slick-prev::before, .slick-next::before {
              font-size: 28px;
              color: ${colorFlechas};
              opacity: 0.8;
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .slick-prev:hover::before, .slick-next:hover::before {
              color: #002f5f;
              opacity: 1;
              transform: scale(1.1);
            }

            .slick-prev { left: -60px; } /* 🔹 Afuera a la izquierda */
            .slick-next { right: -60px; } /* 🔹 Afuera a la derecha */

            .slick-slider, .slick-list, .slick-track {
              background: transparent !important;
            }
          `}
        </style>
      </Box>
    </Box>
  );
};

export default PublicidadCliente;

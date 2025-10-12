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
  const isMobile = useMediaQuery("(max-width:768px)");

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
    "#a73439";

  const imagenes: string[] = (publicidadCliente.imagenes ?? []).filter(
    (src): src is string => typeof src === "string" && src.trim().length > 0
  );

  if (imagenes.length === 0) return null;

  const multiples = imagenes.length > 1;

  const settings = {
    dots: false,
    infinite: multiples,
    speed: 800,
    slidesToShow: isMobile ? 1 : 2,
    slidesToScroll: 1,
    autoplay: multiples,
    autoplaySpeed: 4000,
    arrows: !isMobile && multiples,
    pauseOnHover: true,
    centerMode: false,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
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

  return (
    <Box sx={{ width: "100%", py: 4, position: "relative", backgroundColor: "transparent" }}>
      {/* Título */}
      <Typography
        sx={{
          fontFamily: tipografia,
          fontWeight: 600,
          fontSize: { xs: "1.5rem", md: "2rem" },
          color: "#000",
          mb: 3,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {titulo}
      </Typography>

      {/* Contenedor del Slider */}
      <Box sx={{ position: "relative", maxWidth: "1200px", margin: "0 auto" }}>
        <Slider {...settings}>
          {imagenes.map((src, index) => (
            <Box
              key={`${src}-${index}`}
              sx={{
                px: 1.5, // separación entre imágenes
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
              }}
              onClick={handleClickImagen}
            >
              <Box
                sx={{
                  borderRadius: "6px",
                  overflow: "hidden",
                  width: "100%",
                  maxWidth: "550px", // tamaño menor para dejar espacio afuera para las flechas
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  backgroundColor: "transparent",
                }}
              >
                <Box
                  component="img"
                  src={src}
                  alt={`Publicidad ${index + 1}`}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: { xs: 200, md: 300 },
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Slider>

        {/* Flechas fuera del contenedor */}
        <style>
          {`
            /* Contenedor de las flechas completamente transparente */
            .slick-prev, .slick-next {
              z-index: 1000;
              width: 50px;
              height: 50px;
              background: transparent !important; /* contenedor transparente */
              border-radius: 0;
              display: flex !important;
              align-items: center;
              justify-content: center;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              box-shadow: none !important;
            }

            /* Solo el círculo blanco detrás del icono y flecha gris */
            .slick-prev::before, .slick-next::before {
              font-size: 28px;
              color: #333333; /* flecha gris oscuro */
              background: #ffffff; /* círculo blanco */
              border-radius: 50%;
              width: 28px;
              height: 28px;
              line-height: 28px;
              text-align: center;
            }

            /* Efecto hover del círculo */
            .slick-prev:hover::before, .slick-next:hover::before {
              transform: scale(1.1);
              background: #f0f0f0; /* círculo un poco más gris al pasar el mouse */
            }

            /* Posición afuera del slider */
            .slick-prev { left: -60px; }   
            .slick-next { right: -60px; }  

            /* Slider fondo completamente transparente */
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

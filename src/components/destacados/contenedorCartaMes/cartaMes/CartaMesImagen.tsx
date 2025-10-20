import React from "react";
import Slider from "react-slick";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { PaqueteData } from "../../../../interfaces/PaqueteData";

interface CartaMesImagenProps {
  paquete: PaqueteData;
  alt: string;
  cargando: boolean;
  colorSecundario?: string;
}

const CartaMesImagen: React.FC<CartaMesImagenProps> = ({
  paquete,
  alt,
  cargando,
  colorSecundario = "#cccccc",
}) => {
  const imagenes =
    paquete?.galeria_imagenes && paquete.galeria_imagenes.length > 0
      ? paquete.galeria_imagenes
      : [paquete.imagen_principal || "/imagenes/default-image.jpg"];

  const sliderRef = React.useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false, // usamos botones personalizados
    pauseOnHover: true,
    fade: true, // transición sin salto ni blanco
    cssEase: "ease-in-out",
  };

  const handleNext = () => sliderRef.current?.slickNext();
  const handlePrev = () => sliderRef.current?.slickPrev();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
      }}
    >
      {cargando && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <CircularProgress sx={{ color: colorSecundario }} />
        </Box>
      )}

      {/* Slider principal */}
      <Slider ref={sliderRef} {...settings}>
        {imagenes.map((img, i) => (
          <Box key={i}>
            <img
              src={img}
              alt={alt}
              style={{
                width: "100%",
                height: 210,
                objectFit: "cover",
                display: "block",
                borderTopLeftRadius: "6px",
                borderTopRightRadius: "6px",
              }}
            />
          </Box>
        ))}
      </Slider>

      {/* Botones a los costados (afuera) */}
      {imagenes.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: -18,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
              zIndex: 3,
              p: 0.5,
            }}
          >
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: -18,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
              zIndex: 3,
              p: 0.5,
            }}
          >
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default CartaMesImagen;

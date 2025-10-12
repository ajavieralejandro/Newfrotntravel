import React from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importá tus imágenes desde assets
import Img1 from "../../assets/aupisiante-1.png";
import Img2 from "../../assets/aupisiante-2.png";
import Img3 from "../../assets/aupisiante-3.png";
import Img4 from "../../assets/auspiciante-4.png";
import Img5 from "../../assets/aupisiante-5.png";
import Img6 from "../../assets/aupisiante-6.png";

const imagenes = [Img1, Img2, Img3, Img4, Img5, Img6];

const CarruselAcompanantes: React.FC = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 6, // cantidad de imágenes visibles
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // sin flechas
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  return (
    <Box sx={{ width: "100%", py: 4, backgroundColor: "transparent" }}>
      <Slider {...settings}>
        {imagenes.map((img, index) => (
          <Box
            key={index}
            sx={{
              px: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={img}
              alt={`Acompanante ${index + 1}`}
              loading="lazy"
              sx={{
                maxHeight: 70,
                objectFit: "contain",
                filter: "grayscale(0.3)", // opcional: estilo parecido a TravelConnect
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default CarruselAcompanantes;

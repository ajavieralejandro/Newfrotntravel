import React from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importá tus imágenes desde assets
import Img1 from "../../assets/auspiciante-1.png";
import Img2 from "../../assets/auspiciante-2.png";
import Img3 from "../../assets/auspiciante-3.png";
import Img4 from "../../assets/auspiciante-4.png";
import Img5 from "../../assets/auspiciante-5.png";
import Img6 from "../../assets/auspiciante-6.png";

const imagenes = [Img1, Img2, Img3, Img4, Img5, Img6];

const CarruselAupisiante: React.FC = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 6, // cantidad de imágenes visibles
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
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
    <Box
      sx={{
        width: "100%",
        backgroundColor: "white",
        paddingTop: "10px",
        "& .slick-list": {
          height: { xs: 60, sm: 70, md: 80 }, // 🔹 Responsive height
        },
        "& .slick-slide": {
          display: "flex !important",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
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
              alt={`Auspiciador ${index + 1}`}
              loading="lazy"
              sx={{
                maxHeight: { xs: 40, sm: 55, md: 70 }, // 🔹 Ajuste proporcional
                objectFit: "contain",
                filter: "grayscale(0.3)",
                transition: "transform 0.3s ease, filter 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  filter: "grayscale(0)",
                },
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default CarruselAupisiante;

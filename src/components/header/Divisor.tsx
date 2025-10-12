import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

const Divisor = () => {
  const [marginTop, setMarginTop] = useState(-20);

  useEffect(() => {
    const calcularMargen = () => {
      const visualWidth = window.visualViewport?.width || window.innerWidth;
      const zoom = window.devicePixelRatio || 1;
      const anchoAjustado = visualWidth / zoom;

      let factor = 0.35;
      let maximo = 240;

      if (anchoAjustado < 400) {
        // móviles muy pequeños
        factor = 0.45;
        maximo = 280;
      } else if (anchoAjustado >= 700 && anchoAjustado <= 1024) {
        // tablets
        factor = 0.08;
        maximo = 60;
      } else if (anchoAjustado > 1024) {
        // desktop
        factor = 0.08;
        maximo = 80;
      }

      let nuevoMargin = -20 + Math.max(0, (1600 - anchoAjustado) * factor);
      if (nuevoMargin > maximo) nuevoMargin = maximo;

      setMarginTop(nuevoMargin);
    };

    calcularMargen();

    const onResize = () => calcularMargen();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 40,
        height: "auto",
        mt: `${marginTop}px`,
        mb: 2,
        backgroundColor: "transparent",
        transition: "margin-top 0.3s ease-in-out",
      }}
    />
  );
};

export default Divisor;

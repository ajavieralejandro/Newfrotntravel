import React, { useState } from "react";
import { Card, Backdrop, CircularProgress } from "@mui/material";
import { PaqueteData} from "../../../interfaces/PaqueteData";
import {
  useTarjetas,
  useDatosGenerales,
} from "../../../contextos/agencia/DatosAgenciaContext";
import CartaMesImagen from "./cartaMes/CartaMesImagen";
import CartaMesContenido from "./cartaMes/CartaMesContenido";
import CartaMesPrecio from "./cartaMes/CartaMesPrecio";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface CartaMesProps {
  paquete: PaqueteData;
}

const CartaMes: React.FC<CartaMesProps> = ({ paquete }) => {
  const tarjetas = useTarjetas();
  const datosGenerales = useDatosGenerales();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  const tipografia =
    tarjetas?.tipografia ||
    datosGenerales?.tipografiaAgencia ||
    "'Poppins', sans-serif";

  // 🔥 Ahora forzamos fondo blanco para coherencia de lectura
  const colorFondo = "#FFFFFF";

  const colorSecundario =
    tarjetas?.color?.secundario ||
    datosGenerales?.color?.secundario ||
    "#CCCCCC";

  const handleClick = () => {
    setCargando(true);
    navigate(`/paquetes-busqueda/${paquete.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ width: "100%", height: "100%", maxWidth: "100%" }}
    >
      <Card
        onClick={handleClick}
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          minHeight: { xs: "380px", sm: "400px", md: "420px" },
          borderRadius: "6px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease-in-out",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
          },
          backgroundColor: colorFondo,
          fontFamily: tipografia,
          display: "flex",
          flexDirection: "column",
          border: "none",
          outline: "none",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <CartaMesImagen
          paquete={paquete}
          alt={paquete.titulo}
          cargando={false}
          colorSecundario={colorSecundario}
        />

        <CartaMesContenido
          nombre={paquete.titulo}
          cargando={false}
        />

        <CartaMesPrecio
           precio={Number(paquete.salidas[0].doble_precio ?? 0)}
          moneda={paquete.tipo_moneda || "ARS"}
          wp = {paquete}
        />

        <Backdrop
          open={cargando}
          sx={{
            position: "absolute",
            zIndex: 10,
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: "6px",
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Card>
    </motion.div>
  );
};

export default CartaMes;

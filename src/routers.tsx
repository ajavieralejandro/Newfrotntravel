import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PaquetesBusqueda from "./pages/PaquetesBusqueda";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/paquetes-busqueda" element={<PaquetesBusqueda />} />
      <Route path="/paquetes-busqueda/:id" element={<PaquetesBusqueda />} /> {/* ✅ nueva ruta dinámica */}
    </Routes>
  );
};

export default AppRoutes;

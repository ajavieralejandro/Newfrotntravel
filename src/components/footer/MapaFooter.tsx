// components/MapaFooter.tsx
import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Si usás Vite, podés importar las imágenes locales:
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface MapaFooterProps {
  latitud?: number | null;
  longitud?: number | null;
  direccion?: string;
}

const MapaFooter: React.FC<MapaFooterProps> = ({
  latitud,
  longitud,
  direccion,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const lat = latitud ?? -34.59191;
  const lng = longitud ?? -58.37699;
  const direccionFinal =
    direccion || "Av. del Libertador 218, 1º Piso, CABA, Argentina";

  useEffect(() => {
    if (!mapRef.current) return;

    // si ya está creado, no lo recreamos
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16);
      return;
    }

    // Configuramos ícono por defecto
    const defaultIcon = L.icon({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const map = L.map(mapRef.current).setView([lat, lng], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
    marker.bindPopup(`📍 ${direccionFinal}`);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, direccionFinal]);

  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      <Typography
        variant="body2"
        textAlign="center"
        mb={1}
        sx={{ fontWeight: 500 }}
      >
        📍 Dirección: {direccionFinal}
      </Typography>

      <Box
        ref={mapRef}
        sx={{
          width: "100%",
          height: 150,
          borderRadius: "10px",
          overflow: "hidden",
          // fondo mientras carga
          bgcolor: "grey.900",
        }}
      />
    </Box>
  );
};

export default MapaFooter;

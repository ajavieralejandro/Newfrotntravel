// components/MapaFooter.tsx
import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Si usás Vite, esto funciona perfecto y evita depender de CDN:
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface MapaFooterProps {
  latitud?: number | null;
  longitud?: number | null;
  direccion?: string;
}

// Configuramos el ícono por defecto de Leaflet
const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const MapaFooter: React.FC<MapaFooterProps> = ({
  latitud,
  longitud,
  direccion,
}) => {
  const center = useMemo<[number, number]>(() => {
    const lat = latitud ?? -34.59191;
    const lng = longitud ?? -58.37699;
    return [lat, lng];
  }, [latitud, longitud]);

  const direccionFinal =
    direccion || "Av. del Libertador 218, 1º Piso, CABA, Argentina";

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
        sx={{
          width: "100%",
          height: 150,
          borderRadius: "10px",
          overflow: "hidden",
          "& .leaflet-container": {
            width: "100%",
            height: "100%",
          },
        }}
      >
        <MapContainer
          center={center}
          zoom={16}
          scrollWheelZoom={false}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={center}>
            <Popup>📍 {direccionFinal}</Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MapaFooter;

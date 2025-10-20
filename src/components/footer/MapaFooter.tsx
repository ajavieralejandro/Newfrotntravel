import React from "react";
import { Box, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Ícono por defecto de Leaflet corregido para React
const defaultIcon = L.icon({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// 📍 Coordenadas fijas de Av. del Libertador 218
const ubicacionFija = {
  lat: -34.59191,
  lng: -58.37699,
};

const direccion = "Av. del Libertador 218, 1º Piso, CABA, Argentina";

const MapaFooter: React.FC = () => {
  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      <Typography
        variant="body2"
        textAlign="center"
        mb={1}
        sx={{ fontWeight: 500 }}
      >
        📍 Dirección: {direccion}
      </Typography>

      <MapContainer
        center={[ubicacionFija.lat, ubicacionFija.lng]}
        zoom={16}
        scrollWheelZoom={false}
        style={{
          width: "100%",
          height: "150px", // puedes ajustar esta altura
          borderRadius: "10px",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[ubicacionFija.lat, ubicacionFija.lng]}>
          <Popup>
            📍 Av. del Libertador 218, 1º Piso, CABA, Argentina
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default MapaFooter;

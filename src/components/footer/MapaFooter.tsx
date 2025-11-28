// components/MapaFooter.tsx
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

interface MapaFooterProps {
  latitud?: number | null;
  longitud?: number | null;
  direccion?: string;
}

type LeafletLibs = {
  MapContainer: any;
  TileLayer: any;
  Marker: any;
  Popup: any;
  L: any;
};

const MapaFooter: React.FC<MapaFooterProps> = ({
  latitud,
  longitud,
  direccion,
}) => {
  const [libs, setLibs] = useState<LeafletLibs | null>(null);

  // Coordenadas por defecto
  const ubicacion = {
    lat: latitud ?? -34.59191,
    lng: longitud ?? -58.37699,
  };

  const direccionFinal =
    direccion || "Av. del Libertador 218, 1º Piso, CABA, Argentina";

  useEffect(() => {
    // Solo en navegador
    if (typeof window === "undefined") return;

    (async () => {
      // Cargamos react-leaflet y leaflet dinámicamente
      const [reactLeaflet, leaflet] = await Promise.all([
        import("react-leaflet"),
        import("leaflet"),
      ]);

      // CSS de Leaflet
      await import("leaflet/dist/leaflet.css");

      const { MapContainer, TileLayer, Marker, Popup } = reactLeaflet;
      const L = leaflet.default || leaflet;

      // Fix de íconos (en producción suelen romperse si no se hace esto)
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

      setLibs({
        MapContainer,
        TileLayer,
        Marker,
        Popup,
        L,
      });
    })();
  }, []);

  // Mientras carga Leaflet/React-Leaflet
  if (!libs) {
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
            height: "150px",
            borderRadius: "10px",
            bgcolor: "grey.900",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "grey.400",
            fontSize: "0.8rem",
          }}
        >
          Cargando mapa…
        </Box>
      </Box>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = libs;

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

      <MapContainer
        center={[ubicacion.lat, ubicacion.lng]}
        zoom={16}
        scrollWheelZoom={false}
        style={{
          width: "100%",
          height: "150px",
          borderRadius: "10px",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[ubicacion.lat, ubicacion.lng]}>
          <Popup>📍 {direccionFinal}</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default MapaFooter;

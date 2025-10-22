import React from 'react';

/* 1) IMPORTS CORRECTOS de react-leaflet (si usás otra ruta, ajustá el path de archivo) */
import { MapContainer as RLMapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/* 2) Helper: validar que algo es renderizable por React */
const isComponent = (C: any) =>
  typeof C === 'function' || (C && typeof C === 'object' && (C as any).$$typeof);

type Props = {
  center?: [number, number];
  zoom?: number;
  style?: React.CSSProperties;
};

const DEFAULT_CENTER: [number, number] = [-38.7196, -62.2663]; // Bahía Blanca como ejemplo

/* 3) EXPORT DEFAULT (coherente con cómo lo importás en MapaFooter) */
export default function MapContainerComponent({
  center = DEFAULT_CENTER,
  zoom = 13,
  style,
}: Props) {
  // Guardas para evitar el “no es función”
  if (!isComponent(RLMapContainer)) {
    console.error('[MapContainerComponent] RLMapContainer inválido:', RLMapContainer);
    return null;
  }
  if (!isComponent(TileLayer)) {
    console.error('[MapContainerComponent] TileLayer inválido:', TileLayer);
    return null;
  }

  return (
    <div style={{ height: 320, width: '100%', ...style }}>
      <RLMapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={center}>
          <Popup>Estamos acá</Popup>
        </Marker>
      </RLMapContainer>
    </div>
  );
}

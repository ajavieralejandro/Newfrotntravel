import { Salida } from './Salida';
import { Hotel } from './Hotel';

export interface HotelDetalle {
  hotelName: string;
  hotelCode: string;
  price: {
    gross: string | number;
    currency: string;
  };
  roomCode?: string; // primer rooms[0].code
  roomDescription?: string; // primer rooms[0].description
  boardCode?: string; // SA, AD...
  cancelPolicy?: {
    refundable: boolean;
  };
  imageUrl?: string[]; // imageUrl o hotels[].media.images[0].url o placeholder
}

export interface PaqueteData {
  id: number;
  titulo: string;
  descripcion: string;

  pais: string;
  ciudad: string;
  ciudad_iata: string | null;

  fecha_vigencia_desde: string; // "DD-MM-YYYY"
  fecha_vigencia_hasta: string; // "DD-MM-YYYY"

  cant_noches: number;
  tipo_producto: string | null;
  activo: boolean;
  prioridad: 'alta' | 'media' | 'baja';

  imagen_principal: string;
  edad_menores: number;
  transporte: string | null;

  tipo_moneda: string;

  descuento: string;

  componentes: string | { tipo: string; detalle: string }[] | null;

  hotel: Hotel | null;

  // ⚠️ Aquí agregamos un arreglo de hoteles con detalle mapeado
  hotelDetalle?: HotelDetalle[];

  galeria_imagenes: string[];

  slug?: string | null;
  paquete_externo_id?: string | null;
  usuario?: string | null;
  usuario_id?: number;
  fecha_modificacion?: string | null;

  created_at?: string;
  updated_at?: string;

  salidas: Salida[];
}
// interfaces/PaqueteData.ts
import { Salida } from './Salida';
import { Hotel } from './Hotel';

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

  // ⚠️ En el back llega como "ARS" y ya lo tenemos así
  tipo_moneda: string;

  // Llega como string "0.00"
  descuento: string;

  // En el back puede venir como string JSON ("[]") o como array tipado
  componentes: string | { tipo: string; detalle: string }[] | null;

  // En el back puede venir como string JSON ("[]") o como array
  categorias: string | string[] | null;

  // En el back puede venir objeto único o array
  hotel: Hotel | Hotel[] | null;

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

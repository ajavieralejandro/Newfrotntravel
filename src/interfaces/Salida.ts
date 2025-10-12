// interfaces/Salida.ts
export interface Salida {
  id: number;
  paquete_id: number;
  salida_externo_id: number | null;

  // En el back llega como 0/1
  venta_online: boolean | number;
  cupos: number;

  fecha_viaje: string | null;
  fecha_desde: string; // "DD-MM-YYYY"
  fecha_hasta: string; // "DD-MM-YYYY"

  // En el back llega como 0/1
  info_tramos: boolean | number;

  // En el back no llega -> derivar o default
  tipo_transporte?: 'avion' | 'bus' | 'sin_transporte' | null;

  ida_origen_fecha: string;
  ida_origen_hora: string | null;
  ida_origen_ciudad: string | null;

  ida_destino_fecha: string | null;
  ida_destino_hora: string | null;
  ida_destino_ciudad: string | null;

  ida_clase_vuelo: string | null;
  ida_linea_aerea: string | null;
  ida_vuelo: string | null;
  ida_escalas: string | null;

  vuelta_origen_fecha: string | null;
  vuelta_origen_hora: string | null;
  vuelta_origen_ciudad: string | null;

  vuelta_destino_fecha: string | null;
  vuelta_destino_hora: string | null;
  vuelta_destino_ciudad: string | null;

  vuelta_clase_vuelo: string | null;
  vuelta_linea_aerea: string | null;
  vuelta_vuelo: string | null;
  vuelta_escalas: string | null;

  // En el back vienen como string o null
  single_precio: number | string | null;
  single_impuesto: number | string | null;
  single_otro: number | string | null;
  single_otro2: number | string | null;

  doble_precio: number | string | null;
  doble_impuesto: number | string | null;
  doble_otro: number | string | null;
  doble_otro2: number | string | null;

  triple_precio: number | string | null;
  triple_impuesto: number | string | null;
  triple_otro: number | string | null;
  triple_otro2: number | string | null;

  cuadruple_precio: number | string | null;
  cuadruple_impuesto: number | string | null;
  cuadruple_otro: number | string | null;
  cuadruple_otro2: number | string | null;

  familia_1_precio: number | string | null;
  familia_1_impuesto: number | string | null;
  familia_1_otro: number | string | null;
  familia_1_otro2: number | string | null;

  familia_2_precio: number | string | null;
  familia_2_impuesto: number | string | null;
  familia_2_otro: number | string | null;
  familia_2_otro2: number | string | null;

  created_at: string;
  updated_at: string;
}

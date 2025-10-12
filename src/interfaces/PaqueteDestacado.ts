import { PaqueteData } from "./PaqueteData";

export interface PaqueteDestacado {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;

  /** 🔁 Derivados o transformados */
  duracion?: number;          // Ej: cantidad de noches
  imagen?: string;            // Imagen principal (si se usa)
  fecha?: string;             // fecha_salida de la primera salida
  moneda?: string;            // Ej: "ARS", "USD"

  /** 🔗 Datos opcionales */
  usuario_id?: number;
  salidas?: PaqueteData[];     // Ya definido en tu modelo
}

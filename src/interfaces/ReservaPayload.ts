import { Pasajero } from "./Pasajero";

export interface ReservaPayload {
  agencia_id: number;   // obligatorio
  paquete_id: number;   // obligatorio
  formularioConsulta: {
    email: string;      // obligatorio
    telefono?: string;  // opcional
  };
  pasajeros: Pasajero[]; // obligatorio
}

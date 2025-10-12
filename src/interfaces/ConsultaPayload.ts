export interface ConsultaPayload {
  agencia_id: number;   // obligatorio
  paquete_id: number;   // obligatorio
  formularioConsulta: {
    nombre_apellido: string; // obligatorio
    email: string;           // obligatorio
    telefono?: string;       // opcional
    direccion?: string;      // opcional
    pais?: string;           // opcional
    ciudad?: string;         // opcional
    comentarios?: string;    // opcional
  };
}

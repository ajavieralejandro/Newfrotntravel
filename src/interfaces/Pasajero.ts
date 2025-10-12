export interface Pasajero {
  nombre: string;                // obligatorio
  apellido: string;              // obligatorio
  pasaporte: string;              // obligatorio
  fecha_nacimiento: string;      // formato YYYY-MM-DD, obligatorio
  email?: string;                 // opcional (si el backend lo pide por pasajero)
  telefono?: string;              // opcional
}

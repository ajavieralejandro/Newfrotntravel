import ubicacionesData from './ubicacionesIATA.json';

export interface UbicacionIATA {
    codigo: string;  // Código IATA
    nombre: string;  // Nombre de la ciudad/aeropuerto
}

// Exportar los datos como UbicacionIATA[]
export const ubicacionesIATA: UbicacionIATA[] = ubicacionesData as UbicacionIATA[];

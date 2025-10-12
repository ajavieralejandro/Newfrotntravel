import ubicacionesData from "../../data/ubicacionesIATA.json";

interface UbicacionIATA {
  codigo: string;
  nombre: string;
}

export const obtenerUbicaciones = (inputValue: string = "", limite: number = 5): UbicacionIATA[] => {
  if (!inputValue || typeof inputValue !== "string") return []; // 🔥 Asegura que inputValue es string válido

  const inputLower = inputValue.trim().toLowerCase(); // 🔥 Evita errores con `toLowerCase()`

  return ubicacionesData
    .map((ubicacion) => ({
      codigo: String(ubicacion.codigo), // 🔥 Convertimos código a string siempre
      nombre: ubicacion.nombre || "", // 🔥 Asegura que nombre no sea undefined
    }))
    .filter((ubicacion: UbicacionIATA) =>
      ubicacion.nombre.toLowerCase().includes(inputLower) // 🔥 Filtra por nombre
    )
    .sort((a, b) => {
      const aStarts = a.nombre.toLowerCase().startsWith(inputLower);
      const bStarts = b.nombre.toLowerCase().startsWith(inputLower);
      return aStarts === bStarts ? 0 : aStarts ? -1 : 1;
    })
    .slice(0, limite);
};

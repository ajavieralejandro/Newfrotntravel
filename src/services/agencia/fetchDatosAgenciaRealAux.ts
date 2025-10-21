import { AgenciaBackData } from "../../interfaces/AgenciaBackData";
import { agenciaMock } from "../../mocks/agenciaMock";

// 🔹 Cambiá a false para usar el backend real
const USAR_MOCK = false;

// ✅ Devuelve SIEMPRE el formato crudo del backend (AgenciaBackData)
export const fetchDatosAgenciaReal = async (): Promise<AgenciaBackData> => {
  if (USAR_MOCK) {
    console.log("⚠️ Usando datos simulados (mock) para agencia");
    const data: AgenciaBackData = agenciaMock[0];
    console.log("[AGENCIA][RAW MOCK]", data);
    return data; // <- sin transformar
  }

  const hostname = window.location.hostname;
  const esLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

   const url = esLocalhost
     ? 'https://vaguviajes.tur.ar/agencia2' 
     : `${window.location.origin}/agencia2`;

 // const url = 'https://hubtravel.travelconnect.com.ar/agencia2' //utilizado para realizar pruebas
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("No se pudo obtener la información de la agencia");

  const data: AgenciaBackData = await response.json();
  console.log(`✅ Dato recibido de la API ${url}:`, data);
  return data; // <- sin transformar
};


///////////

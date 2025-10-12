
import { AgenciaBackData } from "../../interfaces/AgenciaBackData";
import { agenciaMock } from "../../mocks/agenciaMock";

// 🔹 Cambiá a false para usar el backend real
const USAR_MOCK = false;

// 🏷️ Dominio base de producción
const BASE_DOMAIN = "travelconnect.com.ar";

/**
 * Resuelve la BASE del host de la API:
 * - En local: usa VITE_API_BASE_OVERRIDE si está, sino {VITE_DEV_SUBDOMAIN}.{BASE_DOMAIN} o el apex.
 * - En prod:
 *    • si estás en subdominio de travelconnect.com.ar → usa ese mismo subdominio
 *    • si estás en el apex (o www) → usa el apex
 * - Si todo falla → usa protocol + hostname actual.
 *
 * Env opcionales:
 * - VITE_API_BASE_OVERRIDE: forzar base completa (e.g. "https://miapi.dev:8443")
 * - VITE_DEV_SUBDOMAIN: subdominio a usar en local (e.g. "ezezeze")
 */
function getApiBase(): string {
  if (typeof window === "undefined") {
    // Si alguna vez corrés esto en SSR, devolvé una base segura o vacía.
    return "";
  }

  const { protocol, hostname } = window.location;

  // 1) Forzar base por .env si querés desambiguar (staging, túneles, etc.)
  const forced = import.meta.env.VITE_API_BASE_OVERRIDE?.toString().trim();
  if (forced) {
    return forced.replace(/\/+$/, ""); // sin barra final
  }

  // 2) Entorno local → usá subdominio de pruebas o el apex
  const isLocal =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";

  if (isLocal) {
    const devSub = import.meta.env.VITE_DEV_SUBDOMAIN?.toString().trim();
    const targetHost = devSub ? `${devSub}.${BASE_DOMAIN}` : BASE_DOMAIN;
    return `${protocol}//${targetHost}`;
  }

  // 3) Producción sobre el dominio real
  //    - Si estás en foo.travelconnect.com.ar → quedate en foo.travelconnect.com.ar
  //    - Si estás en travelconnect.com.ar o www.travelconnect.com.ar → usá el apex
  if (hostname === BASE_DOMAIN || hostname === `www.${BASE_DOMAIN}`) {
    return `${protocol}//${BASE_DOMAIN}`;
  }
  if (hostname.endsWith(`.${BASE_DOMAIN}`)) {
    return `${protocol}//${hostname}`;
  }

  // 4) Fallback genérico: mismo host actual
  return `${protocol}//${hostname}`;
}

// ✅ Devuelve SIEMPRE el formato crudo del backend (AgenciaBackData)
export const fetchDatosAgenciaReal = async (): Promise<AgenciaBackData> => {
  if (USAR_MOCK) {
    console.log("⚠️ Usando datos simulados (mock) para agencia");
    const data: AgenciaBackData = agenciaMock[0];
    console.log("[AGENCIA][RAW MOCK]", data);
    return data; // <- sin transformar
  }

  const base = getApiBase();
  const url = `${base}/agencia2`;

  console.log("[AGENCIA] Fetch URL:", url);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    // credentials: 'include', // 👉 descomentá si necesitás cookies
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la información de la agencia");
  }

  const data: AgenciaBackData = await response.json();
  console.log(`✅ Dato recibido de la API ${url}:`, data);
  return data; // <- sin transformar
};













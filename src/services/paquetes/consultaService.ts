// services/paquetes/consultaService.ts

/** A) Envío de consultas */
export interface ConsultaData {
  idAgencia: number;
  idPaquete: number;
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  pais: string;
  ciudad: string;
  comentarios: string;
}

export const enviarConsulta = async (data: ConsultaData): Promise<string> => {
  const payload = {
    agencia_id: data.idAgencia,
    paquete_id: data.idPaquete,
    formularioConsulta: {
      nombre_apellido: data.nombreCompleto,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion,
      pais: data.pais,
      ciudad: data.ciudad,
      comentarios: data.comentarios,
    },
  };

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log("Payload enviado a /contacto/enviarAgencia:", payload);
  }

  const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://travelconnect.com.ar";

  const respuesta = await fetch(`${API_BASE_URL}/contacto/enviarAgencia`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!respuesta.ok) throw new Error("Error al enviar la consulta");

  const result = (await respuesta.json()) as { mensaje?: string } | null;
  return result?.mensaje ?? "Consulta enviada correctamente.";
};

/** B) Paquetes: listado / búsqueda (modelo único, sin normalización) */
import type { PaqueteData } from "../../interfaces/PaqueteData";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://travelconnect.com.ar";
const ENDPOINT_LISTADO = "/paquetes/listado";
const ENDPOINT_BUSQUEDA = "/paquetes/buscar";

type WithSignal = { signal?: AbortSignal };
export type ListadoParams = Record<string, unknown> & WithSignal;
export type BusquedaQuery = Record<string, unknown> & WithSignal;

const buildQueryString = (obj?: Record<string, unknown>): string => {
  if (!obj) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) {
    if (k === "signal") continue; // no serializar signal
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) v.forEach((item) => params.append(k, String(item)));
    else params.append(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
};

async function fetchJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" }, signal });
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
  return (await res.json()) as T;
}

export async function fetchPaquetes(params?: ListadoParams): Promise<PaqueteData[]> {
  const url = `${API_BASE_URL}${ENDPOINT_LISTADO}${buildQueryString(params)}`;
  try {
    const data = await fetchJSON<PaqueteData[]>(url, params?.signal);
    return data;
  } catch (e) {
    console.error("fetchPaquetes error:", e);
    return [];
  }
}

export async function buscarPaquetes(query: BusquedaQuery): Promise<PaqueteData[]> {
  const { signal, ...rest } = query ?? {};
  const url = `${API_BASE_URL}${ENDPOINT_BUSQUEDA}${buildQueryString(rest)}`;
  try {
    const data = await fetchJSON<PaqueteData[]>(url, signal);
    return data;
  } catch (e) {
    console.error("buscarPaquetes error:", e);
    return [];
  }
}

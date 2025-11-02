// services/paquetes/consultasYReservasService.ts
import { ConsultaPayload } from "../../interfaces/ConsultaPayload";
import { ReservaPayload } from "../../interfaces/ReservaPayload";

export type ApiSuccess<T = any> = { success: true; data: T; status: number };
export type ApiFail = { success: false; data?: any; error?: string; status: number };
export type ApiResult<T = any> = ApiSuccess<T> | ApiFail;

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://travelconnect.com.ar";

/**
 * Envía el formulario de contacto de una agencia
 * POST {API_BASE_URL}/contacto/enviarAgencia
 */
export const enviarConsulta = async (payload: ConsultaPayload): Promise<ApiResult> => {
  try {
    const res = await fetch(`${API_BASE_URL}/contacto/enviarAgencia`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // si no viene JSON, mantenemos data=null
    }

    if (!res.ok) return { success: false, data, status: res.status };
    return { success: true, data, status: res.status };
  } catch (error) {
    console.error("Error en enviarConsulta:", error);
    return { success: false, error: "Error de conexión", status: 0 };
  }
};

/**
 * Crea una reserva con pasajeros
 * POST {API_BASE_URL}/reservas
 */
export const crearReserva = async (payload: ReservaPayload): Promise<ApiResult> => {
  try {
    const res = await fetch(`${API_BASE_URL}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // ✅ corregido
      body: JSON.stringify(payload),
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) return { success: false, data, status: res.status };
    return { success: true, data, status: res.status };
  } catch (error) {
    console.error("Error en crearReserva:", error);
    return { success: false, error: "Error de conexión", status: 0 };
  }
};

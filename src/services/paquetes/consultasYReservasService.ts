import { ConsultaPayload } from "../../interfaces/ConsultaPayload";
import { ReservaPayload } from "../../interfaces/ReservaPayload";

/**
 * Envía el formulario de contacto de una agencia
 * POST https://travelconnect.com.ar/contacto/enviarAgencia
 */
export const enviarConsulta = async (payload: ConsultaPayload) => {
  try {
    const res = await fetch("https://travelconnect.com.ar/contacto/enviarAgencia", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, data, status: res.status };
    }

    return { success: true, data, status: res.status };
  } catch (error) {
    console.error("Error en enviarConsulta:", error);
    return { success: false, error: "Error de conexión", status: 0 };
  }
};

/**
 * Crea una reserva con pasajeros
 * POST https://travelconnect.com.ar/reservas
 */
export const crearReserva = async (payload: ReservaPayload) => {
  try {
    const res = await fetch("https://travelconnect.com.ar/reservas", {
      method: "POST",
      headers: {
        "Content-Typ e": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, data, status: res.status };
    }

    return { success: true, data, status: res.status };
  } catch (error) {
    console.error("Error en crearReserva:", error);
    return { success: false, error: "Error de conexión", status: 0 };
  }
};

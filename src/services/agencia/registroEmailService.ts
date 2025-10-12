// Tipos de respuesta
export interface RegistroEmailSuccess {
  status: "success";
  message: string;
  data: {
    id: number;
    agencia_id: number;
    email: string;
    created_at: string;
  };
}

export interface RegistroEmailError {
  status: "error";
  message: string;
  errors?: {
    email?: string[];
  };
}

export type RegistroEmailResponse =
  | { type: "success"; data: RegistroEmailSuccess["data"] }
  | { type: "duplicate"; message: string }
  | { type: "validation"; message: string; fieldErrors?: string[] }
  | { type: "network"; message: string };

// Servicio
export async function registerEmail(
  agenciaId: number,
  email: string
): Promise<RegistroEmailResponse> {
  try {
    const res = await fetch(
      "https://travelconnect.com.ar/registrar-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agencia_id: agenciaId, email }),
      }
    );

    if (res.status === 201) {
      const json: RegistroEmailSuccess = await res.json();
      return { type: "success", data: json.data };
    }

    if (res.status === 409) {
      const json: RegistroEmailError = await res.json();
      return { type: "duplicate", message: json.message };
    }

    if (res.status === 422) {
      const json: RegistroEmailError = await res.json();
      return {
        type: "validation",
        message: json.message,
        fieldErrors: json.errors?.email || [],
      };
    }

    const fallbackText = await res.text();
    return { type: "network", message: fallbackText || "Error desconocido." };
  } catch {
    return { type: "network", message: "No se pudo conectar al servidor." };
  }
}

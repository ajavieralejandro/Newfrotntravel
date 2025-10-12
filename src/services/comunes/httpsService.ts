// src/servicios/generales/httpService.ts

interface HttpOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: BodyInit;
}

/**
 * Realiza una solicitud HTTP genérica.
 * @param url - URL del endpoint.
 * @param options - Opciones de la solicitud (método, headers, body, etc.).
 * @returns Respuesta de la solicitud.
 */
export const httpRequest = async <T>(url: string, options: HttpOptions = {}): Promise<T> => {
    try {
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: options.headers || {},
            body: options.body || null,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: T = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud HTTP:', error);
        throw error;
    }
};
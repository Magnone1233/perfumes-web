import { API_CONFIG } from "../config/api.config";

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

class ApiClient {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, signal, headers = {} } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const combinedSignal = signal ?? controller.signal;

    const isFormData = body instanceof FormData;
    const requestHeaders = new Headers(headers);
    if (!isFormData) {
      requestHeaders.set("Content-Type", "application/json");
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body
          ? isFormData
            ? (body as FormData)
            : JSON.stringify(body)
          : undefined,
        signal: combinedSignal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let message = "Error en la peticion";

        try {
          const payload = (await response.json()) as { message?: string };
          message = payload.message ?? message;
        } catch {
          message = response.statusText || message;
        }

        throw new Error(message);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        return (await response.json()) as T;
      }

      return (await response.text()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Tiempo de espera agotado al consultar la API.", {
          cause: error,
        });
      }

      if (error instanceof Error) {
        throw new Error(error.message, { cause: error });
      }

      throw new Error("Error inesperado al consultar la API.", {
        cause: error,
      });
    }
  }

  get<T>(endpoint: string, signal?: AbortSignal) {
    return this.request<T>(endpoint, { method: "GET", signal });
  }

  post<T>(endpoint: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "POST", body, headers });
  }

  patch<T>(endpoint: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "PATCH", body, headers });
  }

  delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }
}

export const apiClient = new ApiClient();

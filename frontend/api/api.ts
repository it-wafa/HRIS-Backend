import { API_URL } from "./const";
import type { LoginResponse } from "@/types/auth";

// ============================================
// TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiError {
  statusCode: number;
  message: string;
}

// ============================================
// API CALL WRAPPER
// ============================================

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("token");
  
  const makeRequest = async (authToken: string | null) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers as Record<string, string>,
    };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    
    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers,
    });
  };

  let response = await makeRequest(token);
  let data;
  try {
    data = await response.json();
  } catch {
    // Handling case where response is not JSON
    data = { status: response.ok, statusCode: response.status, message: response.statusText };
  }

  // Auto-refresh pada 401 dengan message "token_expired"
  if (response.status === 401 && (data.message === "token_expired" || data.message === "token expired")) {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        const refreshData = await refreshRes.json();
        
        if (refreshRes.ok && refreshData.status) {
          // Simpan token baru
          localStorage.setItem("token", refreshData.data.token);
          localStorage.setItem("refresh_token", refreshData.data.refresh);
          
          // Retry original request dengan token baru
          response = await makeRequest(refreshData.data.token);
          data = await response.json();
        } else {
          // Refresh gagal → force logout
          localStorage.clear();
          window.location.href = "/login";
          throw { statusCode: 401, message: "Session expired" };
        }
      } catch {
        localStorage.clear();
        window.location.href = "/login";
        throw { statusCode: 401, message: "Session expired" };
      }
    }
  }

  if (!response.ok || data.status === false) {
    const error: ApiError = {
      statusCode: data.statusCode || response.status,
      message: data.message || "Something went wrong",
    };
    throw error;
  }

  return data as ApiResponse<T>;
}

// ============================================
// AUTH API
// ============================================

/** POST /auth/login */
export async function loginApi(email: string, password: string) {
  return apiCall<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/** POST /auth/logout */
export async function logoutApi() {
  return apiCall<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}

/** POST /auth/refresh */
export async function refreshTokenApi(refresh_token: string) {
  return apiCall<{ token: string; refresh: string }>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
  });
}

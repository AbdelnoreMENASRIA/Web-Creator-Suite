/**
 * Centralized API client with proper URL resolution
 * Handles both development and production environments
 */

// Determine the API base URL with fallback chain:
// 1. Use VITE_API_URL from build environment (Render injects this)
// 2. Fallback to production Render URL if on production domain
// 3. Fallback to localhost for development
export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;

  // If VITE_API_URL is defined at build time, use it
  if (envUrl && envUrl.trim() && envUrl !== "http://localhost:10000") {
    return envUrl;
  }

  // Check if we're on a production domain
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isProduction =
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      hostname !== "0.0.0.0";

    if (isProduction) {
      return "https://teach-in-english-api.onrender.com";
    }
  }

  // Development fallback
  return "http://localhost:10000";
}

const API_BASE = getApiBaseUrl();

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiCall(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem("tie_token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Important for CORS with credentials
  });

  return response;
}

export async function apiCallJson<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await apiCall(endpoint, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

export { API_BASE };

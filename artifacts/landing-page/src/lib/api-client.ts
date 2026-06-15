/**
 * Centralized API client with production URL hardcoded
 * Handles both development and production environments
 */

// PRODUCTION API URL - Hardcoded to ensure it's always available
const PRODUCTION_API_URL = "https://teach-in-english-api.onrender.com/api";

// Determine the API base URL
export function getApiBaseUrl(): string {
  // Check if we're in development environment
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isDevelopment =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    // Use localhost for development
    if (isDevelopment) {
      return "http://localhost:10000";
    }
  }

  // Always use the hardcoded production URL for any non-localhost environment
  return PRODUCTION_API_URL;
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

  console.log(`API Call: ${options.method || "GET"} ${url}`);

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
    let errorMessage = `HTTP ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch (e) {
      // If response is not JSON, use the HTTP status message
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export { API_BASE, PRODUCTION_API_URL };

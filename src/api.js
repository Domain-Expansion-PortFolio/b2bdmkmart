// API Client for DMK Mart Frontend
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

// Common request function: automatically attaches Authorization header if token exists
export async function apiRequest(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Network or server unreachable error
    throw new Error("Unable to connect to server. Please ensure the backend is running.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Response did not contain valid JSON
  }

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }
  return data;
}
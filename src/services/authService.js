import { apiRequest, saveToken, clearToken } from "../api";

// Determine dashboard redirect path based on user role / portal
export function getRedirectPath(portal) {
  switch (portal) {
    case "customer":
      return "/customer/dashboard";
    case "salesman":
    case "sales":
      return "/salesman/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

// POST /auth/login -> { token, user, role, portal }
export async function login(identifier, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: { identifier, password },
  });

  if (data.token) {
    saveToken(data.token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    const role = data.user?.role || data.role || data.portal || "customer";
    localStorage.setItem("role", role);
    localStorage.setItem("portal", data.portal || role);
  }

  return data;
}

// POST /auth/send-otp -> { success, message, otp? }
export async function sendOtp(mobile) {
  return await apiRequest("/auth/send-otp", {
    method: "POST",
    body: { mobile },
  });
}

// POST /auth/verify-otp -> { token, user, role, portal }
export async function verifyOtp(mobile, otp) {
  const data = await apiRequest("/auth/verify-otp", {
    method: "POST",
    body: { mobile, otp },
  });

  if (data.token) {
    saveToken(data.token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    const role = data.user?.role || data.role || data.portal || "customer";
    localStorage.setItem("role", role);
    localStorage.setItem("portal", data.portal || role);
  }

  return data;
}

// POST /auth/register -> { token, user, role, portal }
export async function register(userData) {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: userData,
  });

  if (data.token) {
    saveToken(data.token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    const role = data.user?.role || data.role || data.portal || "customer";
    localStorage.setItem("role", role);
    localStorage.setItem("portal", data.portal || role);
  }

  return data;
}

// Log out user and clear stored authentication state
export function logout() {
  clearToken();
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("portal");
}
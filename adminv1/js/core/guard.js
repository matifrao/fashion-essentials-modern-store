import { authApi } from "./api.js";
import { storage } from "./storage.js";

export async function requireAdmin() {
  if (!storage.getToken()) { location.href = new URL("../../login.html", import.meta.url); return false; }
  try { await authApi.me(); return true; }
  catch { storage.logout(); location.href = new URL("../../login.html", import.meta.url); return false; }
}

import { SUPABASE_CONFIG } from "../supabase-config.js";
import { storage } from "./storage.js";

const configured = () => SUPABASE_CONFIG.url.startsWith("https://") && !SUPABASE_CONFIG.url.includes("YOUR-PROJECT") && !SUPABASE_CONFIG.anonKey.includes("YOUR-");
const ready = () => { if (!configured()) throw new Error("Supabase is not configured. Update adminv1/js/supabase-config.js first."); };
const headers = (extra = {}) => ({ apikey: SUPABASE_CONFIG.anonKey, Authorization: `Bearer ${storage.getToken() || SUPABASE_CONFIG.anonKey}`, ...extra });
async function data(response) { const body = await response.json().catch(() => null); if (!response.ok) throw new Error(body?.message || body?.error_description || body?.hint || "Supabase request failed."); return body; }

export const supabase = {
  configured,
  async login(email, password) {
    ready();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const result = await data(await fetch(`${SUPABASE_CONFIG.url}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { apikey: SUPABASE_CONFIG.anonKey, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      }));
      storage.setToken(result.access_token);
      storage.setUser(result.user);
      return result;
    } catch (error) {
      if (error.name === "AbortError") throw new Error("Supabase did not respond. Check that the Supabase project is active and that its URL/key are correct.");
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  },
  async logout() { if (configured() && storage.getToken()) await fetch(`${SUPABASE_CONFIG.url}/auth/v1/logout`, { method: "POST", headers: headers() }); storage.logout(); },
  async user() { ready(); return data(await fetch(`${SUPABASE_CONFIG.url}/auth/v1/user`, { headers: headers() })); },
  async select(table, query = "") { ready(); return data(await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}?${query}`, { headers: headers() })); },
  async insert(table, value) { ready(); return data(await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}`, { method: "POST", headers: headers({ "Content-Type": "application/json", Prefer: "return=representation" }), body: JSON.stringify(value) })); },
  async update(table, id, value) { ready(); return data(await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: headers({ "Content-Type": "application/json", Prefer: "return=representation" }), body: JSON.stringify(value) })); },
  async remove(table, id) { ready(); return data(await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: headers({ Prefer: "return=representation" }) })); },
  async upload(file) {
  ready();

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`${file.name} is larger than 5 MB.`);
  }

  const path =
    `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

  await data(
    await fetch(
      `${SUPABASE_CONFIG.url}/storage/v1/object/product-images/${path}`,
      {
        method: "POST",
        headers: headers({
          "Content-Type": file.type,
          "x-upsert": "false"
        }),
        body: file
      }
    )
  );

  return `${SUPABASE_CONFIG.url}/storage/v1/object/public/product-images/${path}`;
}};

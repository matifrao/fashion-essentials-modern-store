import { authApi } from "../core/api.js";
import { requireAdmin } from "../core/guard.js";

export async function startShell(page, content) {
  if (!await requireAdmin()) return false;
  const user = await authApi.me().catch(() => null);
  document.body.className = "commerce";
  const nested = location.pathname.includes("/products/");
  const home = nested ? "../dashboard.html" : "dashboard.html";
  const products = nested ? "products.html" : "products/products.html";
  const orders = nested ? "../orders.html" : "orders.html";
  const blogs = nested ? "../blogs.html" : "blogs.html";
  const titles = { dashboard: "Dashboard", products: "Products", orders: "Orders", blogs: "Blog posts" };
  document.body.innerHTML = `<div class="shell"><aside class="side"><div class="brand">Fashion <b>Essentials</b></div><small>Overview</small><a href="${home}" class="${page === "dashboard" ? "active" : ""}">▦ Dashboard</a><small>Catalogue</small><a href="${products}" class="${page === "products" ? "active" : ""}">◈ Products</a><a href="#" aria-disabled="true">▤ Categories</a><a href="#" aria-disabled="true">◉ Inventory</a><small>Sales</small><a href="${orders}" class="${page === "orders" ? "active" : ""}">🧾 Orders</a><small>Content</small><a href="${blogs}" class="${page === "blogs" ? "active" : ""}">✎ Blog posts</a><small>Account</small><a href="#" id="logout">↪ Sign out</a></aside><main class="main"><header class="top"><h1>${titles[page] || ""}</h1><div class="top-right"><span>${user?.email || "Admin"}</span><div class="avatar">${(user?.email || "A").slice(0,1).toUpperCase()}</div></div></header><div class="content">${content}</div></main></div>`;
  document.getElementById("logout").onclick = async event => { event.preventDefault(); await authApi.logout(); location.href = nested ? "../login.html" : "login.html"; };
  return true;
}

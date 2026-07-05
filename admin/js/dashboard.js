async function loadComponent(id, file) {
  const element = document.getElementById(id);

  if (!element) return;

  try {
    const response = await fetch(file);
    element.innerHTML = await response.text();
  } catch (error) {
    console.error(`Unable to load ${file}`, error);
  }
}

function adminImagePath(path) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  if (path.startsWith("../")) return path;
  return `../${path}`;
}

function renderDashboardStats(products) {
  const statValues = document.querySelectorAll(".stat-card strong");
  const categories = new Set(products.map((product) => product.category).filter(Boolean));
  const lowStock = products.filter((product) => Number(product.stock) <= 5);
  const featured = products.filter((product) => product.status === "Active");

  if (statValues[0]) statValues[0].textContent = products.length;
  if (statValues[1]) statValues[1].textContent = categories.size;
  if (statValues[2]) statValues[2].textContent = lowStock.length;
  if (statValues[3]) statValues[3].textContent = featured.length;
}

function renderRecentProducts(products) {
  const table = document.getElementById("recent-products");

  if (!table) return;

  table.innerHTML = products
    .slice(0, 5)
    .map(
      (product) => `
        <tr>
          <td><img class="table-image" src="${adminImagePath(product.image)}" alt="${product.name}"></td>
          <td>${product.name}</td>
          <td>${product.category || "-"}</td>
          <td>${product.price}</td>
          <td>${product.stock}</td>
          <td><span class="status-badge">${product.status || "Active"}</span></td>
          <td><a href="add-product.html?id=${product.id}">Edit</a></td>
        </tr>
      `
    )
    .join("");
}

async function logout() {
  await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
  window.location.href = "login.html";
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-logout]")) {
    event.preventDefault();
    logout();
  }
});

async function initDashboard() {
  await Promise.all([
    loadComponent("sidebar", "components/sidebar.html"),
    loadComponent("topbar", "components/topbar.html"),
  ]);

  if (typeof FashionProducts === "undefined") return;

  const products = await FashionProducts.getProducts();
  renderDashboardStats(products);
  renderRecentProducts(products);
}

initDashboard();

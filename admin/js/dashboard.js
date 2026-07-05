/* ==========================================
            LOAD COMPONENTS
========================================== */

async function loadComponent(id, file) {

    try {

        const response = await fetch(file);

        const html = await response.text();

        document.getElementById(id).innerHTML = html;

    } catch (error) {

        console.error(`Unable to load ${file}`, error);

    }

}

/* ==========================================
            LOAD SIDEBAR & TOPBAR
========================================== */

loadComponent("sidebar", "components/sidebar.html");
loadComponent("topbar", "components/topbar.html");

function renderDashboardStats() {
    if (typeof FashionProducts === "undefined") return;

    const products = FashionProducts.getProducts();
    const statValues = document.querySelectorAll(".stat-card strong");
    const categories = new Set(products.map((product) => product.category).filter(Boolean));
    const lowStock = products.filter((product) => Number(product.stock) <= 5);
    const featured = products.filter((product) => product.status === "Active");

    if (statValues[0]) statValues[0].textContent = products.length;
    if (statValues[1]) statValues[1].textContent = categories.size;
    if (statValues[2]) statValues[2].textContent = lowStock.length;
    if (statValues[3]) statValues[3].textContent = featured.length;
}

function renderRecentProducts() {
    const table = document.getElementById("recent-products");

    if (!table || typeof FashionProducts === "undefined") return;

    table.innerHTML = FashionProducts.getProducts()
        .slice(-5)
        .reverse()
        .map((product) => `
            <tr>
                <td><img class="table-image" src="${adminImagePath(product.image)}" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>${product.category || "-"}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td><span class="status-badge">${product.status || "Active"}</span></td>
                <td><a href="add-product.html?id=${product.id}">Edit</a></td>
            </tr>
        `)
        .join("");
}

function adminImagePath(path) {
    if (!path) return "";
    if (/^(https?:|data:|blob:)/.test(path)) return path;
    if (path.startsWith("../")) return path;
    return `../${path}`;
}

renderDashboardStats();
renderRecentProducts();

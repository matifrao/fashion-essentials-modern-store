function renderProductsTable() {
  const table = document.getElementById("products-table");

  if (!table) return;

  const products = FashionProducts.getProducts();

  table.innerHTML = products
    .map(
      (product) => `
        <tr>
          <td><img class="table-image" src="${adminImagePath(product.image)}" alt="${product.name}"></td>
          <td>
            <strong>${product.name}</strong>
            <span>${(product.colors || []).join(", ")}</span>
          </td>
          <td>${product.category || "-"}</td>
          <td>${product.price}</td>
          <td>${product.stock}</td>
          <td><span class="status-badge">${product.status || "Active"}</span></td>
          <td>
            <div class="table-actions">
              <a href="add-product.html?id=${product.id}">Edit</a>
              <button type="button" data-delete="${product.id}">Remove</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

function adminImagePath(path) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  if (path.startsWith("../")) return path;
  return `../${path}`;
}

function fillProductForm() {
  const form = document.getElementById("product-form");

  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const product = FashionProducts.getProduct(params.get("id"));

  if (!product) return;

  document.getElementById("form-title").textContent = "Edit Product";
  document.getElementById("product-id").value = product.id;
  document.getElementById("product-name").value = product.name || "";
  document.getElementById("product-category").value = product.category || "";
  document.getElementById("product-price").value = product.price || "";
  document.getElementById("product-stock").value = product.stock || 0;
  document.getElementById("product-status").value = product.status || "Active";
  document.getElementById("product-image").value = product.image || "";
  document.getElementById("product-images").value = (product.images || []).join(", ");
  document.getElementById("product-colors").value = (product.colors || []).join(", ");
  document.getElementById("product-sizes").value = (product.sizes || []).join(", ");
  document.getElementById("product-description").value = product.description || "";
  document.getElementById("product-related").value = (product.related || []).join(", ");
}

document.addEventListener("submit", (event) => {
  if (event.target.id !== "product-form") return;

  event.preventDefault();

  const existingId = document.getElementById("product-id").value;
  const name = document.getElementById("product-name").value.trim();
  const image = document.getElementById("product-image").value.trim();
  const otherImages = FashionProducts.splitList(
    document.getElementById("product-images").value
  );

  FashionProducts.upsertProduct({
    id: existingId || FashionProducts.slugify(name),
    name,
    category: document.getElementById("product-category").value.trim(),
    price: document.getElementById("product-price").value.trim(),
    stock: document.getElementById("product-stock").value,
    status: document.getElementById("product-status").value,
    image,
    images: [image, ...otherImages.filter((item) => item !== image)],
    colors: FashionProducts.splitList(document.getElementById("product-colors").value),
    sizes: FashionProducts.splitList(document.getElementById("product-sizes").value),
    description: document.getElementById("product-description").value.trim(),
    related: FashionProducts.splitList(document.getElementById("product-related").value),
  });

  window.location.href = "products.html";
});

document.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete]");

  if (deleteButton) {
    FashionProducts.deleteProduct(deleteButton.dataset.delete);
    renderProductsTable();
  }

  if (event.target.id === "reset-products") {
    localStorage.removeItem("fashionProducts");
    FashionProducts.getProducts();
    renderProductsTable();
  }
});

renderProductsTable();
fillProductForm();

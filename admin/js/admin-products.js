let cachedProducts = [];

async function loadProducts() {
  cachedProducts = await FashionProducts.getProducts();
  return cachedProducts;
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function adminImagePath(path) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  if (path.startsWith("../")) return path;
  return `../${path}`;
}

function getAvailableOptions(key, fallback = []) {
  const fromProducts = cachedProducts.flatMap((product) => {
    const value = product[key];
    return Array.isArray(value) ? value : [value];
  });

  return uniqueValues([...fallback, ...fromProducts]);
}

function renderProductsTable() {
  const table = document.getElementById("products-table");

  if (!table) return;

  if (!cachedProducts.length) {
    table.innerHTML = `
      <tr>
        <td colspan="7">No products found.</td>
      </tr>
    `;
    return;
  }

  table.innerHTML = cachedProducts
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

function populateProductOptions() {
  const categoryList = document.getElementById("category-options");
  const colorPicker = document.getElementById("color-picker");
  const sizePicker = document.getElementById("size-picker");

  if (categoryList) {
    categoryList.innerHTML = getAvailableOptions("category", [
      "Caps",
      "Hijab",
      "Abaya",
      "Dress",
      "Shawl",
    ])
      .map((category) => `<option value="${category}"></option>`)
      .join("");
  }

  if (colorPicker) {
    colorPicker.innerHTML = `<option value="">Choose color</option>${getAvailableOptions(
      "colors",
      ["black", "cream", "beige", "navy", "olive", "camel", "grey", "pink"]
    )
      .map((color) => `<option value="${color}">${color}</option>`)
      .join("")}`;
  }

  if (sizePicker) {
    sizePicker.innerHTML = `<option value="">Choose size</option>${getAvailableOptions(
      "sizes",
      ["Free Size", "XS", "S", "M", "L", "XL"]
    )
      .map((size) => `<option value="${size}">${size}</option>`)
      .join("")}`;
  }
}

function getChipValues(type) {
  const input = document.getElementById(`product-${type}s`);
  return FashionProducts.splitList(input?.value || "");
}

function setChipValues(type, values) {
  const input = document.getElementById(`product-${type}s`);
  const chips = document.getElementById(`${type}-chips`);
  const cleanValues = uniqueValues(values.map((value) => value.trim()));

  if (!input || !chips) return;

  input.value = cleanValues.join(", ");
  chips.innerHTML = cleanValues
    .map(
      (value) => `
        <button class="option-chip" type="button" data-remove-option="${type}" data-value="${value}">
          ${value}
        </button>
      `
    )
    .join("");
}

function addOption(type) {
  const picker = document.getElementById(`${type}-picker`);
  const newInput = document.getElementById(`new-${type}`);
  const value = (newInput?.value || picker?.value || "").trim();

  if (!value) return;

  setChipValues(type, [...getChipValues(type), value]);

  if (newInput) newInput.value = "";
  if (picker) picker.value = "";
}

function updateImagePreview(value) {
  const preview = document.getElementById("product-image-preview");
  const hidden = document.getElementById("product-image");
  const pathInput = document.getElementById("product-image-path");

  if (hidden) hidden.value = value || "";
  if (pathInput && value && !value.startsWith("data:")) pathInput.value = value;
  if (!preview) return;

  if (value) {
    preview.src = adminImagePath(value);
    preview.classList.add("has-image");
  } else {
    preview.removeAttribute("src");
    preview.classList.remove("has-image");
  }
}

function fillProductForm() {
  const form = document.getElementById("product-form");

  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const product = cachedProducts.find((item) => item.id === params.get("id"));

  setChipValues("color", product?.colors || []);
  setChipValues("size", product?.sizes || []);

  if (!product) return;

  document.getElementById("form-title").textContent = "Edit Product";
  document.getElementById("product-id").value = product.id;
  document.getElementById("product-name").value = product.name || "";
  document.getElementById("product-category").value = product.category || "";
  document.getElementById("product-price").value = product.price || "";
  document.getElementById("product-stock").value = product.stock || 0;
  document.getElementById("product-status").value = product.status || "Active";
  updateImagePreview(product.image || "");
  document.getElementById("product-images").value = (product.images || []).join(", ");
  document.getElementById("product-description").value = product.description || "";
  document.getElementById("product-related").value = (product.related || []).join(", ");
}

document.addEventListener("submit", async (event) => {
  if (event.target.id !== "product-form") return;

  event.preventDefault();

  const existingId = document.getElementById("product-id").value;
  const name = document.getElementById("product-name").value.trim();
  const image = document.getElementById("product-image").value.trim();
  const otherImages = FashionProducts.splitList(
    document.getElementById("product-images").value
  );

  if (!image) {
    window.alert("Please upload a product image or paste an image path / URL.");
    return;
  }

  try {
    await FashionProducts.upsertProduct({
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
  } catch (error) {
    window.alert(error.message);
  }
});

document.addEventListener("click", async (event) => {
  const optionButton = event.target.closest("[data-add-option]");

  if (optionButton) {
    addOption(optionButton.dataset.addOption);
  }

  const removeOptionButton = event.target.closest("[data-remove-option]");

  if (removeOptionButton) {
    const type = removeOptionButton.dataset.removeOption;
    const value = removeOptionButton.dataset.value;
    setChipValues(
      type,
      getChipValues(type).filter((item) => item !== value)
    );
  }

  const deleteButton = event.target.closest("[data-delete]");

  if (deleteButton) {
    await FashionProducts.deleteProduct(deleteButton.dataset.delete);
    await loadProducts();
    renderProductsTable();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "color-picker" && event.target.value) {
    addOption("color");
  }

  if (event.target.id === "size-picker" && event.target.value) {
    addOption("size");
  }

  if (event.target.id === "product-image-upload") {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => updateImagePreview(reader.result));
    reader.readAsDataURL(file);
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "product-image-path") {
    updateImagePreview(event.target.value.trim());
  }
});

async function initAdminProducts() {
  try {
    await loadProducts();
    populateProductOptions();
    renderProductsTable();
    fillProductForm();
  } catch (error) {
    const table = document.getElementById("products-table");
    if (table) table.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;
  }
}

initAdminProducts();

const detail = document.getElementById("product-detail");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const fallbackColorHex = {
  cream: "#f6f0e7",
  beige: "#d8c3a5",
  navy: "#0b1f33",
  olive: "#6b705c",
  burgundy: "#6f1d1b",
  camel: "#c19a6b",
  grey: "#8d99ae",
  gray: "#8d99ae",
  pink: "#f8c8dc",
  mint: "#95d5b2",
  lavender: "#b8a1e3",
};

// Colors are saved by the admin as objects: { name, hex, image }.
// This also supports plain strings in case any older product data exists.
function colorName(color) {
  return typeof color === "string" ? color : color?.name || "";
}

function colorSwatchHex(color) {
  if (typeof color === "string") {
    return fallbackColorHex[color.toLowerCase()] || color;
  }
  return color?.hex || fallbackColorHex[(color?.name || "").toLowerCase()] || "#ccc";
}

function colorImage(color) {
  return typeof color === "object" ? color?.image || "" : "";
}

function colorMarkup(colors) {
  return (colors || [])
    .map((color, index) => {
      const name = colorName(color);

      return `<span
        class="color${index === 0 ? " selected" : ""}"
        data-color="${name}"
        data-image="${colorImage(color)}"
        title="${name}"
        style="background:${colorSwatchHex(color)}"
      ></span>`;
    })
    .join("");
}

function sizeMarkup(sizes) {
  return (sizes || [])
    .map(
      (size, index) =>
        `<span class="size${index === 0 ? " selected" : ""}" data-size="${size}">${size}</span>`
    )
    .join("");
}

function notFound() {
  detail.innerHTML = `
    <section class="product-not-found">
      <h1>Product not found</h1>
      <p>This product is unavailable or has been removed.</p>
      <a href="shop.html">Back to Shop</a>
    </section>
  `;
}

async function loadProduct() {
  try {
    const product = await FashionProducts.getProduct(productId);
    const allProducts = await FashionProducts.getProducts();
    const relatedProducts = (product.related || [])
      .map((name) => allProducts.find((item) => item.name === name || item.id === name))
      .filter(Boolean);

    const pricing = FashionProducts.getPricing(product);
    const firstColor = (product.colors || [])[0];
    const mainImage = colorImage(firstColor) || product.image || (product.images || [])[0] || "";

    detail.innerHTML = `
      <section class="product-detail">
        <div class="product-gallery">
          <img id="main-product-image" src="${mainImage}" alt="${product.name}">
        </div>

        <div class="product-info">
          <span>${product.category || "Fashion Essentials"}</span>
          <h1>${product.name}</h1>
          ${FashionProducts.priceMarkup(product)}
          <p>${product.description || ""}</p>

          <div class="product-options">
            <strong>Colors</strong>
            <div class="colors" id="color-options">${colorMarkup(product.colors)}</div>
          </div>

          <div class="product-options">
            <strong>Sizes</strong>
            <div class="size-list" id="size-options">${sizeMarkup(product.sizes)}</div>
          </div>

          <button
            class="add-cart"
            id="add-to-cart"
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${pricing.effective}"
            data-color="${colorName(firstColor)}"
            data-size="${(product.sizes || [])[0] || ""}"
          >
            Add to Cart
          </button>
        </div>
      </section>

      <section class="related-products">
        <h2>Related Products</h2>
        <div class="product-grid">
          ${relatedProducts
            .map(
              (item) => `
                <article class="product-card">
                  <a href="product.html?id=${item.id}" class="product-link">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                  </a>
                  ${FashionProducts.priceMarkup(item)}
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;

    wireOptionSelectors();
  } catch (error) {
    notFound();
  }
}

function wireOptionSelectors() {
  const colorOptions = document.getElementById("color-options");
  const sizeOptions = document.getElementById("size-options");
  const addButton = document.getElementById("add-to-cart");
  const mainImage = document.getElementById("main-product-image");

  if (colorOptions) {
    colorOptions.addEventListener("click", (event) => {
      const swatch = event.target.closest(".color");

      if (!swatch) return;

      colorOptions
        .querySelectorAll(".color")
        .forEach((el) => el.classList.remove("selected"));

      swatch.classList.add("selected");
      addButton.dataset.color = swatch.dataset.color;

      if (mainImage && swatch.dataset.image) {
        mainImage.src = swatch.dataset.image;
      }
    });
  }

  if (sizeOptions) {
    sizeOptions.addEventListener("click", (event) => {
      const size = event.target.closest(".size");

      if (!size) return;

      sizeOptions
        .querySelectorAll(".size")
        .forEach((el) => el.classList.remove("selected"));

      size.classList.add("selected");
      addButton.dataset.size = size.dataset.size;
    });
  }
}

loadProduct();

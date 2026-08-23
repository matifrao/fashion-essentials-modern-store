const detail = document.getElementById("product-detail");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const legacyColorMap = {
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

function resolveColor(color) {
  // Admin panel saves colors as { name, hex, image }. Older products may
  // still have plain color-name strings, so support both formats.
  if (color && typeof color === "object") {
    return {
      name: color.name || "",
      hex: color.hex || legacyColorMap[String(color.name).toLowerCase()] || "#cccccc",
      image: color.image || "",
    };
  }

  const name = String(color || "");
  return {
    name,
    hex: legacyColorMap[name.toLowerCase()] || "#cccccc",
    image: "",
  };
}

function colorMarkup(colors) {
  return (colors || [])
    .map((color, index) => {
      const c = resolveColor(color);

      return `<button
        type="button"
        class="color-swatch${index === 0 ? " active" : ""}"
        data-index="${index}"
        data-name="${c.name}"
        data-image="${c.image}"
        title="${c.name}"
        style="background:${c.hex}"
        aria-label="Select color ${c.name}"
      ></button>`;
    })
    .join("");
}

function bindColorSwatches(product) {
  const swatches = Array.from(detail.querySelectorAll(".colors .color-swatch"));
  if (!swatches.length) return;

  const mainImage = document.getElementById("mainProductImage");
  const addCartButton = detail.querySelector(".add-cart");

  function selectSwatch(swatch) {
    swatches.forEach((s) => s.classList.remove("active"));
    swatch.classList.add("active");

    if (addCartButton) {
      addCartButton.dataset.color = swatch.dataset.name;
    }

    if (mainImage && swatch.dataset.image) {
      mainImage.src = swatch.dataset.image;
    }
  }

  swatches.forEach((swatch) => {
    swatch.addEventListener("click", () => selectSwatch(swatch));
  });

  // Default: first color pre-selected, matching the active swatch on load
  if ((product.colors || []).length) {
    const firstColor = resolveColor(product.colors[0]);

    if (addCartButton) {
      addCartButton.dataset.color = firstColor.name;
    }

    if (mainImage && firstColor.image) {
      mainImage.src = firstColor.image;
    }
  }
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

    detail.innerHTML = `
      <section class="product-detail">
        <div class="product-gallery">
          <img id="mainProductImage" src="${product.image}" alt="${product.name}">
        </div>

        <div class="product-info">
          <span>${product.category || "Fashion Essentials"}</span>
          <h1>${product.name}</h1>
          ${FashionProducts.priceMarkup(product)}
          <p>${product.description || ""}</p>

          <div class="product-options">
            <strong>Colors</strong>
            <div class="colors">${colorMarkup(product.colors)}</div>
          </div>

          <div class="product-options">
            <strong>Sizes</strong>
            <div class="size-list">
              ${(product.sizes || []).map((size) => `<span>${size}</span>`).join("")}
            </div>
          </div>

          <button
            class="add-cart"
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${pricing.effective}"
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

    bindColorSwatches(product);
  } catch (error) {
    notFound();
  }
}

loadProduct();
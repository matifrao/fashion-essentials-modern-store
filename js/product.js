const detail = document.getElementById("product-detail");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

function colorMarkup(colors) {
  const colorMap = {
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

  return (colors || [])
    .map(
      (color) =>
        `<span class="color" title="${color}" style="background:${
          colorMap[String(color).toLowerCase()] || color
        }"></span>`
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

    detail.innerHTML = `
      <section class="product-detail">
        <div class="product-gallery">
          ${(product.images || [product.image])
            .map((image) => `<img src="${image}" alt="${product.name}">`)
            .join("")}
        </div>

        <div class="product-info">
          <span>${product.category || "Fashion Essentials"}</span>
          <h1>${product.name}</h1>
          <p class="price">${product.price}</p>
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
            data-price="${product.price}"
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
                  <p class="price">${item.price}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  } catch (error) {
    notFound();
  }
}

loadProduct();

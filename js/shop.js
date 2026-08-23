const grid = document.getElementById("product-grid");
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

function swatchColor(color) {
  // Admin panel saves colors as { name, hex, image }. Older products may
  // still have plain color-name strings, so support both.
  if (color && typeof color === "object") {
    return color.hex || colorMap[String(color.name).toLowerCase()] || "#cccccc";
  }

  return colorMap[String(color).toLowerCase()] || "#cccccc";
}

function colorName(color) {
  return color && typeof color === "object" ? color.name || "" : String(color || "");
}

function colorImage(color) {
  return color && typeof color === "object" ? color.image || "" : "";
}

function renderProducts(products) {
  const activeProducts = products.filter((product) => product.status !== "Draft");

  if (!activeProducts.length) {
    grid.innerHTML = `<p class="empty-state">No products available yet.</p>`;
    return;
  }

  grid.innerHTML = activeProducts
    .map((product) => {
      const pricing = FashionProducts.getPricing(product);

      return `
        <article class="product-card">
          <a href="product.html?id=${product.id}" class="product-link">
            <img class="product-card-image" src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
          </a>

          ${FashionProducts.priceMarkup(product)}
          <p class="product-description">${product.description || ""}</p>

          <div class="colors">
            ${(product.colors || [])
              .map(
                (color, index) =>
                  `<button
                    type="button"
                    class="color-swatch${index === 0 ? " active" : ""}"
                    data-name="${colorName(color)}"
                    data-image="${colorImage(color)}"
                    title="${colorName(color)}"
                    style="background:${swatchColor(color)}"
                    aria-label="Preview color ${colorName(color)}"
                  ></button>`
              )
              .join("")}
          </div>

          <button
            class="add-cart"
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${pricing.effective}"
          >
            Add to Cart
          </button>
        </article>
      `;
    })
    .join("");
}

async function loadProducts() {
  try {
    renderProducts(await FashionProducts.getProducts());
  } catch (error) {
    grid.innerHTML = `
      <p class="empty-state">
        Products need the local server. Run node server.js and open http://localhost:3000/shop.html.
      </p>
    `;
  }
}

grid.addEventListener("click", (event) => {
  const swatch = event.target.closest(".color-swatch");
  if (!swatch) return;

  const card = swatch.closest(".product-card");
  if (!card) return;

  card
    .querySelectorAll(".color-swatch")
    .forEach((s) => s.classList.toggle("active", s === swatch));

  const image = card.querySelector(".product-card-image");
  if (image && swatch.dataset.image) {
    image.src = swatch.dataset.image;
  }
});

loadProducts();
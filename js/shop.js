const grid = document.getElementById("product-grid");
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

function swatchColor(color) {
  if (typeof color === "string") {
    return fallbackColorHex[color.toLowerCase()] || color;
  }
  return color?.hex || fallbackColorHex[(color?.name || "").toLowerCase()] || "#ccc";
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
      const firstColor = (product.colors || [])[0];

      return `
        <article class="product-card">
          <a href="product.html?id=${product.id}" class="product-link">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
          </a>

          ${FashionProducts.priceMarkup(product)}
          <p class="product-description">${product.description || ""}</p>

          <div class="colors">
            ${(product.colors || [])
              .map(
                (color) =>
                  `<span class="color" title="${colorName(color)}" style="background:${swatchColor(
                    color
                  )}"></span>`
              )
              .join("")}
          </div>

          <button
            class="add-cart"
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${pricing.effective}"
            data-color="${colorName(firstColor)}"
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

loadProducts();

const grid = document.getElementById("new-products");

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

  if (color && typeof color === "object") {
    return (
      color.hex ||
      colorMap[String(color.name).toLowerCase()] ||
      "#cccccc"
    );
  }

  return (
    colorMap[String(color).toLowerCase()] ||
    "#cccccc"
  );
}


function colorName(color) {

  return color && typeof color === "object"
    ? color.name || ""
    : String(color || "");

}


function colorImage(color) {

  return color && typeof color === "object"
    ? color.image || ""
    : "";

}


/*
==========================================================
SORT NEWEST PRODUCTS FIRST
==========================================================

Supabase normally provides created_at.

The additional checks make this safe if your existing
product object uses another date field.
==========================================================
*/

function productDate(product) {

  return (
    product.created_at ||
    product.createdAt ||
    product.created ||
    product.dateAdded ||
    ""
  );

}


function sortNewest(products) {

  return [...products].sort((a, b) => {

    const dateA = new Date(productDate(a)).getTime() || 0;
    const dateB = new Date(productDate(b)).getTime() || 0;

    return dateB - dateA;

  });

}


/*
==========================================================
RENDER PRODUCTS
==========================================================
*/

function renderProducts(products) {

  const activeProducts = products.filter(
    (product) => product.status !== "Draft"
  );


  if (!activeProducts.length) {

    grid.innerHTML = `
      <p class="empty-state">
        No new arrivals available yet.
      </p>
    `;

    return;
  }


  const newestProducts = sortNewest(activeProducts);


  grid.innerHTML = newestProducts
    .map((product) => {

      const pricing =
        FashionProducts.getPricing(product);


      return `
        <article class="product-card">

          <a
            href="product.html?id=${product.id}"
            class="product-link"
          >

            <img
              class="product-card-image"
              src="${product.image}"
              alt="${product.name}"
              loading="lazy"
            >

            <h3>${product.name}</h3>

          </a>


          ${FashionProducts.priceMarkup(product)}


          <p class="product-description">
            ${product.description || ""}
          </p>


          <div class="colors">

            ${(product.colors || [])
              .map(
                (color, index) =>
                  `
                  <button
                    type="button"
                    class="color-swatch${
                      index === 0 ? " active" : ""
                    }"
                    data-name="${colorName(color)}"
                    data-image="${colorImage(color)}"
                    title="${colorName(color)}"
                    style="background:${swatchColor(color)}"
                    aria-label="Preview color ${colorName(color)}"
                  ></button>
                  `
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


/*
==========================================================
LOAD PRODUCTS
==========================================================
*/

async function loadProducts() {

  try {

    const products =
      await FashionProducts.getProducts();

    renderProducts(products);

  } catch (error) {

    console.error(
      "Unable to load new arrivals:",
      error
    );

    grid.innerHTML = `
      <p class="empty-state">
        Unable to load new arrivals right now.
      </p>
    `;

  }

}


/*
==========================================================
COLOR SWATCH CLICK
==========================================================
*/

grid.addEventListener("click", (event) => {

  const swatch =
    event.target.closest(".color-swatch");

  if (!swatch) return;


  const card =
    swatch.closest(".product-card");

  if (!card) return;


  card
    .querySelectorAll(".color-swatch")
    .forEach((s) => {

      s.classList.toggle(
        "active",
        s === swatch
      );

    });


  const image =
    card.querySelector(".product-card-image");


  if (
    image &&
    swatch.dataset.image
  ) {

    image.src =
      swatch.dataset.image;

  }

});


/*
==========================================================
START
==========================================================
*/

loadProducts();
const detail = document.getElementById("product-detail");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const SITE_URL = "https://fashionessentials.store";

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


/*==========================================================
  SEO HELPERS
==========================================================*/

function cleanText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


function setMeta(name, content) {

  if (!content) return;

  let meta = document.querySelector(
    `meta[name="${name}"]`
  );

  if (!meta) {

    meta = document.createElement("meta");

    meta.setAttribute("name", name);

    document.head.appendChild(meta);

  }

  meta.setAttribute("content", content);
}


function setPropertyMeta(property, content) {

  if (!content) return;

  let meta = document.querySelector(
    `meta[property="${property}"]`
  );

  if (!meta) {

    meta = document.createElement("meta");

    meta.setAttribute("property", property);

    document.head.appendChild(meta);

  }

  meta.setAttribute("content", content);
}


function setCanonical(url) {

  let canonical =
    document.querySelector(
      'link[rel="canonical"]'
    );

  if (!canonical) {

    canonical = document.createElement("link");

    canonical.setAttribute(
      "rel",
      "canonical"
    );

    document.head.appendChild(canonical);

  }

  canonical.setAttribute(
    "href",
    url
  );
}


/*==========================================================
  PRODUCT SEO
==========================================================*/

function updateProductSEO(product) {

  const productName =
    cleanText(product.name);

  if (!productName) return;


  /*
    AdminV1 SEO title.

    If SEO title is empty, use the product name
    as a safe fallback.
  */

  const seoTitle =
    cleanText(product.metaTitle) ||
    `${productName} | Fashion Essentials`;


  /*
    AdminV1 Meta description.

    If empty, use the normal product description
    as fallback.
  */

  const seoDescription =
    cleanText(product.metaDescription) ||
    cleanText(product.description);


  /*
    IMPORTANT:

    We are keeping the CURRENT product URL structure.

    Example:
    /product.html?id=UUID

    We are NOT changing it to the slug yet.
  */

  const canonicalUrl =
    `${SITE_URL}/product.html?id=${encodeURIComponent(product.id)}`;


  /*
    Main document title
  */

  document.title = seoTitle;


  /*
    Standard SEO description
  */

  if (seoDescription) {

    setMeta(
      "description",
      seoDescription
    );

  }


  /*
    Open Graph
  */

  setPropertyMeta(
    "og:type",
    "product"
  );

  setPropertyMeta(
    "og:title",
    seoTitle
  );

  setPropertyMeta(
    "og:description",
    seoDescription
  );

  setPropertyMeta(
    "og:url",
    canonicalUrl
  );

  setPropertyMeta(
    "og:site_name",
    "Fashion Essentials"
  );


  /*
    Product image
  */

  if (product.image) {

    const imageUrl =
      new URL(
        product.image,
        window.location.href
      ).href;

    setPropertyMeta(
      "og:image",
      imageUrl
    );

    setMeta(
      "twitter:image",
      imageUrl
    );

  }


  /*
    Twitter / X
  */

  setMeta(
    "twitter:card",
    "summary_large_image"
  );

  setMeta(
    "twitter:title",
    seoTitle
  );

  setMeta(
    "twitter:description",
    seoDescription
  );


  /*
    Canonical
  */

  setCanonical(
    canonicalUrl
  );

}


/*==========================================================
  PRODUCT STRUCTURED DATA
==========================================================*/

function addProductSchema(product) {

  const existing =
    document.getElementById(
      "product-schema"
    );

  if (existing) {

    existing.remove();

  }


  const pricing =
    FashionProducts.getPricing(product);


  const productName =
    cleanText(product.name);


  const description =
    cleanText(
      product.description
    );


  const productUrl =
    `${SITE_URL}/product.html?id=${encodeURIComponent(product.id)}`;


  const schema = {

    "@context":
      "https://schema.org",

    "@type":
      "Product",

    "name":
      productName,

    "url":
      productUrl,

    "brand": {

      "@type":
        "Brand",

      "name":
        "Fashion Essentials"

    }

  };


  if (description) {

    schema.description =
      description;

  }


  /*
    Main product image
  */

  if (product.image) {

    schema.image = [

      new URL(
        product.image,
        window.location.href
      ).href

    ];

  }


  /*
    Category
  */

  if (product.category) {

    schema.category =
      cleanText(
        product.category
      );

  }


  /*
    SKU
  */

  if (product.sku) {

    schema.sku =
      String(product.sku);

  }


  /*
    Offer
  */

  if (
    pricing &&
    pricing.effective !== undefined &&
    pricing.effective !== null
  ) {

    schema.offers = {

      "@type":
        "Offer",

      "url":
        productUrl,

      "priceCurrency":
        "PKR",

      "price":
        Number(
          pricing.effective
        ),

      "availability":
        Number(product.stock) > 0

          ? "https://schema.org/InStock"

          : "https://schema.org/OutOfStock",

      "seller": {

        "@type":
          "Organization",

        "name":
          "Fashion Essentials",

        "url":
          SITE_URL

      }

    };

  }


  const script =
    document.createElement(
      "script"
    );


  script.id =
    "product-schema";

  script.type =
    "application/ld+json";

  script.textContent =
    JSON.stringify(schema);


  document.head.appendChild(
    script
  );

}


/*==========================================================
  COLOR HANDLING
==========================================================*/

function resolveColor(color) {

  if (
    color &&
    typeof color === "object"
  ) {

    return {

      name:
        color.name || "",

      hex:
        color.hex ||
        legacyColorMap[
          String(
            color.name
          ).toLowerCase()
        ] ||
        "#cccccc",

      image:
        color.image || ""

    };

  }


  const name =
    String(color || "");


  return {

    name,

    hex:
      legacyColorMap[
        name.toLowerCase()
      ] ||
      "#cccccc",

    image:
      ""

  };

}


function colorMarkup(colors) {

  return (colors || [])
    .map(
      (color, index) => {

        const c =
          resolveColor(color);


        return `

          <button
            type="button"
            class="color-swatch${index === 0 ? " active" : ""}"
            data-index="${index}"
            data-name="${c.name}"
            data-image="${c.image}"
            title="${c.name}"
            style="background:${c.hex}"
            aria-label="Select color ${c.name}"
          ></button>

        `;

      }
    )
    .join("");

}


/*==========================================================
  COLOR EVENTS
==========================================================*/

function bindColorSwatches(product) {

  const swatches =
    Array.from(
      detail.querySelectorAll(
        ".colors .color-swatch"
      )
    );


  if (!swatches.length)
    return;


  const mainImage =
    document.getElementById(
      "mainProductImage"
    );


  const addCartButton =
    detail.querySelector(
      ".add-cart"
    );


  function selectSwatch(
    swatch
  ) {

    swatches.forEach(
      s =>
        s.classList.remove(
          "active"
        )
    );


    swatch.classList.add(
      "active"
    );


    if (addCartButton) {

      addCartButton.dataset.color =
        swatch.dataset.name;

    }


    if (
      mainImage &&
      swatch.dataset.image
    ) {

      mainImage.src =
        swatch.dataset.image;

      mainImage.alt =
        `${product.name} - ${swatch.dataset.name}`;

    }

  }


  swatches.forEach(
    swatch => {

      swatch.addEventListener(
        "click",
        () =>
          selectSwatch(
            swatch
          )
      );

    }
  );


  /*
    First color
  */

  if (
    (product.colors || [])
      .length
  ) {

    const firstColor =
      resolveColor(
        product.colors[0]
      );


    if (addCartButton) {

      addCartButton.dataset.color =
        firstColor.name;

    }


    if (
      mainImage &&
      firstColor.image
    ) {

      mainImage.src =
        firstColor.image;

      mainImage.alt =
        `${product.name} - ${firstColor.name}`;

    }

  }

}


/*==========================================================
  PRODUCT NOT FOUND
==========================================================*/

function notFound() {

  document.title =
    "Product Not Found | Fashion Essentials";


  setMeta(
    "description",
    "The requested product is unavailable or has been removed."
  );


  detail.innerHTML = `

    <section class="product-not-found">

      <h1>
        Product not found
      </h1>

      <p>
        This product is unavailable
        or has been removed.
      </p>

      <a href="shop.html">
        Back to Shop
      </a>

    </section>

  `;

}


/*==========================================================
  LOAD PRODUCT
==========================================================*/

async function loadProduct() {

  /*
    No ID
  */

  if (!productId) {

    notFound();

    return;

  }


  try {

    const product =
      await FashionProducts.getProduct(
        productId
      );


    /*
      Product doesn't exist
    */

    if (!product) {

      notFound();

      return;

    }


    /*
      STEP 1:
      Apply AdminV1 SEO data.
    */

    updateProductSEO(
      product
    );


    /*
      STEP 2:
      Product structured data.
    */

    addProductSchema(
      product
    );


    /*
      Related products
    */

    const allProducts =
      await FashionProducts.getProducts();


    const relatedProducts =
      (product.related || [])

        .map(
          relatedId =>
            allProducts.find(
              item =>
                item.id === relatedId ||
                item.name === relatedId
            )
        )

        .filter(Boolean);


    const pricing =
      FashionProducts.getPricing(
        product
      );


    detail.innerHTML = `

      <section class="product-detail">

        <div class="product-gallery">

          <img
            id="mainProductImage"
            src="${product.image}"
            alt="${product.name}"
            loading="eager"
          >

        </div>


        <div class="product-info">

          <span>
            ${product.category || "Fashion Essentials"}
          </span>


          <h1>
            ${product.name}
          </h1>


          ${FashionProducts.priceMarkup(product)}


          <p>
            ${product.description || ""}
          </p>


          <div class="product-options">

            <strong>
              Colors
            </strong>


            <div class="colors">

              ${colorMarkup(
                product.colors
              )}

            </div>

          </div>


          <div class="product-options">

            <strong>
              Sizes
            </strong>


            <div class="size-list">

              ${(product.sizes || [])
                .map(
                  size =>
                    `<span>${size}</span>`
                )
                .join("")}

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

        <h2>
          Related Products
        </h2>


        <div class="product-grid">

          ${relatedProducts
            .map(
              item => `

                <article class="product-card">

                  <a
                    href="product.html?id=${item.id}"
                    class="product-link"
                  >

                    <img
                      src="${item.image}"
                      alt="${item.name}"
                      loading="lazy"
                    >


                    <h3>
                      ${item.name}
                    </h3>

                  </a>


                  ${FashionProducts.priceMarkup(
                    item
                  )}

                </article>

              `
            )
            .join("")}

        </div>

      </section>

    `;


    bindColorSwatches(
      product
    );


  } catch (error) {

    console.error(
      "Failed to load product:",
      error
    );

    notFound();

  }

}


/*==========================================================
  INITIALIZE
==========================================================*/

loadProduct();
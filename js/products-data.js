/*==========================================================*
 * Fashion Essentials
 * File: products-data.js
 * Description: Storefront Product Data
 * Source: Supabase
 *==========================================================*/

const SUPABASE_URL =
  "https://omnlwbmahntspldbzarj.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_ET-KSHRDbelW54DQ_ql-ag_7zAUX5gk";


const FashionProducts = (() => {

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }


  function splitList(value) {
    return String(value || "")
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);
  }


  async function request(url, options = {}) {

    const response = await fetch(url, {
      cache: "no-store",
      ...options,
    });

    if (!response.ok) {

      const message = await response.text();

      throw new Error(
        `Request failed (${response.status}): ${message}`
      );
    }

    return response.json();
  }


  function normalizeProduct(product) {

    const data =
      product.data &&
      typeof product.data === "object"
        ? product.data
        : {};


    const images =
      Array.isArray(product.images)
        ? product.images
        : [];


    return {

      ...product,

      ...data,

      id:
        product.id ||
        slugify(product.name),

      image:
        product.image ||
        images[0] ||
        "",

      images,

      colors:
        Array.isArray(product.colors)
          ? product.colors
          : Array.isArray(data.colors)
          ? data.colors
          : [],

      sizes:
        Array.isArray(product.sizes)
          ? product.sizes
          : Array.isArray(data.sizes)
          ? data.sizes
          : [],

      // Admin panel's "Related products" picker saves an array of product
      // IDs under relatedProductIds. Fall back to that if "related" (a
      // separate, never-populated field) isn't set.
      related:
        Array.isArray(product.related)
          ? product.related
          : Array.isArray(data.related)
          ? data.related
          : Array.isArray(product.relatedProductIds)
          ? product.relatedProductIds
          : Array.isArray(data.relatedProductIds)
          ? data.relatedProductIds
          : [],

      description:
        product.description ||
        data.description ||
        "",

      status:
        product.status ||
        "Active",

      stock:
        Number(product.stock) || 0,
    };
  }


  async function getProducts() {

    const url =
      `${SUPABASE_URL}/rest/v1/products` +
      `?select=*` +
      `&order=created_at.desc`;


    const products = await request(url, {

      headers: {

        apikey:
          SUPABASE_ANON_KEY,

        Authorization:
          `Bearer ${SUPABASE_ANON_KEY}`,

      },

    });


    return products.map(normalizeProduct);
  }


  async function getProduct(id) {

    const url =
      `${SUPABASE_URL}/rest/v1/products` +
      `?select=*` +
      `&id=eq.${encodeURIComponent(id)}` +
      `&limit=1`;


    const products = await request(url, {

      headers: {

        apikey:
          SUPABASE_ANON_KEY,

        Authorization:
          `Bearer ${SUPABASE_ANON_KEY}`,

      },

    });


    return products.length
      ? normalizeProduct(products[0])
      : null;
  }


  function getPricing(product) {

    const regular = Number(product.price) || 0;

    const sale =
      product.salePrice !== undefined &&
      product.salePrice !== null &&
      product.salePrice !== "" &&
      Number(product.salePrice) > 0 &&
      Number(product.salePrice) < regular
        ? Number(product.salePrice)
        : null;

    return {
      regular,
      sale,
      effective: sale !== null ? sale : regular,
      onSale: sale !== null,
      percentOff:
        sale !== null
          ? Math.round(((regular - sale) / regular) * 100)
          : 0,
    };
  }


  function priceMarkup(product) {

    const pricing = getPricing(product);

    if (!pricing.onSale) {
      return `<p class="price">PKR ${pricing.regular.toLocaleString(
        "en-PK"
      )}</p>`;
    }

    return `
      <p class="price-row">
        <span class="price">PKR ${pricing.effective.toLocaleString(
          "en-PK"
        )}</span>
        <span class="price-compare">PKR ${pricing.regular.toLocaleString(
          "en-PK"
        )}</span>
        <span class="price-badge">${pricing.percentOff}% OFF</span>
      </p>
    `;
  }


  return {

    slugify,

    splitList,

    getProducts,

    getProduct,

    getPricing,

    priceMarkup,

  };

})();
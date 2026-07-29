const FashionProducts = (() => {
  const LOCAL_API = "http://localhost:3000/api/products";
  const JSON_FILE = "data/products.json";

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
      credentials: "include",
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    return response.json();
  }

  function normalizeProduct(product) {
    return {
      ...product,
      id: product.id || slugify(product.name),
      image: product.image || (product.images?.[0] ?? ""),
      images:
        Array.isArray(product.images) && product.images.length
          ? product.images
          : product.image
          ? [product.image]
          : [],
      colors: Array.isArray(product.colors) ? product.colors : [],
      sizes: Array.isArray(product.sizes) ? product.sizes : [],
      related: Array.isArray(product.related) ? product.related : [],
      status: product.status || "Active",
      stock: Number(product.stock) || 0,
    };
  }

  async function getProducts() {
    const products = await request(JSON_FILE);
    return products.map(normalizeProduct);
  }

  async function getProduct(id) {
    const products = await getProducts();
    return products.find(p => p.id === id) || null;
  }

  // Local Admin Only
  async function upsertProduct(product) {
    const saved = await request(LOCAL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    return normalizeProduct(saved);
  }

  // Local Admin Only
  async function deleteProduct(id) {
    return request(`${LOCAL_API}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  return {
    slugify,
    splitList,
    getProducts,
    getProduct,
    upsertProduct,
    deleteProduct,
  };
})();
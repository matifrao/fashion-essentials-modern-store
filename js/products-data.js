const FashionProducts = (() => {
  const apiBase = "/api/products";

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
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function request(url, options = {}) {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      credentials: "same-origin",
      ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  }

  function normalizeProduct(product) {
    return {
      ...product,
      id: product.id || slugify(product.name),
      image: product.image || product.images?.[0] || "",
      images: product.images?.length ? product.images : [product.image].filter(Boolean),
      colors: product.colors || [],
      sizes: product.sizes || [],
      related: product.related || [],
      status: product.status || "Active",
      stock: Number(product.stock) || 0,
    };
  }

  async function getProducts() {
    return request(apiBase);
  }

  async function getProduct(id) {
    return request(`${apiBase}/${encodeURIComponent(id)}`);
  }

  async function upsertProduct(product) {
    return request(apiBase, {
      method: "POST",
      body: JSON.stringify(normalizeProduct(product)),
    });
  }

  async function deleteProduct(id) {
    return request(`${apiBase}/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  return {
    deleteProduct,
    getProduct,
    getProducts,
    slugify,
    splitList,
    upsertProduct,
  };
})();

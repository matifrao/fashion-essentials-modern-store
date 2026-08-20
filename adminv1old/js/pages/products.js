/*==========================================================
  Fashion Essentials Admin V1
  File: products.js
  Description: Products Page
  Version: 1.0
==========================================================*/

import API from "../core/api.js";

class Products {
  constructor() {
    this.products = [];
    this.filteredProducts = [];

    this.table = document.getElementById("productsTable");

    this.search = document.getElementById("searchProduct");

    this.status = document.getElementById("filterStatus");

    this.category = document.getElementById("filterCategory");

    this.brand = document.getElementById("filterBrand");

    this.addButton = document.getElementById("addProductBtn");
  }

  async init() {
    await this.loadProducts();

    this.bindEvents();
  }

  async loadProducts() {
    try {
      const data = await API.get("/products");

      this.products = Array.isArray(data) ? data : [];

      this.filteredProducts = [...this.products];

      this.render();
    } catch (error) {
      console.error(error);

      this.renderEmpty();
    }
  }

  bindEvents() {
    if (this.search) {
      this.search.addEventListener("input", () => {
        this.filter();
      });
    }

    if (this.status) {
      this.status.addEventListener("change", () => {
        this.filter();
      });
    }

    if (this.category) {
      this.category.addEventListener("change", () => {
        this.filter();
      });
    }

    if (this.brand) {
      this.brand.addEventListener("change", () => {
        this.filter();
      });
    }

    if (this.addButton) {
      this.addButton.addEventListener("click", () => {
        window.location.href = "product-add.html";
      });
    }
  }

  filter() {
    const keyword = this.search.value.toLowerCase().trim();

    const status = this.status.value;

    const category = this.category.value;

    const brand = this.brand.value;

    this.filteredProducts = this.products.filter((product) => {
      const matchKeyword =
        !keyword || product.name.toLowerCase().includes(keyword);

      const matchStatus = !status || product.status === status;

      const matchCategory = !category || product.category === category;

      const matchBrand = !brand || product.brand === brand;

      return matchKeyword && matchStatus && matchCategory && matchBrand;
    });

    this.render();
  }

  render() {
    if (!this.filteredProducts.length) {
      this.renderEmpty();

      return;
    }

    this.table.innerHTML = this.filteredProducts
      .map(
        (product) => `

            <tr>

                <td>

                    <img

                        src="${product.images?.[0] || "images/no-image.png"}"

                        class="product-thumb"

                        alt="${product.name}">

                </td>

                <td>

                    <div class="product-name">

                        ${product.name}

                    </div>

                    <span class="product-sku">

                        ${product.sku || "-"}

                    </span>

                </td>

                <td>

                    ${product.category || "-"}

                </td>

                <td>

                    Rs. ${Number(product.price || 0).toLocaleString()}

                </td>

                <td class="${product.stock <= 5 ? "stock-low" : "stock-normal"}">

                    ${product.stock ?? 0}

                </td>

                <td>

                    <span class="product-status product-status--${(product.status || "draft").toLowerCase()}">

                        ${product.status || "Draft"}

                    </span>

                </td>

                <td>

                    <div class="product-actions">

                        <button

                            class="btn btn-sm btn-primary edit-btn"

                            data-id="${product.id}">

                            Edit

                        </button>

                        <button

                            class="btn btn-sm btn-danger delete-btn"

                            data-id="${product.id}">

                            Delete

                        </button>

                    </div>

                </td>

            </tr>

        `,
      )
      .join("");

    this.bindTableEvents();
  }

  renderEmpty() {
    this.table.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="products-empty">

                        No products found.

                    </div>

                </td>

            </tr>

        `;
  }

  bindTableEvents() {
    this.table.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;

        window.location.href = `product-edit.html?id=${id}`;
      });
    });

    this.table.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;

        if (!confirm("Delete this product?")) return;

        try {
          await API.delete(`/products/${id}`);

          await this.loadProducts();
        } catch (error) {
          console.error(error);

          alert("Unable to delete product.");
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();

  products.init();
});
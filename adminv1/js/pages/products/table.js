/*==========================================================
  Fashion Essentials Admin V1
  File: table.js
  Module: Products
  Description: Product Table Renderer
  Version: 2.0
==========================================================*/

import API from "../../core/api.js";

export class ProductTable {
  constructor(page) {
    this.page = page;

    this.table = document.getElementById("productsTable");

    this.tableInfo = document.getElementById("tableInfo");
  }

  render() {
    if (!this.table) return;

    const products = this.page.pagination.getProducts();

    if (!products.length) {
      this.renderEmpty();
      this.updateCounter(0, this.page.products.length);
      return;
    }

    this.table.innerHTML = products
      .map(
        (product) => `
<tr>

    <td>

        <input
            type="checkbox"
            class="row-checkbox"
            data-id="${product.id}">

    </td>

    <td>

        <img
            src="${product.images?.[0] || "images/no-image.png"}"
            alt="${product.name || ""}"
            class="product-thumb">

    </td>

    <td>

        <div class="product-name">

            ${product.name || "-"}

        </div>

        <span class="product-sku">

            ${product.sku || "-"}

        </span>

    </td>

    <td>

        ${product.category || "-"}

    </td>

    <td>

        ${this.formatPrice(product.price)}

    </td>

    <td class="${this.stockClass(product.stock)}">

        ${product.stock ?? 0}

    </td>

    <td>

        <span class="product-status product-status--${this.statusClass(product.status)}">

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

    this.updateCounter(products.length, this.page.products.length);

    this.bindEvents();
  }

  renderEmpty() {
    this.table.innerHTML = `
<tr>

    <td colspan="8">

        <div class="products-empty">

            <h3>No Products Found</h3>

            <p>Create your first product.</p>

        </div>

    </td>

</tr>
`;
  }

  bindEvents() {
    this.table.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", () => {
        window.location.href = `product.html?id=${button.dataset.id}`;
      });
    });

    this.table.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!confirm("Delete this product?")) return;

        try {
          await API.delete(`/products/${button.dataset.id}`);

          await this.page.loadProducts();

          this.page.refresh();
        } catch (error) {
          console.error(error);

          alert("Unable to delete product.");
        }
      });
    });
  }

  updateCounter(showing, total) {
    if (!this.tableInfo) return;

    this.tableInfo.textContent = `Showing ${showing} of ${total} products`;
  }

  formatPrice(price) {
    return `Rs. ${Number(price || 0).toLocaleString()}`;
  }

  stockClass(stock) {
    return Number(stock) <= 5 ? "stock-low" : "stock-normal";
  }

  statusClass(status) {
    return (status || "draft").toLowerCase();
  }
}

/*==========================================================
  Fashion Essentials Admin V1
  File: filters.js
  Module: Products
  Description: Product Filters
  Version: 2.0
==========================================================*/

export class ProductFilters {
  constructor(page) {
    this.page = page;

    this.search = document.getElementById("searchProduct");

    this.status = document.getElementById("filterStatus");

    this.category = document.getElementById("filterCategory");

    this.brand = document.getElementById("filterBrand");

    this.resetButton = document.getElementById("resetFiltersBtn");
  }

  init() {
    this.populateFilters();

    this.bindEvents();
  }

  bindEvents() {
    if (this.search) {
      this.search.addEventListener("input", () => this.apply());
    }

    if (this.status) {
      this.status.addEventListener("change", () => this.apply());
    }

    if (this.category) {
      this.category.addEventListener("change", () => this.apply());
    }

    if (this.brand) {
      this.brand.addEventListener("change", () => this.apply());
    }

    if (this.resetButton) {
      this.resetButton.addEventListener("click", () => this.reset());
    }
  }

  populateFilters() {
    this.populateCategories();

    this.populateBrands();
  }

  populateCategories() {
    if (!this.category) return;

    const categories = [
      ...new Set(
        this.page.products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ].sort();

    this.category.innerHTML = `
      <option value="">All Categories</option>
      ${categories
        .map(
          (category) =>
            `<option value="${category}">${category}</option>`
        )
        .join("")}
    `;
  }

  populateBrands() {
    if (!this.brand) return;

    const brands = [
      ...new Set(
        this.page.products
          .map((product) => product.brand)
          .filter(Boolean)
      ),
    ].sort();

    this.brand.innerHTML = `
      <option value="">All Brands</option>
      ${brands
        .map(
          (brand) =>
            `<option value="${brand}">${brand}</option>`
        )
        .join("")}
    `;
  }

  apply() {
    const keyword = (this.search?.value || "")
      .toLowerCase()
      .trim();

    const status = this.status?.value || "";

    const category = this.category?.value || "";

    const brand = this.brand?.value || "";

    this.page.filteredProducts = this.page.products.filter((product) => {
      const name = (product.name || "").toLowerCase();

      const sku = (product.sku || "").toLowerCase();

      const barcode = (product.barcode || "").toLowerCase();

      const matchKeyword =
        keyword === "" ||
        name.includes(keyword) ||
        sku.includes(keyword) ||
        barcode.includes(keyword);

      const matchStatus =
        !status || product.status === status;

      const matchCategory =
        !category || product.category === category;

      const matchBrand =
        !brand || product.brand === brand;

      return (
        matchKeyword &&
        matchStatus &&
        matchCategory &&
        matchBrand
      );
    });

    if (this.page.pagination) {
      this.page.pagination.reset();
    }

    this.page.refresh();
  }

  reset() {
    if (this.search) this.search.value = "";

    if (this.status) this.status.value = "";

    if (this.category) this.category.value = "";

    if (this.brand) this.brand.value = "";

    this.page.filteredProducts = [...this.page.products];

    if (this.page.pagination) {
      this.page.pagination.reset();
    }

    this.page.refresh();
  }

  refresh() {
    this.populateFilters();
  }
}
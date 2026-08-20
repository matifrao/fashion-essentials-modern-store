/*==========================================================
  Fashion Essentials Admin V1
  File: index.js
  Module: Products
  Description: Products Page Controller
  Version: 2.1
==========================================================*/

import API from "../../core/api.js";

import { ProductFilters } from "./filters.js";
import { ProductTable } from "./table.js";
import { ProductPagination } from "./pagination.js";
import { ProductBulk } from "./bulk.js";
import { ProductEvents } from "./events.js";

class ProductsPage {
  constructor() {

    this.state = {

      products: [],

      filteredProducts: [],

      currentPage: 1,

      pageSize: 10,

      totalPages: 1,

      selectedProducts: new Set(),

      sortBy: "name",

      sortDirection: "asc"

    };

    this.filters = null;

    this.table = null;

    this.pagination = null;

    this.bulk = null;

    this.events = null;
  }

  async init() {

    await this.loadProducts();

    this.initializeModules();

    this.render();

  }

  async loadProducts() {

    try {

      const data = await API.get("/products");

      this.state.products = Array.isArray(data) ? data : [];

      this.state.filteredProducts = [...this.state.products];

    } catch (error) {

      console.error(error);

      this.state.products = [];

      this.state.filteredProducts = [];

    }

  }

  initializeModules() {

    this.filters = new ProductFilters(this);

    this.table = new ProductTable(this);

    this.pagination = new ProductPagination(this);

    this.bulk = new ProductBulk(this);

    this.events = new ProductEvents(this);

    this.filters.init();

    this.pagination.init();

    this.bulk.init();

    this.events.init();

  }

  render() {

    this.table.render();

    this.pagination.render();

    this.bulk.update();

  }

  refresh() {

    this.render();

  }

}

document.addEventListener("DOMContentLoaded", async () => {

  const page = new ProductsPage();

  await page.init();

});

export default ProductsPage;
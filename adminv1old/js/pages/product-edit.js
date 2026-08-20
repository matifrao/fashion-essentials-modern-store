/*==========================================================
  Fashion Essentials Admin V1
  File: product-edit.js
  Description: Edit Product Page
  Version: 1.0
==========================================================*/

import API from "../core/api.js";

class ProductEdit {

    constructor() {

        this.id = new URLSearchParams(window.location.search).get("id");

        this.form = document.getElementById("productEditForm");

        this.productId = document.getElementById("productId");

        this.name = document.getElementById("productName");

        this.slug = document.getElementById("productSlug");

        this.sku = document.getElementById("productSku");

        this.barcode = document.getElementById("productBarcode");

        this.category = document.getElementById("productCategory");

        this.brand = document.getElementById("productBrand");

        this.description = document.getElementById("productDescription");

        this.cancelButton = document.getElementById("cancelBtn");

    }

    async init() {

        if (!this.id) {

            alert("Invalid product.");

            window.location.href = "products.html";

            return;

        }

        await this.loadCategories();

        await this.loadBrands();

        await this.loadProduct();

        this.bindEvents();

    }

    bindEvents() {

        this.name.addEventListener("input", () => {

            this.slug.value = this.createSlug(this.name.value);

        });

        this.form.addEventListener("submit", event => {

            event.preventDefault();

            this.update();

        });

        this.cancelButton.addEventListener("click", () => {

            window.location.href = "products.html";

        });

    }

    createSlug(text) {

        return text

            .toLowerCase()

            .trim()

            .replace(/[^\w\s-]/g, "")

            .replace(/\s+/g, "-")

            .replace(/-+/g, "-");

    }

    async loadCategories() {

        try {

            const categories = await API.get("/categories");

            this.category.innerHTML =
                `<option value="">Select Category</option>`;

            categories.forEach(category => {

                this.category.insertAdjacentHTML(

                    "beforeend",

                    `<option value="${category.name}">
                        ${category.name}
                    </option>`

                );

            });

        }

        catch (error) {

            console.error(error);

        }

    }

    async loadBrands() {

        try {

            const brands = await API.get("/brands");

            this.brand.innerHTML =
                `<option value="">Select Brand</option>`;

            brands.forEach(brand => {

                this.brand.insertAdjacentHTML(

                    "beforeend",

                    `<option value="${brand.name}">
                        ${brand.name}
                    </option>`

                );

            });

        }

        catch (error) {

            console.error(error);

        }

    }

    async loadProduct() {

        try {

            const product = await API.get(`/products/${this.id}`);

            this.fillForm(product);

        }

        catch (error) {

            console.error(error);

            alert("Unable to load product.");

            window.location.href = "products.html";

        }

    }

    fillForm(product) {

        this.productId.value = product.id || "";

        this.name.value = product.name || "";

        this.slug.value = product.slug || "";

        this.sku.value = product.sku || "";

        this.barcode.value = product.barcode || "";

        this.category.value = product.category || "";

        this.brand.value = product.brand || "";

        this.description.value = product.description || "";

    }

    validate() {

        if (!this.name.value.trim()) {

            alert("Product name is required.");

            this.name.focus();

            return false;

        }

        if (!this.category.value) {

            alert("Please select a category.");

            this.category.focus();

            return false;

        }

        return true;

    }

    getFormData() {

        return {

            id: this.productId.value,

            name: this.name.value.trim(),

            slug: this.slug.value.trim(),

            sku: this.sku.value.trim(),

            barcode: this.barcode.value.trim(),

            category: this.category.value,

            brand: this.brand.value,

            description: this.description.value.trim(),

            updatedAt: new Date().toISOString()

        };

    }

    async update() {

        if (!this.validate()) return;

        try {

            await API.put(

                `/products/${this.id}`,

                this.getFormData()

            );

            alert("Product updated successfully.");

            window.location.href = "products.html";

        }

        catch (error) {

            console.error(error);

            alert("Unable to update product.");

        }

    }

}

document.addEventListener(

    "DOMContentLoaded",

    () => {

        const page = new ProductEdit();

        page.init();

    }

);
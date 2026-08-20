/*==========================================================
  Fashion Essentials Admin V1
  File: product-add.js
  Description: Add Product Page
  Version: 1.0
==========================================================*/

import API from "../core/api.js";

class ProductAdd {

    constructor() {

        this.form = document.getElementById("productForm");

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

        await this.loadCategories();

        await this.loadBrands();

        this.bindEvents();

    }

    bindEvents() {

        this.name.addEventListener("input", () => {

            this.slug.value = this.createSlug(this.name.value);

        });

        this.form.addEventListener("submit", event => {

            event.preventDefault();

            this.save();

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

            name: this.name.value.trim(),

            slug: this.slug.value.trim(),

            sku: this.sku.value.trim(),

            barcode: this.barcode.value.trim(),

            category: this.category.value,

            brand: this.brand.value,

            description: this.description.value.trim(),

            status: "Draft",

            createdAt: new Date().toISOString(),

            updatedAt: new Date().toISOString()

        };

    }

    async save() {

        if (!this.validate()) return;

        try {

            const product = this.getFormData();

            await API.post("/products", product);

            alert("Product created successfully.");

            window.location.href = "products.html";

        }

        catch (error) {

            console.error(error);

            alert("Unable to save product.");

        }

    }

}

document.addEventListener("DOMContentLoaded", () => {

    const page = new ProductAdd();

    page.init();

});
/*==========================================================
  NexPage Commerce Platform

  File: general.js
  Description: General Product Information

  Module: Catalog / Products

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class ProductGeneral {

    constructor() {

        this.name = document.getElementById("productName");

        this.slug = document.getElementById("productSlug");

        this.sku = document.getElementById("productSku");

        this.barcode = document.getElementById("productBarcode");

        this.shortDescription = document.getElementById("shortDescription");

        this.description = document.getElementById("productDescription");

    }

    /*======================================================
      Initialize
    ======================================================*/

    init() {

        if (!this.name) return;

        this.bindEvents();

    }

    /*======================================================
      Events
    ======================================================*/

    bindEvents() {

        this.name.addEventListener("input", () => {

            if (!this.slug.value.trim()) {

                this.slug.value = this.createSlug(this.name.value);

            }

        });

    }

    /*======================================================
      Create Slug
    ======================================================*/

    createSlug(text = "") {

        return text

            .toLowerCase()

            .trim()

            .replace(/[^\w\s-]/g, "")

            .replace(/\s+/g, "-")

            .replace(/-+/g, "-")

            .replace(/^-|-$/g, "");

    }

    /*======================================================
      Validation
    ======================================================*/

    validate() {

        if (!this.name.value.trim()) {

            this.name.focus();

            return {

                valid: false,

                message: "Product name is required."

            };

        }

        return {

            valid: true,

            message: ""

        };

    }

    /*======================================================
      Get Data
    ======================================================*/

    getData() {

        return {

            name: this.name.value.trim(),

            slug: this.slug.value.trim(),

            sku: this.sku.value.trim(),

            barcode: this.barcode.value.trim(),

            shortDescription: this.shortDescription.value.trim(),

            description: this.description.value.trim()

        };

    }

    /*======================================================
      Set Data
    ======================================================*/

    setData(product = {}) {

        this.name.value = product.name || "";

        this.slug.value = product.slug || "";

        this.sku.value = product.sku || "";

        this.barcode.value = product.barcode || "";

        this.shortDescription.value = product.shortDescription || "";

        this.description.value = product.description || "";

    }

    /*======================================================
      Reset
    ======================================================*/

    reset() {

        this.name.value = "";

        this.slug.value = "";

        this.sku.value = "";

        this.barcode.value = "";

        this.shortDescription.value = "";

        this.description.value = "";

    }

}

export default new ProductGeneral();
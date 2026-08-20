/*==========================================================
  NexPage Commerce Platform

  File: validation.js
  Description: Product Validation Engine

  Module: Catalog / Products

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class ProductValidation {

    constructor() {

        this.errors = [];

    }

    /*======================================================
      Validate Entire Product
    ======================================================*/

    validate(product = {}) {

        this.errors = [];

        this.validateGeneral(product);

        this.validatePricing(product);

        this.validateInventory(product);

        this.validateShipping(product);

        this.validateSeo(product);

        return {

            valid: this.errors.length === 0,

            errors: this.errors

        };

    }

    /*======================================================
      General
    ======================================================*/

    validateGeneral(product) {

        if (!product.name?.trim()) {

            this.addError(

                "productName",

                "Product name is required."

            );

        }

        if (!product.slug?.trim()) {

            this.addError(

                "productSlug",

                "Slug is required."

            );

        }

    }

    /*======================================================
      Pricing
    ======================================================*/

    validatePricing(product) {

        if (product.price < 0) {

            this.addError(

                "productPrice",

                "Selling price cannot be negative."

            );

        }

        if (

            product.comparePrice > 0 &&

            product.comparePrice < product.price

        ) {

            this.addError(

                "productComparePrice",

                "Compare price should be greater than selling price."

            );

        }

    }

    /*======================================================
      Inventory
    ======================================================*/

    validateInventory(product) {

        if (

            product.trackInventory &&

            product.stock < 0

        ) {

            this.addError(

                "productStock",

                "Stock cannot be negative."

            );

        }

    }

    /*======================================================
      Shipping
    ======================================================*/

    validateShipping(product) {

        if (

            product.requiresShipping &&

            product.weight < 0

        ) {

            this.addError(

                "productWeight",

                "Weight cannot be negative."

            );

        }

    }

    /*======================================================
      SEO
    ======================================================*/

    validateSeo(product) {

        if (

            product.metaTitle &&

            product.metaTitle.length > 60

        ) {

            this.addError(

                "metaTitle",

                "Meta title should not exceed 60 characters."

            );

        }

        if (

            product.metaDescription &&

            product.metaDescription.length > 160

        ) {

            this.addError(

                "metaDescription",

                "Meta description should not exceed 160 characters."

            );

        }

    }

    /*======================================================
      Error Helper
    ======================================================*/

    addError(field, message) {

        this.errors.push({

            field,

            message

        });

    }

    /*======================================================
      Clear Errors
    ======================================================*/

    clear() {

        this.errors = [];

    }

    /*======================================================
      Show Errors
    ======================================================*/

    show() {

        this.clearHighlights();

        if (!this.errors.length) {

            return;

        }

        this.errors.forEach(error => {

            const field = document.getElementById(error.field);

            if (!field) return;

            field.classList.add("is-invalid");

        });

        alert(

            this.errors[0].message

        );

    }

    /*======================================================
      Remove Highlights
    ======================================================*/

    clearHighlights() {

        document

            .querySelectorAll(".is-invalid")

            .forEach(field => {

                field.classList.remove("is-invalid");

            });

    }

}

export default new ProductValidation();
/*==========================================================
  NexPage Commerce Platform

  File: save.js
  Description: Product Save Manager

  Module: Catalog / Products

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

import { productsApi } from "../../core/api.js";
import { supabase } from "../../core/supabase.js";

import general from "./general.js";
import media from "./media.js";
import sidebar from "./sidebar.js";
import pricing from "./pricing.js";
import inventory from "./inventory.js";
import variants from "./variants.js";
import shipping from "./shipping.js";
import seo from "./seo.js";
import validation from "./validation.js";

class ProductSave {

    constructor() {

        this.form = document.getElementById("productForm");

        this.saveButton = document.getElementById("saveBtn");

        this.cancelButton = document.getElementById("cancelBtn");

    }

    /*======================================================
      Initialize
    ======================================================*/

    init() {

        if (!this.form) return;

        this.bindEvents();

    }

    /*======================================================
      Events
    ======================================================*/

    bindEvents() {

        this.form.addEventListener("submit", async (event) => {

            event.preventDefault();

            await this.save();

        });

        this.cancelButton?.addEventListener("click", () => {

            window.location.href = "products.html";

        });

    }

    /*======================================================
      Collect Product Data
    ======================================================*/

    getProduct() {

        return {
            id: this.form?.dataset.productId || "",

            ...general.getData(),

            ...media.getData(),

            ...sidebar.getData(),

            ...pricing.getData(),

            ...inventory.getData(),

            variants: variants.getData(),

            ...shipping.getData(),

            ...seo.getData(),

            updatedAt: new Date().toISOString()

        };

    }

    /*======================================================
      Save Product
    ======================================================*/

    async save() {

        try {

            const product = this.getProduct();

            const result = validation.validate(product);

            if (!result.valid) {

                validation.show();

                return;

            }

            this.toggleLoading(true);
            product.images = await Promise.all((product.images || []).map(image => image instanceof File ? supabase.upload(image) : image));

            if (product.id) {

                await productsApi.update(

                    product.id,

                    product

                );

            }

            else {

                product.createdAt = new Date().toISOString();

                await productsApi.create(product);

            }

            alert("Product saved successfully.");

            window.location.href = "products.html";

        }

        catch (error) {

            console.error(error);

            alert(

                error.message ||

                "Unable to save product."

            );

        }

        finally {

            this.toggleLoading(false);

        }

    }

    /*======================================================
      Loading State
    ======================================================*/

    toggleLoading(loading) {

        if (!this.saveButton) return;

        this.saveButton.disabled = loading;

        this.saveButton.textContent = loading

            ? "Saving..."

            : "Save Product";

    }

}

export default new ProductSave();
